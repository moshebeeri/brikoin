import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { operationDone } from "./operationUtils";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import currencyUtils from "../../utils/currencyUtils";
import DialogContentText from "@material-ui/core/DialogContentText";
import numberUtils from "../../utils/numberUtils";
import { format } from "../../utils/stringUtils";
import Button from "@material-ui/core/Button";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { counterOffer } from "./negotiationUtils";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
export function CounterOfferOperation(props) {
  const { classes, project, } = props;
  const [loading, setLoading] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  
  const lastOffer = props.lastOffer.amount;
  return (
    <Dialog
        open={props.open}
        onClose={closeDialog.bind(this, props.close)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {props.t("counterOffer")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          {format(props.t("counterOfferMsg"), [
            numberUtils.formatNumber(lastOffer, 0),
            currencyUtils.currencyCodeToSymbol(project.currency)
          ])}
          </DialogContentText>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                alignItems: "center",
                flexDirection: "col",
                justifyContent: "center"
              }}
            >
              <div style={{ flex: 1 }}>
                <TextField
                  id="amount"
                  label={
                   props.t("offerAmount")
                  }
                  className={classes.textField}
                  value={
                  investAmount
                  }
                  onChange={handleChange(setInvestAmount)}
                  margin="normal"
                  fullWidth
                />
              </div>
             
             
            </div>
            {loading && (
              <LoadingCircular
                open
                size={24}
                className={classes.buttonProgress}
              />
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={submitOffer.bind(
              this,
              props,
              investAmount,
              setLoading,
            )}
            color="primary"
          >
            {props.t("submitOffer")}
          </Button>

          <Button
            onClick={closeDialog.bind(this, props.close)}
            color="primary"
          >
            {props.t("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
  );
}

function handleChange(setValue) {
  return event => {
    setValue(event.target.value);
  };
}

async function submitOffer(
  props,
  investAmount,
  setLoading,
) {
  const { project } = props;
  if (investAmount > 0) {
      setLoading(true);
      await counterOffer(
        props.operation,
        investAmount,
      );
      setLoading(false);
      props.close()

  }
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
withCusomeStyle(connect(mapStateToProps, mapDispatchToProps)(CounterOfferOperation))
