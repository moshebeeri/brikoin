import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import ProjectActions from "./projectActions";
import PendingOrders from "./pendingOrders";
import PendingMortgagesRequests from "./mortgageRequests";
import BidsAsksTable from "./bidsAskTable";
import ProjectMortgageOffering from "./ProjectMortgageOffering";
import ActiveOrders from "./activeOrders";
import OfficeOrderDetails from "./officeOrderDetails";
import GroupDetails from "./groupDetails";
import AuctionsTable from "./auctionsTable";
import GroupsSidePanel from "./groupsSidePanel";
import AuctionBidOrders from "./auctionBidOrders";
import AuctionsHistoryTable from "./auctionsHistoryTable";
import ActiveAuctionOrders from "./activeAuctionOrders";
import {
  getTopBidsAsks,
  getTopHistory
} from "../../redux/selectors/tradesSelector";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { cancelMortgageRequest } from "../../redux/actions/mortgage";
import numberUtils from "../../utils/numberUtils";
import currencyUtils from "../../utils/currencyUtils";
import { cancelOrder, cancelOrderExternal } from "../../redux/actions/trade";
import { listenForProjectRequests } from "../../redux/actions/case";
import { withProjectTradesStats } from "../../UI/warappers/withProjectTradesStats";
import LastDealsTable from "./lastDealsTable";

class ProjectSidePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listen: {}
    };
  }

  componentDidUpdate() {
    const { listenForProjectRequests } = this.props;
    const order = this.getUserPendingOrder();
    if (order && !this.state.listen[order.id]) {
      listenForProjectRequests(order.project);
      let listener = this.state.listen;
      listener[order.id] = true;
      this.setState({ listen: listener });
    }
  }

  render() {
    const { project } = this.props;
    if (project.type === "parentProject") {
      return <div></div>;
    }

    if(project.flowType){
      return  <ProjectActions
      t={this.props.t}
      project={project}
    />
    }
    if (project.structure === "SingleApartment") {
      return this.singleApartmentPanel();
    }
    if (project.structure === "Office") {
      return this.officeProjectPanel();
    }
    if (project.tradeMethod === "GROUP") {
      return (
        <GroupsSidePanel
          initialAsk={this.props.initialAsk}
          project={project}
          location={this.props.location}
          history={this.props.history}
          t={this.props.t}
        />
      );
    }
    if (project.fundingProject) {
      return this.fondSideProjectPanel();
    }
    return this.sideProjectPanel();
  }

  getUserPendingOrder() {
    const { project, pendingOrders, user } = this.props;
    if (!user) {
      return "";
    }
    const userOrders =
      pendingOrders[project.address] &&
      pendingOrders[project.address].length > 0
        ? pendingOrders[project.address].filter(
            order => order.active && order.userId === user.uid
          )
        : [];
    return userOrders && userOrders.length > 0 ? userOrders[0] : "";
  }

  singleApartmentPanel() {
    const { project, projectInitialAsk, classes } = this.props;
    const order = this.getUserPendingOrder();
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
            order={order}
            history={this.props.history}
            t={this.props.t}
            project={project}
            projectInitialAsk={projectInitialAsk}
          />
        </div>

        <div>
          {this.apartmentOfferPanel()}
          <ProjectMortgageOffering
            order={order}
            history={this.props.history}
            project={project}
            t={this.props.t}
          />
          {order && (
            <Card className={classes.cardSubMenu}>
              <div>
                <Typography align="center" variant="h6" color="textSecondary">
                  {order.acceptOffer
                    ? this.props.t("Offer Accepted")
                    : this.props.t("My Offer")}
                </Typography>
                <Typography align="center" variant="h5">
                  {project.currency
                    ? currencyUtils.currencyCodeToSymbol(project.currency)
                    : "$"}{" "}
                  {numberUtils.formatNumber(order.amount, 0)}{" "}
                </Typography>
              </div>
            </Card>
          )}
        </div>
        <div>
          {order &&
            !order.rejectOffer &&
            !order.acceptOffer &&
            order.counterOffer > 0 && (
              <Card className={classes.cardSubMenu}>
                <div>
                  <Typography align="center" variant="h6" color="textSecondary">
                    {this.props.t("Counter Offer")}
                  </Typography>
                  <Typography align="center" variant="h5">
                    {project.currency
                      ? currencyUtils.currencyCodeToSymbol(project.currency)
                      : "$"}{" "}
                    {numberUtils.formatNumber(order.counterOffer, 0)}{" "}
                  </Typography>
                </div>
              </Card>
            )}
        </div>
      </div>
    );
  }

  apartmentOfferPanel() {
    const { classes, project } = this.props;
    return (
      <Card className={classes.cardSubMenu}>
        <div>
          <Typography align="center" variant="h6" color="textSecondary">
            {this.props.t("sellerPrice")}
          </Typography>

          <Typography align="center" variant="h5">
            {project.currency
              ? currencyUtils.currencyCodeToSymbol(project.currency)
              : "$"}{" "}
            {numberUtils.formatNumber(project.target, 0)}{" "}
          </Typography>
        </div>
      </Card>
    );
  }

  fondSideProjectPanel() {
    const { project, projectInitialAsk } = this.props;
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
            t={this.props.t}
            project={project}
            projectInitialAsk={projectInitialAsk}
          />
        </div>

        <div>{this.projectTargetPanel()}</div>

        <div>{this.projectStatusPanel()}</div>
      </div>
    );
  }

  projectStatusPanel() {
    const { project, classes, projectInitialAsk, cancelExternal } = this.props;
    return (
      <Card className={classes.cardSubMenu}>
        <div>
          {cancelExternal || (
            <div
              style={{
                display: "flex",
                borderWidth: 5,
                borderColor: "red",
                flexDirection: "row"
              }}
            >
              <div>
                <Typography align="center" variant="h6" color="textSecondary">
                  {this.props.t("targetStatus")}
                </Typography>
                {projectInitialAsk ? (
                  <Typography align="center" variant="h5">
                    {project.currency
                      ? currencyUtils.currencyCodeToSymbol(project.currency)
                      : "$"}{" "}
                    {numberUtils.formatNumber(
                      project.target - projectInitialAsk.size,
                      0
                    )}
                  </Typography>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      color: "green",
                      fontSize: 16
                    }}
                  >
                    {this.props.t("tradable")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  projectTargetPanel() {
    const { classes, projectInitialAsk, project } = this.props;
    return (
      <Card className={classes.cardSubMenu}>
        <div>
          {projectInitialAsk ? (
            <Typography align="center" variant="h6" color="textSecondary">
              {this.props.t("targetPrice")}
            </Typography>
          ) : (
            <Typography align="center" variant="h6" color="textSecondary">
              {this.props.t("targetReached")}
            </Typography>
          )}
          {projectInitialAsk ? (
            <Typography align="center" variant="h5">
              $ {numberUtils.formatNumber(project.target, 0)}{" "}
            </Typography>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                color: "green",
                fontSize: 24,
                marginBottom: 2,
                marginTop: 2
              }}
              align="center"
              variant="h5"
            >
              $ {numberUtils.formatNumber(project.target, 0)}{" "}
            </div>
          )}
        </div>
      </Card>
    );
  }

  officeProjectPanel() {
    const {
      activeAccount,
      project,
      topHistory,
      topAsks,
      userProjectPendingOrders,
      mortgagesRequests,
      userProjectPosition
    } = this.props;
    const projectAddress = project.address;
    const topProjectHistory = topHistory[projectAddress];
    const projectAsks = topAsks[project.address];
    const filteredAsks =
      projectAsks && Object.keys(projectAsks).length > 0
        ? projectAsks.filter(ask => ask.state === "initial")
        : [];
    const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";
    const order = this.getUserPendingOrder();
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
            t={this.props.t}
            project={project}
            projectInitialAsk={projectInitialAsk}
          />
          <ProjectMortgageOffering
            order={order}
            history={this.props.history}
            project={project}
            t={this.props.t}
          />
        </div>
        <OfficeOrderDetails
          location={this.props.location}
          history={this.props.history}
          t={this.props.t}
        />
        <GroupDetails
          location={this.props.location}
          history={this.props.history}
          t={this.props.t}
        />
        {this.targetPricePanel()}
        {project.structure === "Office" && this.minInvestmentPanel()}

        <div>
          <PendingOrders
            t={this.props.t}
            rows={userProjectPendingOrders[projectAddress]}
          />
        </div>
        {/*<div>*/}
        {/*<PendingMortgagesRequests project={project} activeAccount={activeAccount}*/}
        {/*cancelMortgageRequest={this.cancelMortgageRequest.bind(this)} t={this.props.t}*/}
        {/*rows={mortgagesRequests[projectAddress]} />*/}
        {/*</div>*/}

        <div>
          <ActiveAuctionOrders
            t={this.props.t}
            projectId={projectAddress}
            cancelOrderExternal={this.cancelOrderExternal.bind(this)}
            cancelOrder={this.cancelOrder.bind(this)}
          />

          <ActiveOrders
            project={project}
            activeAccount={activeAccount}
            cancelOrderExternal={this.cancelOrderExternal.bind(this)}
            cancelOrder={this.cancelOrder.bind(this)}
            t={this.props.t}
            rows={userProjectPosition[projectAddress]}
          />
        </div>
        <div style={{ marginRight: 50, marginLeft: 50 }}>
          <LastDealsTable t={this.props.t} rows={topProjectHistory} />
        </div>
      </div>
    );
  }

  targetPricePanel() {
    const { classes, initialAsk, project } = this.props;
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
            <Typography align="left" variant={"h6"} color="textSecondary">
              {this.props.t("Remaining Investments")}
            </Typography>
            <Typography align="center" variant={"h6"} color="textSecondary">
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

  minInvestmentPanel() {
    const { classes, project } = this.props;
    if (project.type === "parentProject") {
      return <div></div>;
    }
    const minimum = parseInt(project.target) / project.maxOwners;
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
            <Typography align="left" variant={"h6"} color="textSecondary">
              {project.initTargetReached
                ? this.props.t(" Units")
                : this.props.t("Minimum Investment")}
            </Typography>
            <Typography align="center" variant={"h6"} color="textSecondary">
              {project.currency && !project.initTargetReached
                ? currencyUtils.currencyCodeToSymbol(project.currency)
                : " "}{" "}
              {numberUtils.formatNumber(minimum, 0)}
            </Typography>
          </div>
        </div>
      </Card>
    );
  }

  sideProjectPanel() {
    const {
      activeAccount,
      project,
      topHistory,
      topBidsAsks,
      topAsks,
      userProjectPendingOrders,
      mortgagesRequests,
      userProjectPosition
    } = this.props;
    const projectAddress = project.address;
    const topProjectHistory = topHistory[projectAddress];
    const topProjectBidsAsks = topBidsAsks[projectAddress];
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
            history={this.props.history}
            t={this.props.t}
            project={project}
            projectInitialAsk={projectInitialAsk}
          />
        </div>
        <div>
          <PendingOrders
            t={this.props.t}
            rows={userProjectPendingOrders[projectAddress]}
          />
        </div>
        <div>
          <PendingMortgagesRequests
            project={project}
            activeAccount={activeAccount}
            cancelMortgageRequest={this.cancelMortgageRequest.bind(this)}
            t={this.props.t}
            rows={mortgagesRequests[projectAddress]}
          />
        </div>

        <div>
          <ActiveAuctionOrders
            t={this.props.t}
            projectId={projectAddress}
            cancelOrderExternal={this.cancelOrderExternal.bind(this)}
            cancelOrder={this.cancelOrder.bind(this)}
          />

          <ActiveOrders
            project={project}
            activeAccount={activeAccount}
            cancelOrderExternal={this.cancelOrderExternal.bind(this)}
            cancelOrder={this.cancelOrder.bind(this)}
            t={this.props.t}
            rows={userProjectPosition[projectAddress]}
          />
        </div>
        <div style={{ marginRight: 50, marginLeft: 50 }}>
          <div>
            <AuctionsTable t={this.props.t} projectId={projectAddress} />
            <AuctionBidOrders t={this.props.t} projectId={projectAddress} />
            <BidsAsksTable t={this.props.t} rows={topProjectBidsAsks} />
          </div>

          <div>
            <LastDealsTable t={this.props.t} rows={topProjectHistory} />
            <AuctionsHistoryTable t={this.props.t} projectId={projectAddress} />
          </div>
        </div>
      </div>
    );
  }

  cancelOrder(auctionId, side) {
    const { userProjectPosition, project } = this.props;
    const projectAddress = project.address;
    this.props.cancelOrder(
      projectAddress,
      this.props.user.uid,
      side || userProjectPosition[projectAddress].side,
      auctionId
    );
  }

  cancelMortgageRequest(key, mortgageId) {
    const { user, project } = this.props;
    this.props.cancelMortgageRequest(key, user, mortgageId, project.address);
  }

  cancelOrderExternal(request, stackId) {
    const { userProjectPosition, project } = this.props;
    const projectAddress = project.address;
    this.props.cancelOrderExternal(
      projectAddress,
      this.props.user.uid,
      userProjectPosition[projectAddress].side,
      stackId,
      request.auctionId
    );
  }
}

ProjectSidePanel.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  topHistory: getTopHistory(state, props),
  topBidsAsks: getTopBidsAsks(state, props),
  changed: state.trades.change,
  topAsks: state.trades.topAsks,
  userProjectPosition: state.trades.userProjectPosition,
  userProjectPendingOrders: state.trades.userProjectPendingOrders,
  pendingOrders: state.trades.pendingOrders,
  userUnfundedPendingOrders: state.trades.userUnfundedPendingOrders,
  mortgagesRequests: state.mortgage.mortgageRequests,
  activeAccount: state.userAccounts.activeAccount,
  lang: state.userProfileReducer.lang,
  user: state.login.user,
  init: state.trades.init
});
const mapDispatchToProps = {
  cancelMortgageRequest,
  cancelOrderExternal,
  cancelOrder,
  listenForProjectRequests
};
ProjectSidePanel.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(ProjectSidePanel)
);
