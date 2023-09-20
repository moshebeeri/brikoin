import React, { useEffect, useReducer, useState } from "react";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import EventSlots from "../calendar/eventSlots";
import {  operationDone } from "./operationUtils";

//  +
export function OpenHours(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      fullWidth
      maxWidth={false}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("scheduleOpenHours")}
      </DialogTitle>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <EventSlots
          userId={props.user.uid}
          operationDone={closeTask.bind(this, props)}
          close={props.close}
          t={props.t}
        />
      </div>
    </Dialog>
  );
}

function closeTask(props) {
  operationDone(props.operation);
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  uploading: state.documentOperaions.uploading
});
const mapDispatchToProps = {
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(OpenHours)
);
