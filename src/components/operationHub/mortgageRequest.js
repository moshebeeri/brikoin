import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ApproveDialog } from "../../UI/index";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import MortgageRequestView from "../../UI/mortgage/mortgageRequestView";
import { listenForMortgage } from "./operationUtils";
import LegalDocument from "../../UI/generics/LegalDocument";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { handleMortgageRequest } from "../../redux/actions/mortgage";

//  +
export function MortgageRequest(props) {
  const [mortgageRequest, setMortgageRequest] = useState({});
  const [approveRequest, setApproveRequest] = useState(false);
  listenForMortgage(
    setMortgageRequest,
    props.operation.mortgageId,
    props.operation.mortgageRequestId
  );
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.t("ApproveMortgageRequest")}
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
        <div
          style={{
            display: "flex",
            border: "1px solid #ced4da",
            margin: 10,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ marginTop: 5, marginBottom: 10 }}>
            <Typography align={"left"} variant="h6">
              {props.t("mortgageCondition")}
            </Typography>
          </div>
          {mortgageRequest && mortgageRequest.amount && (
            <MortgageRequestView
              removeApprove
              t={props.t}
              request={mortgageRequest}
              project={props.project}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            marginRight: props.direction === "rtl" ? 30 : 0,
            marginLeft: props.direction === "rtl" ? 0 : 30,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "row"
          }}
        >
          <Typography align={"left"} variant="h6">
            {props.t("kycDocument")}
          </Typography>
          <div style={{ margin: 5 }}></div>

          <LegalDocument documentId={props.operation.kyc} icon />
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={approveMortgage.bind(this, props)}
            className={props.classes.buttonRegular}
          >
            {props.t("Approve")}
          </Button>
          <div style={{ margin: 10 }}></div>
          <Button
            fullWidth
            variant="outlined"
            onClick={rejectMortgage.bind(this, props)}
            className={props.classes.buttonRegular}
          >
            {props.t("Reject")}
          </Button>
        </div>
        <ApproveDialog
          t={props.t}
          cancelAction={closeDialog.bind(this)}
          processDone={closeDialog.bind(this)}
          process={approveRequest}
          hideAction
          processNow
          openDialog={approveRequest}
          title={props.t("ApproveRequest")}
          approveMessage={props.t("ApproveRequestMsg")}
        />
      </div>
    </Dialog>
  );
}

function closeDialog() {}

function approveMortgage(props) {
  props.handleMortgageRequest(
    props.operation.userId,
    props.operation.mortgageRequestAddress,
    props.operation.mortgageConditionAddress,
    props.project.address,
    props.operation.mortgageId,
    props.operation.mortgageRequestId,
    true,
    props.user.uid,
    props.operation.id
  );
  props.close();
}

function rejectMortgage(props) {
  props.handleMortgageRequest(
    props.operation.userId,
    props.operation.mortgageRequestAddress,
    props.operation.mortgageConditionAddress,
    props.project.address,
    props.operation.mortgageId,
    props.operation.mortgageRequestId,
    false,
    props.user.uid,
    props.operation.id
  );
  props.close();
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  handleMortgageRequest
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(MortgageRequest)
);
