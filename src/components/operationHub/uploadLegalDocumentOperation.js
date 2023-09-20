import React, { useEffect, useReducer, useState } from "react";
import { withProject } from "../../UI/warappers/withProject";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { GenericForm, ApproveDialog } from "../../UI/index";
import { listenForBankAccount, listenForPendingOrder, operationDone } from "./operationUtils";
import DialogContent from "@material-ui/core/DialogContent";
import currencyUtils from "../../utils/currencyUtils";
import numberUtils from "../../utils/numberUtils";
import { format } from "../../utils/stringUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { saveFile } from "../../redux/actions/documentOperations";
const TRANSFER_FORM = {
  transferDocument: "fileUpload"
  // idPicture: 'webCap',
};

//  +
export function TransferFunds(props) {
  const [bankAccount, setBankAccount] = useState([]);
  const [pendingOrder, setPendingOrder] = useState([]);
  const [entity, setEntity] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  useEffect(() => {
    if (!props.uploading && uploadingFile) {
      setUploadingFile(false);
      operationDone(props.operation)
      props.close();
    }
  }, [props.uploading]);
  
  const accounts = props.operation.bankAccount ? props.operation.bankAccount : bankAccount
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      fullWidth
      maxWidth={false}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("transferFundsOperation")}
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
          <DialogContent>
            {props.t("uploadLegalDocument")}
          </DialogContent>
       
          <GenericForm
            buttonTitle={"uploadDocument"}
            state={entity}
            setState={setEntity}
            entity={entity}
            t={props.t}
            mandatoryFields={["transferDocument"]}
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
  setUploadingFile(true);
  props.saveFile(
    entity.transferDocument[0],
    { id: props.operation.document },
    props.user,
    props.operation,
    false
  );
}


const mapStateToProps = (state, props) => ({
  user: state.login.user,
  uploading: state.documentOperaions.uploading
});
const mapDispatchToProps = {
  saveFile
};
export default withProject(
  connect(mapStateToProps, mapDispatchToProps)(TransferFunds)
);
