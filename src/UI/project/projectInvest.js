import React from "react";
import PropTypes from "prop-types";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { InvestDialog, LoginDialog } from "../../UI/index";
import numberUtils from "../../utils/numberUtils";
import currencyUtils from "../../utils/currencyUtils";
import ProjectActions from "./projectActions";
import OfficeActionDialog from "./officeActionDialog";
import { withProjectTradesStats } from "../../UI/warappers/withProjectTradesStats";
import { connect } from "react-redux";
import { sendEvent } from "../../utils/tracker";

class ProjectInvest extends React.Component {
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  redirectToInvesting() {
    const { project } = this.props;
    if (project.tradeMethod !== "auction") {
      if (project.fundingProject) {
        this.props.history.push("/funding/" + project.address);
        sendEvent();
      } else {
        this.props.history.push("/investing/" + project.address);
      }
    } else {
      this.props.history.push("/auction/" + project.address);
    }
  }

  redirectToProjectDetails() {
    const { project } = this.props;
    this.props.history.push("/projectsView/" + project.address);
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes, project, topAsks, user, initialAsk } = this.props;
    if (project.type === "parentProject") {
      return <div></div>;
    }
    if (!topAsks) {
      return <div />;
    }
    const projectAsks = topAsks[project.address];
    if (project.tradeMethod === "auction") {
      return this.projectAuctionOperations(classes, project, user);
    }
    return this.projectOperations(classes, initialAsk, project, projectAsks);
  }

  projectAuctionOperations(classes, project, user) {
    const { projectAsks, small, direction } = this.props;
    const initialAuctions = projectAsks[project.address]
      ? projectAsks[project.address].filter(
          auction => auction.state === "initial"
        )
      : [];
    const initialAuction = initialAuctions.length > 0;
    const isSingleApp = project.structure === "SingleApartment";
    return (
      <div className={classes.projectControl}>
        <CardContent className={classes.projectContent}>
    
          {initialAuction ? (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h6"}
              color="textSecondary"
            >
              {isSingleApp
                ? this.props.t("price")
                : this.props.t("availableUnits")}
            </Typography>
          ) : (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h6"}
              color="textSecondary"
            >
              {this.props.t("unitsSold")}
            </Typography>
          )}
          {isSingleApp && (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h5"}
            >
              {project.currency
                ? currencyUtils.currencyCodeToSymbol(project.currency)
                : "$"}{" "}
              {numberUtils.formatNumber(project.target, 0)}{" "}
            </Typography>
          )}
          {!isSingleApp ? (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h5"}
            >
              {numberUtils.formatNumber(project.target, 0)}{" "}
            </Typography>
          ) : (
            <div />
          )}

          {!isSingleApp && (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h6"}
              color="textSecondary"
            >
              {this.props.t("startingPrice")}
            </Typography>
          )}

          {!isSingleApp && (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h5"}
            >
              {project.currency
                ? currencyUtils.currencyCodeToSymbol(project.currency)
                : "$"}{" "}
              {numberUtils.formatNumber(1, 0)}{" "}
            </Typography>
          )}
          {this.projectAuctionActions()}
        </CardContent>
      </div>
    );
  }

  projectOperations(classes, projectInitialAsk, project, projectAsks) {
    const { small, direction } = this.props;
    return (
      <div className={classes.projectControl}>
      <CardContent className={classes.projectContent}>
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
          {projectInitialAsk ? (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h6"}
              color="textSecondary"
            >
              {this.props.t("targetPrice")}
            </Typography>
          ) : (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h6"}
              color="textSecondary"
            >
              {this.props.t("targetReached")}
            </Typography>
          )}
          {projectInitialAsk ? (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h5"}
            >
              {project.currency
                ? currencyUtils.currencyCodeToSymbol(project.currency)
                : "$"}{" "}
              {numberUtils.formatNumber(project.target, 0)}{" "}
            </Typography>
          ) : (
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant={small ? "subtitle1" : "h5"}
            >
              {project.currency
                ? currencyUtils.currencyCodeToSymbol(project.currency)
                : "$"}{" "}
              {numberUtils.formatNumber(project.target, 0)}{" "}
              </Typography>
          )}
          {projectAsks && (
            <div>
              <Typography
                align={direction === "ltr" ? "left" : "right"}
                variant={small ? "subtitle1" : "h6"}
                color="textSecondary"
              >
                {this.props.t("targetStatus")}
              </Typography>
              {projectInitialAsk && !project.initTargetReached ? (
                <Typography
                  align={direction === "ltr" ? "left" : "right"}
                  variant={small ? "subtitle1" : "h5"}
                >
                  {project.currency
                    ? currencyUtils.currencyCodeToSymbol(project.currency)
                    : "$"}{" "}
                  {numberUtils.formatNumber(this.getProjectOrdersSum(), 0)}
                </Typography>
              ) : (
                <Typography color='inherit'
                align={direction === "ltr" ? "left" : "right"}
                variant={small ? "subtitle1" : "h5"}
              >
                  {this.props.t("tradable")}
                  </Typography>
              )}
            

            </div>
          )}
          {this.projectActions(project)}
      </div>
        </CardContent>
      </div>
    );
  }

  getProjectOrdersSum() {
    const { pendingOrders, project } = this.props;
    const projectPendingOrders = pendingOrders[project.address];
    if (projectPendingOrders.length === 0) {
      return 0;
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const approvedOrders = projectPendingOrders.filter(
      order => order.orderApproved
    );
    return approvedOrders.length > 0
      ? approvedOrders
          .map(order => parseInt(order.amount) * parseFloat(order.price))
          .reduce(reducer)
      : 0;
  }

  projectAuctionActions() {
    const { activeAccount, user, classes, project } = this.props;
    const isSingleApp = project.structure === "SingleApartment";
    return (
      <div>
        {user ? (
          activeAccount.stonesBalance > 0 ? (
            <Button
              onClick={this.redirectToInvesting.bind(this)}
              fullWidth
              variant="outlined"
              className={classes.buttonInvest}
            >
              {isSingleApp
                ? this.props.t("placeOffer")
                : this.props.t("placeBid")}
            </Button>
          ) : (
            <InvestDialog
              history={this.props.history}
              project={project}
              className={classes.buttonInvest}
              label={
                isSingleApp
                  ? this.props.t("placeOffer")
                  : this.props.t("placeBid")
              }
              t={this.props.t}
            />
          )
        ) : (
          <LoginDialog
            history={this.props.history}
            t={this.props.t}
            className={classes.button}
            variant
            buttonString={
              isSingleApp
                ? this.props.t("placeOffer")
                : this.props.t("placeBid")
            }
            title={this.props.t("pleaseLoginMessage")}
          />
        )}
        <Button
          fullWidth
          onClick={this.redirectToProjectDetails.bind(this)}
          variant="outlined"
          className={classes.buttonRegular}
        >
          {this.props.t("readMore")}
        </Button>
      </div>
    );
  }

  projectActions(project) {
    const { classes } = this.props;
    return (
    
        <Button
          fullWidth
          onClick={this.redirectToProjectDetails.bind(this)}
          variant="outlined"
          className={classes.buttonRegular}
        >
          {this.props.t("readMore")}
        </Button>
    );
  }
}

ProjectInvest.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => {
  return {
    activeAccount: state.userAccounts.activeAccount,
    user: state.login.user,
    topAsks: state.trades.topAsks,
    pendingOrders: state.trades.pendingOrders,
    userProjectAuctions: state.trades.userProjectAuctions,
    projectAsks: state.projectTradesStats.projectAsks,
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(ProjectInvest)
);
