import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withProjectTradesStats } from "../../UI/warappers/withProjectTradesStats";
import { buyerSignedDocument } from "../../redux/actions/trusteeManagment";
import { DocumentTemplate } from "../../UI/index";

const myTxt = require("./text.txt");
const DOCUMENT_DESCRIPTOR = {
  signature: { type: "signature" },
  name: { type: "text" },
  address: { type: "text" },
  date: { type: "date" },
  price: { type: "number" },
  id: { type: "text" }
};

function LoanInvestment(props) {
  const [file, setFile] = useState(myTxt);
  useEffect(() => {
    setFile(myTxt);
  }, [props]);
  return (
    <div>
      <DocumentTemplate
        title={"Trustee Agreement"}
        fileName={"trusteeAgreement"}
        documentSignedAction={nextPage.bind(this, file, props)}
        document={myTxt}
        documentValues={getDocumentValues.bind(this, props)}
        documentDescriptor={DOCUMENT_DESCRIPTOR}
        t={props.t}
      />
    </div>
  );
}

function getDocumentValues(props) {
  const { order } = props;
  return {
    date: new Date().getTime(),
    price: order.amount * order.price
  };
}

function nextPage(file, props) {
  const {
    buyerSignedDocument,
    user,
    project,
    history,
    activeAccount,
    order
  } = props;
  buyerSignedDocument(user.uid, project.address, order.id, file, "", "", "");
  if (activeAccount.kycDocument) {
    history.push("/projectsView/" + project.address);
  } else {
    history.push("/initialStep2/" + project.address);
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount
});
const mapDispatchToProps = {
  buyerSignedDocument
};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(LoanInvestment)
);
