import React, { useEffect, useReducer, useState } from "react";
import { withUser } from "../../UI/warappers/withUser";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { saveDocumentAttributes } from "../../redux/actions/documentOperations";
import TrusteeAgrement from "./trusteeAgrement";
import StandardAggrement from "./standardAgreement";
import KycAgrement from "./KycAgrement";
import Aggrement from "./aggrement";
import SimpleAggrement from "./simpleSignAggrement";
export function SignDocumentOperation(props) {
  let document = props.document;

  return (
    <Dialog
      open={props.open}
      fullWidth
      maxWidth={false}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("signDocument")}
      </DialogTitle>
      {getDocumentBytype(document, props.operation, props)}
    </Dialog>
  );
}

function getDocumentBytype(document, operation, props) {
  if (operation.name === "trusteeAgrement") {
    return (
      <TrusteeAgrement
        documentsAttributes={props.documentsAttributes}
        close={props.close}
        operation={operation}
        document={document}
        t={props.t}
        history={props.history}
      />
    );
  }

  if (operation.name === "standardAgrement") {
    return (
      <StandardAggrement
        documentsAttributes={props.documentsAttributes}
        close={props.close}
        operation={operation}
        document={document}
        t={props.t}
        history={props.history}
      />
    );
  }

  if (operation.name === "KYC") {
    return (
      <KycAgrement
        documentsAttributes={props.documentsAttributes}
        close={props.close}
        operation={operation}
        document={document}
        t={props.t}
        history={props.history}
      />
    );
  }

  if(operation.name && operation.name.includes('Simple')){
    return (
      <SimpleAggrement
  documentsAttributes={props.documentsAttributes}
  close={props.close}
  operation={operation}
  document={document}
  t={props.t}
  history={props.history}
/>
    )
  }
  return  <Aggrement
  documentsAttributes={props.documentsAttributes}
  close={props.close}
  operation={operation}
  document={document}
  t={props.t}
  history={props.history}
/>
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {
  saveDocumentAttributes
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(SignDocumentOperation)
);
