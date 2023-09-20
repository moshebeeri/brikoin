import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { operationDone } from "./operationUtils";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
export function NextOperationForm(props) {
  const [nextOperation, setNextOperation] = useState(false);
  return (
    <div
        open={props.open}
        onClose={closeDialog.bind(this, props.close)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
  {   props.operation.status === 'operationDone' ? props.t("OperationDone"): props.t(props.operation.name)}
     
        </DialogTitle>
        <DialogContent>
       {nextOperation && <LoadingCircular  open/>}
        </DialogContent>
        <DialogActions>
        {props.operation.status === 'operationDone' ? <div></div>: <Button
            onClick={next.bind(
              this,
              props,
              setNextOperation,
            )}
            color="primary"
          >
            {props.t("Approve")}
          </Button> }

        </DialogActions>
      </div>
  );
}

async function next(
  props,
  setOpen,
) {
  setOpen(true)
  await operationDone(props.operation, setOpen)
  setOpen(false)
  props.close()
}

function closeDialog(close) {
  close();
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
});
const mapDispatchToProps = {
};
export default
withCusomeStyle(connect(mapStateToProps, mapDispatchToProps)(NextOperationForm))
