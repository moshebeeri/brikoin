import React, { useEffect, useReducer, useState } from "react";
import {
  initialState,
  projectTradesStats
} from "../../redux/reducer/projectTradesStats";
import { calculateMortgage } from "../../redux/actions/mortgage";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { withProjectTradesStats } from "../warappers/withProjectTradesStats";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import MortgageRequestView from "../mortgage/mortgageRequestView";
import { setPendingOrder } from "../../redux/actions/trade";

import { listenForMortgages } from "../../UI/mortgage/mortgageUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
// import {connect} from 'react-redux'
function MortgageInvest(props) {
  if (props.order && props.order.active) {
    return <div></div>;
  }

  const [requests, setRequests] = useState([]);
  const [request, setSelectedRequest] = useState("");
  const [open, setOpen] = useState(false);
  const [showSpinner, setSpinner] = useState(false);
  const [redirect, setRedirect] = useState(false);
  listenForMortgages(setRequests, props);
  useEffect(() => {
    if (showSpinner) {
      setTimeout(() => {
        setSpinner(false);
        setRedirect(true);
      }, 2000);
    }
  }, [showSpinner]);
  useEffect(() => {
    if (redirect) {
      setRedirect(false);
      redirectToWizard(props.history, props.project);
    }
  }, [redirect]);
  const filteredRequests = getRequest(requests, props.project);
  return (
    <div>
      {filteredRequests && filteredRequests.length > 0 && (
        <div style={{ marginTop: 5 }}>
          <Button
            onClick={setOpen.bind(this, true)}
            fullWidth
            variant="outlined"
            className={props.classes.button}
          >
            {props.t("Invest With Loan")}
          </Button>
          <Dialog
            open={open}
            onClose={setOpen.bind(this, false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {props.t("Choose Investing Plan")}
            </DialogTitle>
            <DialogContent>
              {showSpinner && <LoadingCircular open />}
              {createRequestList(
                props,
                filteredRequests,
                setSelectedRequest,
                request,
                props.direction
              )}
            </DialogContent>
            <DialogActions>
              {request && (
                <Button
                  onClick={submitOffer.bind(
                    this,
                    setSpinner,
                    props,
                    request,
                    filteredRequests
                  )}
                  color="primary"
                >
                  {props.t("Next")}
                </Button>
              )}
              <Button onClick={setOpen.bind(this, false)} color="primary">
                {props.t("cancel")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

function createRequestList(
  props,
  requests,
  setSelectedRequest,
  selectedRequest,
  direction
) {
  return (
    <List>
      {requests.map(request => (
        <ListItem
          key={request.key}
          role={undefined}
          dense
          button
          onClick={setSelectedRequest.bind(this, request.key)}
        >
          {direction !== "rtl" && (
            <Checkbox
              checked={selectedRequest === request.key}
              tabIndex={-1}
              disableRipple
            />
          )}
          <Paper
            style={{
              boxShadow: "none",
              borderWidth: 2,
              borderColor: "#e5e5e5",
              borderStyle: "solid"
            }}
          >
            <MortgageRequestView
              t={props.t}
              project={props.project}
              request={request}
            />
          </Paper>
          {direction === "rtl" && (
            <Checkbox
              checked={selectedRequest === request.key}
              tabIndex={-1}
              disableRipple
            />
          )}
        </ListItem>
      ))}
    </List>
  );
}

function submitOffer(setSpinner, props, requestKey, requests) {
  let filteredRequest = requests.filter(
    givenRequest => requestKey === givenRequest.key
  );
  if (filteredRequest && filteredRequest.length > 0) {
    const request = filteredRequest[0];
    props.setPendingOrder(
      props.user,
      props.project.address,
      parseInt(request.amount) + parseInt(request.downPayment),
      1
    );
    setSpinner(true);
  }
}

function redirectToWizard(history, project) {
  history.push("/operationHub");
}

function getRequest(userProjectsRequests, project) {
  let approvedRequests = userProjectsRequests.filter(
    request => request.approved && request.project.address === project.address
  );
  if (approvedRequests.length === 0) {
    return [];
  }
  return approvedRequests;
}

const mapStateToProps = (state, props) => ({
  direction: state.userProfileReducer.direction,
  user: state.login.user
});
const mapDispatchToProps = {
  setPendingOrder
};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(MortgageInvest)
);
