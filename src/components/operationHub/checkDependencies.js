import React, { useEffect, useReducer, useState } from "react";
import { withUser } from "../../UI/warappers/withUser";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { format } from "../../utils/stringUtils";
export function CheckDependencies(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("checkDependenciesError")}
      </DialogTitle>

      <DialogContent>
        {format(props.t("dependenciesMessage"), props.dependencies)}
      </DialogContent>
    </Dialog>
  );
}

function getDocumentBytype(document, operation, props) {
  return <div></div>;
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(CheckDependencies)
);
