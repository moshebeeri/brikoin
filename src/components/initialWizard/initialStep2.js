import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { ApproveDialog, DocumentTemplate } from "../../UI/index";
import { signKyc } from "../../redux/actions/trusteeManagment";
import { withProjectHeader } from "../../UI/project/WithProjectHeader";

const kyc = require("./kyc.txt");
const DOCUMENT_DESCRIPTOR = {
  signature: { type: "signature" },
  name: { type: "text" },
  secondName: { type: "text" },
  birthDate: { type: "date" },
  familyState: { type: "selector" },
  sex: { type: "selector" },
  nationalStatus: { type: "selector" },
  national: { type: "text" },
  livingAddress: { type: "text" },
  livingAddress2: { type: "text" },
  addressLiving2: { type: "text" },
  country: { type: "text" },
  country2: { type: "text" },
  pinCode: { type: "text" },
  pinCode2: { type: "text" },
  livingType: { type: "text" },
  livingType2: { type: "text" },
  mail: { type: "text" },
  mobile: { type: "number" },
  phone: { type: "number" },
  proofOfLiving: { type: "text" },
  signatureDone: { type: "signature" },
  date: { type: "date" },
  price: { type: "number" },
  id: { type: "text" }
};

function InvestingWizardStep1(props) {
  const { project } = props;
  const [uploadingFile, setUploadingFile] = useState(false);
  useEffect(() => {
    if (!props.kycLoading && uploadingFile) {
      setUploadingFile(false);
      props.history.push("/projectsView/" + project.address);
    }
  }, [props.kycLoading]);
  return (
    <div style={{ marginTop: 30 }}>
      <DocumentTemplate
        noFieldLabels
        title={"Know Your Customer"}
        fileName={"kyc"}
        selectorValues={getSelectorValues(props)}
        sendDocumentAction={setUploadingFile.bind(this, true)}
        documentSignedAction={nextPage.bind(this, props)}
        document={kyc}
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

function getSelectorValues(props) {
  return {
    familyState: [
      { label: props.t("single"), value: "single" },
      { label: props.t("married"), value: "married" },
      { label: props.t("divorced"), value: "divorced" },
      { label: props.t("other"), value: "other" }
    ],
    sex: [
      { label: props.t("male"), value: "male" },
      { label: props.t("female"), value: "female" }
    ],
    nationalStatus: [
      { label: props.t("resident"), value: "resident" },
      { label: props.t("nonresident"), value: "nonresident" },
      { label: props.t("foreignCitizen"), value: "foreignCitizen" }
    ]
  };
}

async function nextPage(props, file) {
  const { signKyc, user, project, history } = props;
  const pendingOrder = getUserPendingOrder(project, props);
  signKyc(user.uid, project.address, pendingOrder.id, file);
}

function getDocumentValues(props) {
  const { user } = props;
  return { date: new Date().getTime(), mail: user.email };
}

function getUserPendingOrder(project, props) {
  if (!project) {
    return {};
  }
  const { pendingOrders, user } = props;
  const orders =
    pendingOrders && pendingOrders[project.address]
      ? pendingOrders[project.address].filter(
          order => order.userId === user.uid
        )
      : [];
  return orders.length > 0 ? orders[0] : {};
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  kycLoading: state.trusteesManagment.kycLoading,
  pendingOrders: state.trades.pendingOrders
});
const mapDispatchToProps = {
  signKyc
};
export default withProjectHeader(
  connect(mapStateToProps, mapDispatchToProps)(InvestingWizardStep1)
);
