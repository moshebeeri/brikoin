import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ProjecHeadline from "../investing/projectHeadline";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import { trade, tradeExternalRequest } from "../../redux/actions/trade";
import BidsAsksTable from "../../UI/project/bidsAskTable";
import LastDealsTable from "../../UI/project/lastDealsTable";
import {
  projectBulkTransaction,
  getTopBidsAsks,
  getTopHistory
} from "../../redux/selectors/tradesSelector";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import BulkSellForm from "./bulkSellForm";
const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 280
    },
    menu: {
      width: 200
    },
    card: {
      marginTop: 20
    },
    cardSmall: {
      width: 380,
      height: 300,
      marginRight: "10%"
    },

    grid: {
      flex: 1
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
    },
    title: {
      marginBottom: 16,
      fontSize: 14
    },
    pos: {
      marginBottom: 12
    },
    button: {
      width: 100,
      height: 20
    },
    button2: {
      marginRight: "12%",
      width: 100,
      height: 20
    }
  };
};

class Selling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      verifyPassword: "",
      showCaptcha: false,
      useExternal: false
    };
  }

  invest(request) {
    const { trade, activeAccount, projects, user, topAsks } = this.props;
    const projectAddress = this.props.location.pathname.substring(9)
      ? this.props.location.pathname.substring(9)
      : "";
    const projectAsks = topAsks[projectAddress];
    const filteredAsks =
      projectAsks && Object.keys(projectAsks).length > 0
        ? projectAsks.filter(ask => ask.state === "initial")
        : [];
    const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";

    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";

    if (this.state.amount > 0 || request.amount > 0) {
      let bid = {
        name: project.name,
        price: request.limit ? request.limit : 1,
        projectId: project.address,
        side: request.type,
        downPayment: request.downPayment ? request.downPayment : "",
        mortgageRequestAddress: request.mortgageRequestAddress
          ? request.mortgageRequestAddress
          : "",
        mortgageConditionAddress: request.mortgageConditionAddress
          ? request.mortgageConditionAddress
          : "",
        mortgageAddress: request.mortgageAddress ? request.mortgageAddress : "",
        mortgageId: request.mortgageId ? request.mortgageId : "",
        mortgageeAddress: request.mortgageeAddress
          ? request.mortgageeAddress
          : "",
        mortgageRequestId: request.mortgageRequestId
          ? request.mortgageRequestId
          : "",
        isMortgage: !!request.mortgageId,
        userAccount: activeAccount.accountId,
        size: request.amount ? request.amount : this.state.amount,
        state: projectInitialAsk ? "initial" : "trading",
        time: new Date().getTime(),
        user: user.uid,
        status: "pending"
      };
      trade(bid, request.type);
      this.props.history.push("/projectsView/" + projectAddress);
    }
  }

  investExternal(request, stackId, type) {
    const {
      tradeExternalRequest,
      activeAccount,
      user,
      projects,
      topAsks
    } = this.props;
    const projectAddress = this.props.location.pathname.substring(9)
      ? this.props.location.pathname.substring(9)
      : "";
    const projectAsks = topAsks[projectAddress];
    const filteredAsks =
      projectAsks && Object.keys(projectAsks).length > 0
        ? projectAsks.filter(ask => ask.state === "initial")
        : [];
    const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";

    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    this.setState({ open: false });
    if (this.state.amount > 0) {
      let bid = {
        name: project.name,
        price: request.limit ? request.limit : 1,
        projectId: project.address,
        side: type,
        userAccount: activeAccount.accountId,
        size: request.amount,
        state: projectInitialAsk ? "initial" : "trading",
        time: new Date().getTime(),
        user: user.uid,
        status: "pending"
      };
      tradeExternalRequest(bid, activeAccount, stackId);
      this.props.history.push("/projectsView/" + projectAddress);
    }
  }

  render() {
    const {
      classes,
      lang,
      projects,
      transactions,
      topHistory,
      topBidsAsks
    } = this.props;
    // const locale = lang === 'En' ? 'en' : 'he-il'
    const projectAddress = this.props.location.pathname.substring(9)
      ? this.props.location.pathname.substring(9)
      : "";
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    const projectTransaction = transactions[projectAddress];
    const topProjectHistory = topHistory[projectAddress];
    const topProjectBidsAsks = topBidsAsks[projectAddress];
    if (projectTransaction && projectTransaction.length > 0) {
      return (
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 90 }}
        >
          <div
            style={{
              marginLeft: "10%",
              marginRight: "10%"
            }}
          >
            <Typography
              className={classes.textFieldClass}
              align="left"
              variant="h5"
            >
              {this.props.t("SellingProcess")}
            </Typography>
          </div>
          <ProjecHeadline project={project} lang={lang} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItem: "space-between",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "45%",
                marginLeft: "10%",
                marginTop: 20
              }}
            >
              {projectTransaction.map(transaction =>
                transaction.remainingSize > 0 ? (
                  this.createBulkSellForm(transaction, project)
                ) : (
                  <div />
                )
              )}
            </div>
            <div
              style={{
                marginTop: 20,
                marginRight: "10%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {this.createMessagesPanel(classes)}
              {this.createHistoryStatsPanel(
                topProjectBidsAsks,
                topProjectHistory
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  createHistoryStatsPanel(topProjectBidsAsks, topProjectHistory) {
    return (
      <div>
        <div style={{ marginTop: 10 }} />

        <div style={{ marginTop: 5 }}>
          <BidsAsksTable t={this.props.t} rows={topProjectBidsAsks} />
        </div>

        <div style={{ marginTop: 5 }}>
          <LastDealsTable t={this.props.t} rows={topProjectHistory} />
        </div>
      </div>
    );
  }

  createMessagesPanel(classes) {
    return (
      <Card className={classes.cardSmall}>
        <CardContent>
          <Typography align="left" variant="h5">
            {" "}
            {this.props.t("SellingProcess")}
          </Typography>
          <Typography align="left" variant="h6" color="textSecondary">
            {this.props.t("SellingProcessMsg")}
          </Typography>
          <div style={{ marginTop: 30 }}>
            <Typography align="left" variant="h5">
              {this.props.t("SellingMortgage")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("SellingMortgageDesc")}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  createBulkSellForm(transaction, project) {
    return (
      <div style={{ marginBottom: 10 }}>
        <BulkSellForm
          t={this.props.t}
          transaction={transaction}
          project={project}
          invest={this.invest.bind(this)}
          investExternal={this.investExternal.bind(this)}
        />
      </div>
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
}

Selling.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  errorMessage: state.login.errorMessage,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang,
  projects: getPopulatedProjects(state, props),
  topHistory: getTopHistory(state, props),
  topBidsAsks: getTopBidsAsks(state, props),
  transactions: projectBulkTransaction(state, props),
  changed: state.trades.change,
  topAsks: state.trades.topAsks,
  activeAccount: state.userAccounts.activeAccount
});
const mapDispatchToProps = {
  trade,
  tradeExternalRequest
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Selling)
);
