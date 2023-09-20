const functions = require('firebase-functions');
const admin = require('firebase-admin');

const algoliasearch = require('algoliasearch');
import { getInitilProjects } from './utils';
const client = algoliasearch('1VRM6EM4GQ', 'c2eaee0a6dd79ca5fdbe5558d132175d');
const index = client.initIndex(`${functions.config().index.env}-PROJECTS`);
export async function findProjects(query) {
	console.log(`search   index ${query}`);
	let result = await index.search(query);
	console.log(`results: ${JSON.stringify(result.hits)}`);
	return result.hits;
}

export async function findProjectsByAddress(address) {
	console.log(`search  index ${address}`);

	let result = await index.search(address);
	console.log(`results: ${JSON.stringify(result.hits)}`);
	return result.hits && result.hits.length > 0 ? result.hits[0] : '';
}

export async function findSubProject(parentProjectId) {
	console.log(`search ${parentProjectId}`);

	let result = await index.search(parentProjectId);
	console.log(`results: ${JSON.stringify(result.hits)}`);
	return result.hits ? result.hits.filter((project) => project.parentProjectId === parentProjectId) : [];
}

exports.updateProjectsIndex = functions.database.ref(`server/projectsCollections`).onWrite(async (change, context) => {
	console.log('START  updateProjectCollections');
	let projects = await getInitilProjects('');
	index.saveObjects(projects);
	console.log('END updateUserIndex');
});
