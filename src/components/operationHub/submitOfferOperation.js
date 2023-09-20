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
import { saveFile } from "../../redux/actions/documentOperations";
import { updateOffer } from "../../UI/investDialog/investApi";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
export function SubmitOfferOperation(props) {
  const { classes, project, } = props;
  const [loading, setLoading] = useState(false);
  const [orderSubmited, setOrderSubmited] = useState(false);
  const [invalidMin, setInvalidMin] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  
  const minimum = getMiniProjectInvestment(project);
  return (
    <Dialog
        open={props.open}
        onClose={closeDialog.bind(this, props.close, setInvalidMin)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {props.t("submitOffer")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          {format(props.t("submitOfferMsg"), [
            numberUtils.formatNumber(project.target, 0),
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
             
              {invalidMin && (
                <div
                  style={{
                    fontSize: 14,
                    color: "red"
                  }}
                >
                  {format(props.t("minimumInvestmentError"), [
                    numberUtils.formatNumber(minimum, 0),
                    currencyUtils.currencyCodeToSymbol(project.currency)
                  ])}
                </div>
              )}
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
              setInvalidMin,
              props.close,
              setOrderSubmited,
              orderSubmited
            )}
            color="primary"
          >
            {props.t("submitOffer")}
          </Button>

          <Button
            onClick={closeDialog.bind(this, props.close, setInvalidMin)}
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

function getMiniProjectInvestment(project) {
  return parseInt(project.target) / project.maxOwners;
}

function submitOffer(
  props,
  investAmount,
  setLoading,
  setInvalidMin,
  setOpen,
  setOrderSubmited,
  orderSubmited
) {
  const { project } = props;
  if (investAmount > 0) {
    const minimum = getMiniProjectInvestment(project);
    if (parseInt(investAmount)  >= minimum && !orderSubmited) {
      setLoading(true);
      setOrderSubmited(true)
      updateOffer(
        investAmount,
        1,
        project.address,
        props.group ? props.group.id  : '',
        setLoading,
        setOpen
      );
      operationDone(props.operation, setOpen)
      setInvalidMin(false);
      
    } else {
      setInvalidMin(true);
    }
  }
}

function closeDialog(close, setInvalidMin) {
  setInvalidMin(false);
  close();
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
});
const mapDispatchToProps = {
  saveFile
};
export default
withCusomeStyle(connect(mapStateToProps, mapDispatchToProps)(SubmitOfferOperation))
