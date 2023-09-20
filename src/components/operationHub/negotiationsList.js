import React, { useEffect, useReducer, useState } from "react";
import {
  approveOffer, rejectOffer
} from "./negotiationUtils";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { connect } from "react-redux";
import { GenericList } from "../../UI/index";
import CounterOfferOperation from './counterOfferOperation'
import ApproveDialog from "../../UI/messageBox/ApproveDialog";
const LIST_DESCRIPTOR = {
  
  side: { type: "text-translate", width: 100 },
  status: { type: "text-translate", width: 100 },
  amount: { type: "number", width: 100 },
  actions: {
    type: "action",
    param: "user",
    width: 350,
    noTitle: true,
    actions: [],
    menuActions: [
      "counterOffer",
      "rejectOffer",
      "approveOffer"
    ],
   
  }
};
export function NegotiationList(props) {
   const [showCounterOffer, setShoeCounterOffer] = useState(false)
    const [showApproveOffer, setShowApproveOffer] = useState(false)
    const [showRejectOffer, setShowRejectOffer] = useState(false)
    const [process, setProcess] = useState(false)
    const [activeOffer, setActiveOffer] = useState('')
    return props.loadingOffers || props.offers.length === 0 ? <div></div> : 
    <div
    dir={props.direction}
    style={{
      minWidth: 400,
      display: "flex",
      flexDirection: 'column',
      marginTop: 20,
      alignItems: "flex-start",
      justifyContent: "flex-start"
    }}
  >
      <GenericList
      title={"Deal Offers"}
      t={props.t}
      columnDescription={LIST_DESCRIPTOR}
      rows={getRows(props.offers, props.operation, setActiveOffer, setShoeCounterOffer, setShowApproveOffer, setShowRejectOffer)}
  />

  <ApproveDialog
  t={props.t}
  cancelAction={setShowApproveOffer.bind(this, false)}
  processDone={setProcess.bind(this, false)}
  process={process}
  openDialog={showApproveOffer}
  title={props.t("approveOffer")}
  approveAction={approveOfferAction.bind(
    this,
    props,
    activeOffer,
    setProcess,
    setShowApproveOffer
  )}
  approveMessage={props.t("approveOfferMsg")}
/>

  <ApproveDialog 
  t={props.t}
  cancelAction={setShowRejectOffer.bind(this, false)}
  processDone={setProcess.bind(this, false)}
  process={process}
  openDialog={showRejectOffer}
  title={props.t("rejectOffer")}
  approveAction={rejectOfferAction.bind(
    this,
    props,
    activeOffer,
    setProcess,
    setShowRejectOffer
  )}
  approveMessage={props.t("rejectOfferMsg")}
  />
  <CounterOfferOperation 
  t={props.t}
  project={props.project}
  operation={props.operation}
  open={showCounterOffer}
  lastOffer={activeOffer}
  close={counterOfferDone.bind(this, props, setShoeCounterOffer)}
  />
    </div>
  }

  async function counterOfferDone(props, setShoeCounterOffer){
    setShoeCounterOffer(false)
    props.close()

  }
  async function approveOfferAction(props, offer ,setProcess, setShowApproveOffer){
      setProcess(true)
      await approveOffer(props.operation, offer.id)
      setProcess(false)
      setShowApproveOffer(false)
      props.close()
  }


  
  async function rejectOfferAction(props, offer ,setProcess, setShowRejectOffer){
    setProcess(true)
    await rejectOffer(props.operation, offer.id)
    setShowRejectOffer(false)
    setProcess(false)
    props.close()
}

function getRows(offers, operation, setActiveOffer, setShoeCounterOffer, setShowApproveOffer, setShowRejectOffer){
  if(offers.length > 0){
    let rows = offers.map(offer => {
      let offerRow = {}
      offerRow.amount = offer.amount
      offerRow.side = offer.side
      offerRow.status = offer.status

      offerRow.hideActions = getRowAction(operation, offer);
      offerRow.counterOffer  = userOperation.bind(this,offer, setActiveOffer, setShoeCounterOffer)
      offerRow.rejectOffer  = userOperation.bind(this,offer, setActiveOffer, setShowRejectOffer)
      offerRow.approveOffer  = userOperation.bind(this,offer, setActiveOffer, setShowApproveOffer)
      return offerRow;

    })
    return rows
  }
  return []
}

function userOperation(offer,setOffer ,showOperation){
  setOffer(offer)
  showOperation(true)
}

function getRowAction(operation, offer) {
  if (!offer.active) {
    return showAction([""]);
  }
  if(offer.side === operation.side){
    return showAction([""]);
  }
  
  
  return showAction(["counterOffer","rejectOffer", "approveOffer"]);
}

function showAction(actions) {
  return LIST_DESCRIPTOR.actions.menuActions.filter(
    action => !actions.includes(action)
  );
}


const mapStateToProps = (state, props) => ({
    user: state.login.user,
    direction: state.userProfileReducer.direction
  });
  const mapDispatchToProps = {
  };
  export default
  withCusomeStyle(connect(mapStateToProps, mapDispatchToProps)(NegotiationList))
  