import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import ProjectActions from "./projectActions";
import PendingOrders from "./pendingOrders";
import ProjectMortgageOffering from "./ProjectMortgageOffering";
import OfficeOrderDetails from "./officeOrderDetails";
import GroupDetails from "./groupDetails";
import numberUtils from "../../utils/numberUtils";
import currencyUtils from "../../utils/currencyUtils";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";

function GroupsSidePanel(props) {
  const { project, topAsks, userProjectPendingOrders } = props;
  const projectAddress = project.address;
  const projectAsks = topAsks[project.address];
  const filteredAsks =
    projectAsks && Object.keys(projectAsks).length > 0
      ? projectAsks.filter(ask => ask.state === "initial")
      : [];
  const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      <div>
        <ProjectActions
          t={props.t}
          project={project}
          projectInitialAsk={projectInitialAsk}
        />
        <ProjectMortgageOffering
          history={props.history}
          project={project}
          t={props.t}
        />
      </div>
      <OfficeOrderDetails
        location={props.location}
        history={props.history}
        t={props.t}
      />
      <GroupDetails
        location={props.location}
        history={props.history}
        t={props.t}
      />
      {targetPricePanel(props)}

      <div>
        <PendingOrders
          t={props.t}
          rows={userProjectPendingOrders[projectAddress]}
        />
      </div>
    </div>
  );
}

function targetPricePanel(props) {
  const { classes, initialAsk, project, direction } = props;
  if (!initialAsk) {
    return <div />;
  }
  const remaining = initialAsk.size;
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
          <Typography
            align={direction === "ltr" ? "left" : "right"}
            variant={"h6"}
            color="textSecondary"
          >
            {props.t("Remaining Investments")}
          </Typography>
          <Typography
            align={direction === "ltr" ? "left" : "right"}
            variant={"h6"}
            color="textSecondary"
          >
            {project.currency
              ? currencyUtils.currencyCodeToSymbol(project.currency)
              : "$"}{" "}
            {numberUtils.formatNumber(remaining, 0)}
          </Typography>
        </div>
      </div>
    </Card>
  );
}

const mapStateToProps = (state, props) => ({
  topAsks: state.trades.topAsks,
  userProjectPendingOrders: state.trades.userProjectPendingOrders,
  user: state.login.user,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {};

export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(GroupsSidePanel)
);
