import React, { useEffect, useReducer, useState } from "react";
import { withProject } from "../../UI/warappers/withProject";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ApproveDialog, GenericForm } from "../../UI/index";
import DialogContent from "@material-ui/core/DialogContent";
import { saveFile , saveSimpleFile} from "../../redux/actions/documentOperations";
import { operationDone, convertDocumentToHtml } from "./operationUtils";

const TRANSFER_FORM = {
  legalDocument: "fileUpload"
  // idPicture: 'webCap',
};


const TRANSFER_FORM_VIEW = {
  legalDocument: "fileUpload-View"
  // idPicture: 'webCap',
};

//  +
function UploadSalesDocumentForm(props) {
  const [entity, setEntity] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  useEffect(() =>  {
    onUploadEnd(props, uploadingFile, setUploadingFile)
  }, [props.uploading]);


  return (
    <div
      open={props.open}
      onClose={props.close}
      fullWidth
      maxWidth={false}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("attachLegalSalesDocument")}
      </DialogTitle>

      <div
        style={{
          marginTop: 30,
          marginBottom: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <DialogContent>{props.t("attacheDocumentMessage")}</DialogContent> :
        <GenericForm
          buttonTitle={"upload"}
          state={props.operation.status === 'operationDone'  && props.document ? {legalDocument: props.document.signedDocument}:entity}
          setState={setEntity}
          entity={props.operation.status === 'operationDone' && props.document ? {legalDocument: props.document.signedDocument}:entity}
          t={props.t}
          entityDescriptor={props.operation.status === 'operationDone' && props.document ?  TRANSFER_FORM_VIEW: TRANSFER_FORM}
          save={props.operation.status === 'operationDone' && props.document ? '' : uploadFile.bind(this, props, entity, setUploadingFile)}
   
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
    </div>
  );
}

async function onUploadEnd(props, uploadingFile, setUploadingFile){
  if (!props.uploading && uploadingFile) { 
    await convertDocumentToHtml(props.operation)
    await operationDone(props.operation)
    setUploadingFile(false);
    props.close();
  }
}

function closeDialog() {}

function uploadFile(props, entity, setUploadingFile) {
  if (entity.legalDocument && entity.legalDocument.length > 0) {
    setUploadingFile(true);
    props.saveSimpleFile(entity.legalDocument[0], '',`/users/${props.user.uid}/documents`, props.user, props.operation)
  
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  uploading: state.documentOperaions.uploading
});
const mapDispatchToProps = {
  saveFile, saveSimpleFile
};
export default 
  connect(mapStateToProps, mapDispatchToProps)(UploadSalesDocumentForm);
