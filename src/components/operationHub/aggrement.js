import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withUser } from "../../UI/warappers/withUser";
import { ApproveDialog, DocumentTemplateHtml } from "../../UI/index";
import {
  saveFile,
  loadFiles
} from "../../redux/actions/documentOperations";
import {saveDocumentAttrivutes} from './operationUtils' 
import LoadingCircular from "../../UI/loading/LoadingCircular";

function Aggrement(props) {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [loadFile, seltFileLoaded] = useState(false);
  useEffect(() => {
    if (!props.uploading && uploadingFile) {
      setUploadingFile(false);
      props.close();
    }
  }, [props.uploading]);

  useEffect(() => {
      seltFileLoaded(props.loading);
  }, [props.loading]);

  let unLoadedFiles  = props.operation.documentFiles.split(",").filter(key => props.files[`${props.operation.documentPath}/${key}`] ? '' : key).filter(key => key)
  if(unLoadedFiles.length > 0 ){
      props.loadFiles(unLoadedFiles, props.operation.documentPath)
      return (
        <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
          <LoadingCircular open />
        </div>
      );
  }
  let pages = props.operation.documentFiles.split(",").map(key => props.files[`${props.operation.documentPath}/${key}`]);
   
  return (
    <div>
      <DocumentTemplateHtml
        direction={props.direction}
        title={props.operation.name}
        fileName={props.operation.name}
        sendDocumentAction={setUploadingFile.bind(this, true)}
        documentSignedAction={saveFileOperation.bind(this, props)}
        pages={pages}
        saveDocumentAttributes={saveAttributes.bind(this, props, true)}
        documentValues={getDocumentValues(props)}
        documentDescriptor={props.operation.formDescriptor}
        t={props.t}
      />
      <ApproveDialog
        t={props.t}
        cancelAction={closeDialog.bind(this)}
        processDone={closeDialog.bind(this)}
        process={uploadingFile}
        hideAction
        processNow
        openDialog={uploadingFile}
        title={props.t("UploadingDocument")}
        approveMessage={props.t("UploadingDocumentMsg")}
      />
    </div>
  );
}

function closeDialog() {}

function saveFileOperation(props, file, state) {
  saveAttributes(props, false, state);
  props.saveFile(file, props.document, props.user, props.operation, true);
}

function saveAttributes(props, close, attributes) {
  let saveAttributes = {};
  let savedAttributes = getDocumentValues(props);
  let descriptors = props.operation.formDescriptor
  Object.keys(descriptors).forEach(attribute =>
  {
    saveAttributes[attribute] = attributes[attribute] ? attributes[attribute] : savedAttributes[attribute]
  })
 
  saveDocumentAttrivutes(props.document.id, saveAttributes);
  if (close) {
    props.close();
  }
}

function getDocumentValues(props) {
  return {
    date: new Date().getTime(),
    ...props.documentsAttributes,
    ...props.document.attributes
  };
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  uploading: state.documentOperaions.uploading,
  files: state.documentOperaions.files,
  loading: state.documentOperaions.loading,
  loadFiles: state.documentOperaions.loadFiles
});
const mapDispatchToProps = {
  saveFile,
  loadFiles
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(Aggrement)
);
