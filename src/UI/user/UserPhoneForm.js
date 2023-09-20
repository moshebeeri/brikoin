import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { validatePhone } from "../../utils/stringUtils";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  sendPhoneSmsValidation,
  validateSmsCode
} from "../../redux/actions/accounts";
import { setPendingOrder, reserveOrder } from "../../redux/actions/trade";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { listenForOperation, operationDone } from "../../components/operationHub/operationUtils";

function UserPhoneForm(props) {
  const { classes, label, className } = props;
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState({});
  const [validateCode, setCodeValidation] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const [showLoadingCycle, setLoadingCycle] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState({ phone: undefined });
  const [phoneValidation, setPhoneValidation] = useState("");
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [validationCode, setValidationCode] = useState("");
  useEffect(() => {
    if (validationLoading) {
      setTimeout(() => {
        setValidationLoading(false);
        setPhoneInvalid(false);
        setPhoneValidation(true);
        setValidationCode("");
      }, 2000);
    }
  }, [validationLoading]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        setValidationLoading(false);
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  useEffect(() => {
    if (validateCode) {
      setTimeout(() => {
        setCodeValidation(false);
        setValidationLoading(false);
        setLoading(false);
      }, 2000);
    }
  }, [validateCode]);

  listenForOperation(setOperation, props.operation, props);
  if (operation && operation.validation === "success" && !showLoadingCycle) {
    operationDoneAction(props, operation, setLoadingCycle);
  }
  return (
    <div
      onClose={ props.closeTask.bind(this,operation)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {phoneValidation
          ? props.t("validatePhone")
          : props.t("pleaseValidatePhone")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {phoneValidation
            ? props.t("validatePhoneMsg")
            : props.t("validatePhonePreMsg")}
        </DialogContentText>
        <form className={classes.container} noValidate autoComplete="off">
          <div
            style={{
              display: "flex",
              marginTop: 10,
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div style={{ flex: 1, width: 200 }}>
              <PhoneInput
                placeholder={props.t("phoneNumber")}
                value={phoneNumber.toString()}
                country={"IL"}
                // countries={['US','GR']}
                onChange={phone => setPhoneNumber({ phone })}
              />
            </div>
            {phoneValidation && (
              <div style={{ flex: 1 }}>
                <TextField
                  id="name"
                  label={props.t("validationCode")}
                  className={classes.textField}
                  value={validationCode}
                  onChange={handleChange(setValidationCode)}
                  margin="normal"
                  fullWidth
                />
              </div>
            )}
            {loading || validationLoading && <LoadingCircular open />}
            {phoneValidation &&
              operation &&
              operation.validation === "failed" && (
                <div style={{ fontSize: 14, color: "red" }}>
                  {props.t("failedSmsValidation")}
                </div>
              )}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        {phoneValidation && (
          <Button
            onClick={validateCodeOperation.bind(
              this,
              props,
              setValidationLoading,
              phoneNumber,
              validationCode
            )}
            color="primary"
          >
            {props.t("validatePhone")}
          </Button>
        )}
        <Button
          onClick={sendPhoneValidation.bind(
            this,
            props,
            phoneNumber,
            setPhoneInvalid,
            setValidationLoading
          )}
          color="primary"
        >
          {phoneValidation ? props.t("resendSms") : props.t("sendSms")}
        </Button>
        <Button
          onClick={operationDoneAction.bind(this, props, operation, setLoadingCycle)}
          color="primary"
        >
          {props.t("cancel")}
        </Button>
      </DialogActions>
    </div>
  );
}

function handleChange(setValue) {
  return event => {
    setValue(event.target.value);
  };
}

async function operationDoneAction(props, operation, setLoadingCycle) {
  setLoadingCycle(true);
  await operationDone(operation)
  setLoadingCycle(false);
  props.closeTask(operation);
}

function sendPhoneValidation(
  props,
  phoneNumber,
  setPhoneInvalid,
  setValidationLoading
) {
  const { user } = props;
  if (phoneNumber && validatePhone(phoneNumber.phone)) {
    props.sendPhoneSmsValidation(user, phoneNumber.phone);
    setValidationLoading(true);
  } else {
    setPhoneInvalid(true);
  }
}

function validateCodeOperation(props, setLoading, phoneNumber, validationCode) {
  const { user } = props;
  if (validationCode) {
    props.validateSmsCode(user, phoneNumber.phone, parseInt(validationCode));
    setLoading(true);
  }
}

const mapStateToProps = state => {
  return {
    activeAccount: state.userAccounts.activeAccount,
    user: state.login.user,
    direction: state.userProfileReducer.direction
  };
};

const mapDispatchToProps = {
  sendPhoneSmsValidation,
  validateSmsCode,
  setPendingOrder
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(UserPhoneForm)
);
