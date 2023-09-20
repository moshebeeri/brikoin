import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withUser } from "../../UI/warappers/withUser";
import { ApproveDialog, DocumentFromHtml } from "../../UI/index";
import {
  saveFile,
  saveSimpleFile,
  loadFiles
} from "../../redux/actions/documentOperations";
import {operationDone, updateOriginalFile} from './operationUtils' 
import LoadingCircular from "../../UI/loading/LoadingCircular";

function SimpleAggrement(props) {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [loadFile, seltFileLoaded] = useState(false);
  useEffect(() => {
    if (!props.uploading && uploadingFile) {
      closeDialog(props, setUploadingFile)
    }
  }, [props.uploading]);

  useEffect(() => {
      seltFileLoaded(props.loading);
  }, [props.loading]);
  let documentPath = props.operation.documentPath.substring(0,props.operation.documentPath.lastIndexOf('/')) 
  let file = props.operation.documentPath.substring(props.operation.documentPath.lastIndexOf('/') + 1) 

  if(!props.files[props.operation.documentPath]){
      props.loadFiles([file], documentPath, true)
      return (
        <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
          <LoadingCircular open />
        </div>
      );
  }
  let pages = [props.files[props.operation.documentPath]]
  
  return (
    <div>
      <DocumentFromHtml
        direction={props.direction}
        title={props.operation.name}
        fileName={file}
        operationDone={props.operation.status === 'operationDone'}
        hideClose={props.hideClose}
        sendDocumentAction={setUploadingFile.bind(this, true)}
        documentSignedAction={saveFileOperation.bind(this, props)}
        pages={pages}
        signatureTitle={props.operation.userRole}
        saveDocumentAttributes={saveAttributes.bind(this, props, true)}
        documentValues={getDocumentValues(props)}
        documentDescriptor={props.operation.formDescriptor || {}}
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

async function closeDialog(props, setUploadingFile) {
  await operationDone(props.operation)
  updateOriginalFile(props.operation)
  setUploadingFile(false);
  props.close()

}

function saveFileOperation(props, file, state) {
  props.saveSimpleFile(file, props.document, `users/${props.user.uid}/documents/`, props.user, props.operation);
}

function saveAttributes(props, close, attributes) {
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
  saveSimpleFile,
  loadFiles
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(SimpleAggrement)
);
