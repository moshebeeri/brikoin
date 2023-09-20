import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { operationDone } from "./operationUtils";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import NegotiationList from './negotiationsList'
import currencyUtils from "../../utils/currencyUtils";
import DialogContentText from "@material-ui/core/DialogContentText";
import numberUtils from "../../utils/numberUtils";
import { format } from "../../utils/stringUtils";
import Button from "@material-ui/core/Button";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { saveFile } from "../../redux/actions/documentOperations";
import { updateOffer } from "../../UI/investDialog/investApi";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import {
  getOffers, sendOffer
} from "./negotiationUtils";
export function SubmitOfferOperation(props) {
  const { classes, project, } = props;
  const [offers, setOffers] = useState([]);
   
  const [loading, setLoading] = useState(false);
  const [orderSubmited, setOrderSubmited] = useState(false);
  const [invalidMin, setInvalidMin] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [init, setInit] = useState(false);
    
  setOffersAction(setInit, init,setOffers, setLoadingOffers, loadingOffers, props.operation)
  
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
          {props.operation.side === 'BUYER' ? format(props.t("submitOfferMsg"), [
            numberUtils.formatNumber(project.target, 0),
            currencyUtils.currencyCodeToSymbol(project.currency)
          ]): props.t("sellerOfferMsg")}
          </DialogContentText>
          <NegotiationList close={props.close} offers={offers} operation={props.operation} project={project} t={props.t} location={props.location} history={props.history} />
          {!loadingOffers && offers.length === 0  && props.operation.side === 'BUYER' && <form className={classes.container} noValidate autoComplete="off">
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
            
          </form>}
          {loading || loadingOffers && (
            <LoadingCircular
              open
              size={24}
              className={classes.buttonProgress}
            />
          )}
        </DialogContent>
        <DialogActions>
            {!loadingOffers && offers.length === 0 && props.operation.side === 'BUYER' && <Button
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
          </Button>}

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

async function setOffersAction(setInit,init,setOffers,setLoadingOffers,loadingOffers,  operation){
  if(!init){
    setInit(true)
    let offers = await getOffers(operation)
    setOffers(offers)
    setLoadingOffers(false)
  }
}

function getMiniProjectInvestment(project) {
  return parseInt(project.target) / project.maxOwners;
}

async function submitOffer(
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
      setLoading(true);
      setOrderSubmited(true)
      await sendOffer(props.operation, investAmount)
      setOpen(false)
      setLoading(false);
      setInvalidMin(false);
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
