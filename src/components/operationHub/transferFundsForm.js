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

const TRANSFER_FORM_VIEW = {
  transferDocument: "fileUpload-View"
  // idPicture: 'webCap',
};
//  +
export function TransferFundsForm(props) {
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
  listenForPendingOrder(
    setPendingOrder,
    props.project.address,
    props.operation.orderId
  );
  listenForBankAccount(
    setBankAccount,
    props.project.trustee.user
      ? props.project.trustee.user
      : props.project.trustee,
    pendingOrder ? pendingOrder.caseId : ""
  );
  const payment = getTransferAmount(
    props.operation,
    props.project,
    pendingOrder
  );
  const formattedPayment =
    numberUtils.formatNumber(payment, 0) +
    " " +
    currencyUtils.currencyCodeToSymbol(props.project.currency);
  const accounts = props.operation.bankAccount ? props.operation.bankAccount : bankAccount
  return (
    <div
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
        {payment > 0 && accounts ? (
          <DialogContent>
            {format(props.t("transferFundsOperationMsg"), [
              formattedPayment,
              accounts.accountNumber,
              accounts.bank,
              accounts.bankBranch
            ])}
          </DialogContent>
        ) : (
          <LoadingCircular open />
        )}
        {payment > 0 && accounts &&
          <GenericForm
            buttonTitle={"reportOperation"}
            state={props.operation.status === 'operationDone'  && props.document ? {transferDocument: props.document.signedDocument}:entity}
            setState={setEntity}
            entity={props.operation.status === 'operationDone' && props.document ? {transferDocument: props.document.signedDocument}:entity}
            t={props.t}
            mandatoryFields={["transferDocument"]}
            entityDescriptor={props.operation.status === 'operationDone' && props.document ?  TRANSFER_FORM_VIEW: TRANSFER_FORM}
            save={props.operation.status === 'operationDone' && props.document ? '' : uploadFile.bind(this, props, entity, setUploadingFile)}
          />}
        
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

function getTransferAmount(operation, project, order) {
  if (!order) {
    return 0;
  }
  const reservedPrice = parseInt(project.reservedBid) < 1000000  ? parseInt(project.reservedBid) : parseInt(project.reservedBid) / 1000000;
  if (operation.type === "transferReserved") {
    return reservedPrice;
  }
  return order.amount * order.price - reservedPrice;
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  uploading: state.documentOperaions.uploading
});
const mapDispatchToProps = {
  saveFile
};
export default withProject(
  connect(mapStateToProps, mapDispatchToProps)(TransferFundsForm)
);
