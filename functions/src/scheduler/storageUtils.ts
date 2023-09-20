const functions = require('firebase-functions');
const fileBucket = functions.config().file.bucket;
const admin = require('firebase-admin');
export async function makeCopy(sourceFile) {
	const bucket = admin.storage().bucket(fileBucket);
	let startFilePath = sourceFile.substring(0, sourceFile.lastIndexOf('.'));
	console.log(`startFilePath ${startFilePath}`);
	let endFilePath = sourceFile.substring(sourceFile.lastIndexOf('.') + 1);
	console.log(`endFilePath ${endFilePath}`);
	let newFilePath = `${startFilePath}-Copy-${new Date().getTime()}.${endFilePath}`;
	console.log(`newFilePath ${newFilePath}`);
	await bucket.file(sourceFile).copy(bucket.file(newFilePath));
	return newFilePath;
}
