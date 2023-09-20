import React, { useEffect, useReducer, useState } from "react";
import { withProject } from "../../UI/warappers/withProject";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ApproveDialog, GenericForm } from "../../UI/index";
import DialogContent from "@material-ui/core/DialogContent";
import { saveFile } from "../../redux/actions/documentOperations";

const TRANSFER_FORM = {
  transferDocument: "fileUpload"
  // idPicture: 'webCap',
};

//  +
export function AttachDocument(props) {
  const [entity, setEntity] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  useEffect(() => {
    if (!props.uploading && uploadingFile) {
      setUploadingFile(false);
      props.close();
    }
  }, [props.uploading]);
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      fullWidth
      maxWidth={false}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("attachDocument")}
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
          state={entity}
          setState={setEntity}
          entity={entity}
          t={props.t}
          entityDescriptor={TRANSFER_FORM}
          save={uploadFile.bind(this, props, entity, setUploadingFile)}
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
    </Dialog>
  );
}

function closeDialog() {}

function uploadFile(props, entity, setUploadingFile) {
  if (entity.transferDocument && entity.transferDocument.length > 0) {
    setUploadingFile(true);
    props.saveFile(
      entity.transferDocument[0],
      { id: "" },
      props.user,
      props.operation,
      false
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  uploading: state.documentOperaions.uploading
});
const mapDispatchToProps = {
  saveFile
};
export default withProject(
  connect(mapStateToProps, mapDispatchToProps)(AttachDocument)
);
