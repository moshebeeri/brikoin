import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withProjectTradesStats } from "../../UI/warappers/withProjectTradesStats";
import { buyerSignedDocument } from "../../redux/actions/trusteeManagment";
import { ApproveDialog, DocumentTemplate } from "../../UI/index";

const myTxt = require("./text.txt");
const DOCUMENT_DESCRIPTOR = {
  signature: { type: "signature" },
  name: { type: "text" },
  address: { type: "text" },
  date: { type: "date" },
  price: { type: "number" },
  id: { type: "text" }
};

function InvestingWizardStep1(props) {
  const { history, activeAccount, project } = props;
  const [uploadingFile, setUploadingFile] = useState(false);
  useEffect(() => {
    if (!props.signDocumentLoading && uploadingFile) {
      setUploadingFile(false);
      if (activeAccount.kycDocument) {
        history.push("/projectsView/" + project.address);
      } else {
        history.push("/initialStep2/" + project.address);
      }
    }
  }, [props.signDocumentLoading]);
  return (
    <div>
      <DocumentTemplate
        title={"Trustee Agreement"}
        fileName={"trusteeAgreement"}
        documentSignedAction={nextPage.bind(this, props)}
        document={myTxt}
        sendDocumentAction={setUploadingFile.bind(this, true)}
        documentValues={getDocumentValues(props)}
        documentDescriptor={DOCUMENT_DESCRIPTOR}
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

function nextPage(props, file) {
  const { buyerSignedDocument, user, project, order } = props;
  buyerSignedDocument(user.uid, project.address, order.id, file, "", "", "");
}

function getDocumentValues(props) {
  const { order } = props;
  return {
    date: new Date().getTime(),
    price: order.amount * order.price
  };
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  signDocumentLoading: state.trusteesManagment.signDocumentLoading
});
const mapDispatchToProps = {
  buyerSignedDocument
};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(InvestingWizardStep1)
);
