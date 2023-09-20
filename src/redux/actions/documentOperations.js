export const types = {
  SAVE_DOCUMENT_ATTRIBUTES: "SAVE_DOCUMENT_ATTRIBUTES",
  UPLOADING_FILE: "UPLOADING_FILE",
  UPLOADING_FILE_DONE: "UPLOADING_FILE_DONE",
  SAVE_FILE: "SAVE_FILE",
  LOAD_FILES: "LOAD_FILES",
  FILE_LOADED: "FILE_LOADED",
  "FILE_LOADED_DONE": "FILE_LOADED_DONE",
  "FILE_LOADING": "FILE_LOADING", 
  "SAVE_SIMPLE_FILE": "SAVE_SIMPLE_FILE",
  LOAD_FILE: "LOAD_FILE"
};

export const saveDocumentAttributes = (document, attributes, user) => {
  return {
    type: types.SAVE_DOCUMENT_ATTRIBUTES,
    document,
    attributes,
    user
  };
};

export const saveFile = (file, document, user, operation, isPdf) => {
  return {
    type: types.SAVE_FILE,
    document,
    file,
    user,
    operation,
    isPdf
  };
};


export const saveSimpleFile = (file, document, userDocumentPath, user, operation) => {
  return {
    type: types.SAVE_SIMPLE_FILE,
    file,
    document,
    userDocumentPath,
    user,
    operation
  };
};


export const loadFiles = (files, filePath, noTemplate) => {
  return {
    type: types.LOAD_FILES,
    files,
    filePath,
    noTemplate
  };
};
