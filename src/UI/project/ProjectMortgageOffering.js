import React, { useEffect, useReducer, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import { withProjectTradesStats } from "../../UI/warappers/withProjectTradesStats";
import MortgageDialog from "../mortgage/mortgageDialog";
import MortgagRequestSummary from "../mortgage/mortgagRequestSummary";
import {
  listenForMortgages,
  listenForOrders
} from "../../UI/mortgage/mortgageUtils";

function ProjectMortgageOffering(props) {
  const [mortgageRequests, setMortgageRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  listenForMortgages(setMortgageRequests, props);
  listenForOrders(setOrders, props);
  const { classes, mortgages, user, project } = props;
  if (!user) {
    return <div />;
  }

  if (!user.emailVerified) {
    return <div />;
  }
  if (!mortgages) {
    return <div />;
  }
  if (mortgages.length === 0) {
    return <div />;
  }

  if (orders && orders.length > 0) {
    return <div />;
  }

  const filteredRequests =
    mortgageRequests.length > 0
      ? mortgageRequests.filter(request => request.amount)
      : [];
  const requests =
    filteredRequests.length > 0
      ? filteredRequests.filter(
          request =>
            request.project && request.project.address === project.address
        )
      : [];
  return (
    <Card className={classes.investCard}>
      <div style={{ marginTop: 10 }}>
        <div
          style={{
            display: "flex",
            borderWidth: 5,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          {requests.length > 0 ? (
            requests.map(request => (
              <MortgagRequestSummary
                project={project}
                request={request}
                t={props.t}
              />
            ))
          ) : (
            <div>
              <Typography align="left" variant={"h6"} color="textSecondary">
                {props.t("Project Funding")}
              </Typography>
              <div style={{ marginTop: 5, marginBottom: 10 }}>
                <Button
                  onClick={setOpen.bind(this, true)}
                  fullWidth
                  variant="outlined"
                  className={classes.button}
                >
                  {props.t("Check Funding")}
                </Button>
              </div>
            </div>
          )}
          <MortgageDialog
            history={props.history}
            project={project}
            open={open}
            t={props.t}
            handleClose={setOpen.bind(this, false)}
            mortgages={mortgages}
          />
        </div>
      </div>
    </Card>
  );
}

export default withProjectTradesStats(ProjectMortgageOffering);
