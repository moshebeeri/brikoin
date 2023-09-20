import React, { useEffect, useReducer, useState } from "react";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import UserPhoneDialog from "../../UI/user/UserPhoneDialog";
import {  operationDone } from "./operationUtils";

//  +
export function ValidateSmsOperation(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("validateSmsOperation")}
      </DialogTitle>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <UserPhoneDialog
          operation={props.operation}
          t={props.t}
          open={props.open}
          closeTask={closeTask.bind(this, props)}
        />
      </div>
    </Dialog>
  );
}

function closeTask(props, operation) {
  if (operation.validation === "success") {
    operationDone(props.operation);
  }
  props.close();
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  uploading: state.documentOperaions.uploading
});
const mapDispatchToProps = {
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(ValidateSmsOperation)
);
