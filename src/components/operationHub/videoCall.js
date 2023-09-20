import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import VideoComponent from "../../UI/generics/VideoComponent";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import {  operationDone } from "./operationUtils";

//  +
export function VideoCall(props) {
  return (
    <Dialog
      open={props.open}
      fullWidth
      maxWidth={false}
      onClose={endCallAction.bind(this, props)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("VideoCallRequest")}
      </DialogTitle>

      <div
        dir={props.direction}
        style={{
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <VideoComponent
          t={props.t}
          endCall={props.open}
          onCallEnd={endCallAction.bind(this, props)}
          roomName={props.operation.roomName}
          token={props.operation.videoToken}
        />
      </div>
    </Dialog>
  );
}

function endCallAction(props) {
  operationDone(props.operation);
  props.close();
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(VideoCall)
);
