const apiKey =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwNjJkYWMzY2ZjNTNiZmYxZGQ5ODZjNTBhZDRlNGI1ZDI3ODRiYThiNmM4MzYzYmU3MTY3ZDEzZTAxZTBlNTE4Nzc0Y2MwYTE0M2VjZTUzIn0.eyJhdWQiOiIxIiwianRpIjoiNDA2MmRhYzNjZmM1M2JmZjFkZDk4NmM1MGFkNGU0YjVkMjc4NGJhOGI2YzgzNjNiZTcxNjdkMTNlMDFlMGU1MTg3NzRjYzBhMTQzZWNlNTMiLCJpYXQiOjE1ODYyNjMzMzQsIm5iZiI6MTU4NjI2MzMzNCwiZXhwIjo0NzQxOTM2OTM0LCJzdWIiOiI0MTQxMzU2OCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.SUinLdo_XYl4XRjPf3pr14wlDuq94iMNKsbZ82RQ68WVh6W1W1kqCZR_dFRzHBY7ItMIlQcib8dn25zcoucCq2IbddftRdFb3wmXHuPPnpxw0xOTxPpx2eYiC5sWfg-udIXHYBYtjEs3NmiqTbkUKWwjLRBZ3uq3BjNqt-ekSB_uS212KlGp8zwfOPlTiIxFXpiyuy9b70t_pVPSIdyKLWghnJxkuw31ArqJvfgjxPusIV1i_SUCez7GEPcLtfDKcnsbWi-t-_eHZh5SwmhoiEI9bCommXqNFwZ3OphWdOiX-4jf11uxgm0J8XdO5A2_wev3iolJr7mVufMrdj6_eOnjH8NX6_hcsF4fXv6SF3LFxEnR_3pQpLlZHN1TGNyptGfu1tuqYTHFuyBFwHnr3oHRYwt5qUcwDroENKurWfSrW8mTn0dyxuK_a6tb2KgDt-7011jIoHBveGea1HT2OJMz-LiP3XBuxZe2t6dyV6XM_AeAevIZD8AfIMaDLmFDgQDZddiISb5fxnX--y0w9VOttdKr_1CDmXFKjL-lUAIZGmYUZ1oDnDKKcEkbPfGHeUgH3h3cjpc8lb49NBuLU4MKyvRq5sKjZHWK4xeOEnEgowsgpVZj9ruRa8aSn6RnGktIOy-Iyq1TiTynvElmCrc56A-wBw1kYzaDZaD4G-M';
import CloudConvert from 'cloudconvert';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');
const cloudConvert = new CloudConvert(apiKey);
const fileBucket = functions.config().file.bucket;

export async function convertFile(fileName, filePath, sourceFormat, destFormat, metadata) {
	if (!fileName) {
		return 'failed missing file name ';
	}
	if (!filePath) {
		return 'failed missing file patn ';
	}
	if (!sourceFormat) {
		return 'failed missing source format ';
	}
	if (!destFormat) {
		return 'failed missing dest format ';
	}
	console.log('creating cloud upload file job');
	let jobName = `upload-file-${new Date().getTime()}`;
	let jobJson = {};
	jobJson['tasks'] = {};
	jobJson['tasks'][jobName] = { operation: 'import/upload' };
	console.log(`jobJSon ${JSON.stringify(jobJson)}`);
	let job = <any>await cloudConvert.jobs.create({
		tasks: {
			'file-upload': {
				operation: 'import/upload'
			}
		}
	});

	const uploadTask = job.tasks.filter((task) => task.name === 'file-upload')[0];
	console.log(`file upload  ${filePath}/${fileName}`);
	const bucket = admin.storage().bucket(fileBucket);
	let tempFileName = `${fileName.substring(0, fileName.lastIndexOf('.'))}.${sourceFormat}`;
	const tempFilePath = path.join(os.tmpdir(), tempFileName);
	console.log(`tempFilePath ${tempFilePath}`);
	await bucket.file(`${filePath}/${fileName}`).download({ destination: tempFilePath });
	console.log(`file is ready for upload`);
	const inputFile = fs.createReadStream(tempFilePath);

	console.log(`start cloud cloud upload job`);
	await cloudConvert.tasks.upload(uploadTask, inputFile);
	console.log(`waiting for job to finish`);
	job = await cloudConvert.jobs.wait(job.id); // Wait for job completion

	console.log(`creating convert job`);
	console.log(`convert task id  ${uploadTask.id}`);
	job = <any>await cloudConvert.jobs.create({
		tasks: {
			'convert-my-file': {
				operation: 'convert',
				input: uploadTask.id,
				input_format: sourceFormat,
				output_format: destFormat
			}
		}
	});
	const convertTask = job.tasks.filter((task) => task.name === 'convert-my-file')[0];
	console.log(`waiting for job to finish`);
	job = await cloudConvert.jobs.wait(job.id); // Wait for job completion

	job = <any>await cloudConvert.jobs.create({
		tasks: {
			'export-my-file': {
				operation: 'export/url',
				input: convertTask.id
			}
		}
	});
	console.log(`export job`);
	job = await cloudConvert.jobs.wait(job.id);
	console.log(`job done`);
	const exportTask = job.tasks.filter((task) => task.operation === 'export/url' && task.status === 'finished')[0];

	const file = exportTask.result.files[0];

	console.log('done download file');
	console.log(
		`METADATA ${JSON.stringify({
			contentType: `application/${destFormat}`,
			customMetadata: metadata ? metadata : {}
		})}`
	);
	let downloadPath = await downloadFile(file.filename, file.url);
	console.log(`write file to bucket`);

	console.log(`file application/${destFormat}`);

	await bucket.upload(downloadPath, {
		destination: filePath + '/' + file.filename,
		metadata: {
			contentType: `application/${destFormat}`
		}
	});
	let newFile = bucket.file(filePath + '/' + file.filename);
	console.log('update metadata');
	await newFile.setMetadata({
		metadata: metadata
	});

	return 'success';
}

async function downloadFile(fileName, url) {
	return new Promise((resolve, reject) => {
		try {
			const tempFilePath = path.join(os.tmpdir(), fileName);
			let file = fs.createWriteStream(tempFilePath);
			https
				.get(url, function(response) {
					response.pipe(file);
					file.on('finish', function() {
						console.log('download FILE DONE');
						resolve(tempFilePath);
					});
				})
				.on('error', function(err) {
					// Handle errors
					fs.unlink(file); // Delete the file async. (But we don't check the result)
				});
		} catch (error) {
			reject(error);
		}
	});
}
