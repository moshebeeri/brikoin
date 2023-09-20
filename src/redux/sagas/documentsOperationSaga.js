import { call, put, takeEvery , select, all} from "redux-saga/effects";
import { types } from "../../redux/actions/documentOperations";
import rsf from "../rsf";
import { uploadFile , uploadSimpleFile} from "./propertyLoaderSaga";
const files = state => state.documentOperaions.files;
const loadedFiles = state => state.documentOperaions.loadFiles;
const loadedFilesTime = state => state.documentOperaions.loadStartingFiles;
export const lang = state => state.userProfileReducer.lang;
function* saveDocumentAttributes(action) {
  console.log(JSON.stringify(action));
  let query = rsf.app
    .database()
    .ref(`server/legalDocuments/${action.document.id}/attributes`);
  yield call([query, query.set], {
    ...action.attributes
  });
  let documentAttributes = rsf.app
    .database()
    .ref(`server/operationHub/${action.user.uid}/documentsAttributes`);
  let attributes = yield call(function() {
    return new Promise(function(resolve) {
      documentAttributes.once("value", function(snap) {
        let attributes = snap.val();
        resolve(attributes ? attributes : {});
      });
    });
  });
  let userGeneralAttributes = Object.assign(attributes, action.attributes);
  yield call([documentAttributes, query.set], {
    ...userGeneralAttributes
  });
}

function* loadFiles(action){
  let files = action.files
  let path = action.filePath
  yield put({
    type: types.FILE_LOADING,
    files: files
  });
  yield all(files.map(file => call(loadFile, file, path, action.noTemplate)));
  
}


function* loadFile(file, filePath, noTemplate){
  const currentFiles =  yield select(files)
  const currentloadedFiles = yield select(loadedFiles)
  const currentloadedFilesTime = yield select(loadedFilesTime)
  if(currentFiles && currentFiles[`${filePath}/${file}`]){
    return
  }

  if( currentloadedFiles && currentloadedFiles[`${filePath}/${file}`]){
    if( currentloadedFilesTime && currentloadedFilesTime[`${filePath}/${file}`] - new Date().getTime() < 10000000){
      return
    }
  }

  yield put({
    type: types.LOAD_FILE,
    fileName: `${filePath}/${file}`
  });
  let storage = rsf.app.storage();
  let pathReference = noTemplate ? storage.ref(`${filePath}/${file}`) : storage.ref(`/documentsTemplates/${filePath}/${file}`);
  let url =  yield call([pathReference,pathReference.getDownloadURL])
  console.log(`download url ${url}`)
  let blob = yield call(downLoadFile, url)
  let textFile = yield call(blobToString, blob)
  console.log('download done')
  yield put({
    type: types.FILE_LOADED,
    file: textFile,
    fileName: `${filePath}/${file}`,
    orginalFileName:file
  });
}



function downLoadFile(url){
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function (event){
    console.log('file downLoaded')
    resolve(xhr.response)
  }
  console.log('calling file loading open')
  xhr.open('GET', url)
  console.log('calling file loading send')
  xhr.send()
})
}

function blobToString(blob){
  return new Promise(resolve => {
      const reader = new FileReader();
      // This fires after the blob has been read/loaded.
      reader.addEventListener('loadend', (e) => {
        let text = e.srcElement.result;
        text = text.split('�').join(' ')
        resolve(text)
        
      });
      // Start reading the blob as text.
      reader.readAsText(blob);
  })

}


function* saveFile(action) {
  yield put({
    type: types.UPLOADING_FILE
  });
  let documentId = action.document.id;
  if (!documentId) {
    documentId = yield createDocument(action.operation, action.user);
  }
  const metadata = yield uploadFile(
    action.file,
    `users/${action.user.uid}/documents/${documentId}/`
  );
  let query = rsf.app.database().ref(`server/legalDocuments/${documentId}`);
  yield call([query, query.update], {
    signedDocumentMd5: metadata.md5,
    signedDocument: metadata.url,
    documentPath: metadata.file
  });
  if (action.isPdf) {
    let signPdf = rsf.app.database().ref(`server/operations/events/signPdf`);
    yield call([signPdf, signPdf.push], {
    
      filePath: `users/${action.user.uid}/documents/${documentId}/${metadata.file}`,
      fileName: metadata.file,
      documentId: documentId,
      operationId: action.operation.id,
      active: true,
      user: action.user.uid
    });
    let signPdfTrigger = rsf.app
      .database()
      .ref(`server/operations/events/signPdfTriggerEvent`);
    yield call([signPdfTrigger, signPdfTrigger.set], {
      time: new Date().getTime()
    });
  }
  yield put({
    type: types.UPLOADING_FILE_DONE
  });
}



function* saveSimpleFile(action) {
  yield put({
    type: types.UPLOADING_FILE
  });
  let documentId = action.document.id;
  if (!documentId) {
    documentId = yield createDocument(action.operation, action.user);
  }

  const metadata = yield uploadSimpleFile(
    action.file,
    `${action.userDocumentPath}/${documentId}/${action.file.name}`,
  );
  let query = rsf.app.database().ref(`server/legalDocuments/${documentId}`);
  yield call([query, query.update], {
    signedDocumentMd5: metadata.md5,
    signedDocument: metadata.url,
    documentPath:  `${action.userDocumentPath}/${documentId}`,
    fileName: action.file.name
  });
 
  yield put({
    type: types.UPLOADING_FILE_DONE
  });
}

function* createDocument(operation, user) {
  let document = {
    owner: user.uid,
    type: operation.type,
    project: operation.project
  };
  let query = rsf.app.database().ref(`server/legalDocuments/`);
  let result = yield call([query, query.push], document);
  let documentKey = result.key;
  let operationQuery = rsf.app
    .database()
    .ref(`server/operationHub/${user.uid}/operations/${operation.id}`);
  yield call([operationQuery, operationQuery.update], {
    document: documentKey
  });
  return documentKey;
}

export default function* documentsOperationSaga() {
  yield [
    takeEvery(types.SAVE_DOCUMENT_ATTRIBUTES, saveDocumentAttributes),
    takeEvery(types.SAVE_FILE, saveFile),
    takeEvery(types.SAVE_SIMPLE_FILE, saveSimpleFile),
    
    takeEvery(types.LOAD_FILES, loadFiles)
  ];
}
