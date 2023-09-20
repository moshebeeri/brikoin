import React, { useEffect, useReducer, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { connect } from "react-redux";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  sendPhoneSmsValidation,
  validateSmsCode
} from "../../redux/actions/accounts";
import { setPendingOrder } from "../../redux/actions/trade";
import { withProjectTradesStats } from "../warappers/withProjectTradesStats";
import "react-phone-number-input/style.css";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { saveNotification } from "../../redux/actions/notifications";
import { format } from "../../utils/stringUtils";
import currencyUtils from "../../utils/currencyUtils";
import numberUtils from "../../utils/numberUtils";
import { submitProjectOffer } from "./investApi";

function InvestDialog(props) {
  const [open, setOpen] = useState(false);
  return renderDialog(props, setOpen, open);
}

function handleChange(setValue) {
  return event => {
    setValue(event.target.value);
  };
}

function renderDialog(props, setOpen, open) {
  const { classes, label, className, project, initialAsk, asks } = props;
  const [loading, setLoading] = useState(false);
  const [invalidMin, setInvalidMin] = useState(false);
  const [buyAll, setBuyAll] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investPrice, setInvestPrice] = useState("");
  const minimum = getMiniProjectInvestment(project);

  if (!asks || asks.length === 0) {
    return <div />;
  }
  if (project.tradeMethod === "GROUP") {
    return investProjectGroup(
      props,
      setOpen,
      setInvalidMin,
      setLoading,
      loading,
      open
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
    
        <Button
        onClick={submitOffer.bind(
            this,
            props,
            setLoading,
            setOpen
          )}
          fullWidth
          variant="outlined"
          className={classes.buttonInvest}
        >
          {props.t("buy")}
        </Button>
      {project.groups && (
        <div style={{ marginTop: 4 }}>
          <Button
            onClick={buyWithGroup.bind(this, props, project)}
            fullWidth
            variant="outlined"
            className={className || classes.buttonInvest}
          >
            {props.t("buyGroup")}
          </Button>
        </div>
      )}
      <div style={{ marginTop: 4 }}>{props.t("taxNoteMsg")}</div>
      <Dialog
        open={open}
        onClose={closeDialog.bind(this, setOpen, setInvalidMin)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {props.t("investOffering")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.t("investOfferingMsgNoPhone")}
          </DialogContentText>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                alignItems: "center",
                flexDirection: "col",
                justifyContent: "center"
              }}
            >
            
              
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
              setLoading,
              setOpen
            )}
            color="primary"
          >
            {props.t("submitOffer")}
          </Button>

          <Button
            onClick={closeDialog.bind(this, setOpen, setInvalidMin)}
            color="primary"
          >
            {props.t("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function startProcess(setOpen, setInvestAmount, project, setBuyAll) {
  setOpen(true);
  setInvestAmount('');
  setBuyAll(true);
}

function buyWithPartners(setOpen, setInvestAmount, setBuyAll) {
  setOpen(true);
  setInvestAmount("");
  setBuyAll(false);
}
function investProjectGroup(
  props,
  setOpen,
  setInvalidMin,
  setLoading,
  loading,
  open
) {
  const { project, classes } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
    
      <Button
        onClick={setOpen.bind(this, true)}
        fullWidth
        variant="outlined"
        className={classes.buttonInvest}
      >
        {props.t("buy")}
      </Button>
      <div style={{ marginTop: 4 }}>
        <Button
          onClick={buyWithGroup.bind(this, props, project)}
          fullWidth
          variant="outlined"
          className={classes.buttonInvest}
        >
          {props.t("buyGroup")}
        </Button>
      </div>
      <div style={{ marginTop: 4 }}>{props.t("taxNoteMsg")}</div>
      <Dialog
        open={open}
        onClose={closeDialog.bind(this, setOpen, setInvalidMin)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {props.t("investOffering")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{props.t("buyProjectMessage")}</DialogContentText>
          {loading && (
            <LoadingCircular
              open
              size={24}
              className={classes.buttonProgress}
            />
          )}
        </DialogContent>
        <DialogActions>
        
        </DialogActions>
      </Dialog>
    </div>
  );
}

function submitOffer(
  props,
  setLoading,
  setOpen
) {
  const { project } = props;
  setOpen(true)
  setLoading(true);
    submitProjectOffer(
        '',
        '',
        project.address,
        "",
        setLoading,
        setOpen)
      // setPendingOrder(user, project.address, investAmount, price)
}

function closeDialog(setOpen, setInvalidMin) {
  setInvalidMin(false);
  setOpen(false);
}

function buyWithGroup(props, project) {
  props.history.push(`/groups/${project.address}`);
}

function getMiniProjectInvestment(project) {
  return parseInt(project.target) / project.maxOwners;
}

const mapStateToProps = state => {
  return {
    user: state.login.user,
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {
  sendPhoneSmsValidation,
  validateSmsCode,
  setPendingOrder,
  saveNotification
};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(InvestDialog)
);
