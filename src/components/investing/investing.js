import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ProjecHeadline from "./projectHeadline";
import CardContent from "@material-ui/core/CardContent";
import { SubmitOperation, ApproveDialog } from "../../UI/index";
import { config } from "../../conf/config";
import MortgageRequestsDesc from "./mortgageRequestsDesc";
import AccountBalance from "@material-ui/icons/AccountBalance";
import { connect } from "react-redux";
import numberUtils from "../../utils/numberUtils";
import { format } from "../../utils/stringUtils";
import Grid from "@material-ui/core/Grid";
import { trade, tradeExternalRequest } from "../../redux/actions/trade";
import BidsAsksTable from "../../UI/project/bidsAskTable";
import LastDealsTable from "../../UI/project/lastDealsTable";
import {
  getTopBidsAsks,
  getTopHistory
} from "../../redux/selectors/tradesSelector";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
const ADDRESS_NULL = "0x0000000000000000000000000000000000000000";
const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    card: {
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 280
    },
    menu: {
      width: 200
    },
    cardSmall: {
      width: 380,
      height: 300,
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
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
      height: 30
    },
    button2: {
      marginRight: "12%",
      width: 100,
      height: 30
    }
  };
};

class Investing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      price: 1,
      verifyPassword: "",
      showCaptcha: false,
      useExternal: false
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  invest(request) {
    const { trade, activeAccount, projects, user, topAsks } = this.props;
    const projectAddress = this.props.location.pathname.substring(11)
      ? this.props.location.pathname.substring(11)
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
        mortgageeAddress: request.mortgagee ? request.mortgagee : "",
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
    }
  }
  investExternalBid(request, stackId) {
    request.limit = request.limit / config.stoneRatio;
    this.investExternal(request, stackId, "bid");
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  investExternal(request, stackId, type) {
    const {
      tradeExternalRequest,
      activeAccount,
      user,
      projects,
      topAsks
    } = this.props;
    const projectAddress = this.props.location.pathname.substring(11)
      ? this.props.location.pathname.substring(11)
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
  redirectToMortgages() {
    const projectAddress = this.props.location.pathname.substring(11)
      ? this.props.location.pathname.substring(11)
      : "";
    this.props.history.push("/projectMortgages/" + projectAddress);
  }
  render() {
    const {
      classes,
      lang,
      activeAccount,
      projects,
      projectsMortgages,
      topAsks,
      mortgagesRequests,
      userProjectPendingOrders,
      user
    } = this.props;
    // const locale = lang === 'En' ? 'en' : 'he-il'
    const projectAddress = this.props.location.pathname.substring(11)
      ? this.props.location.pathname.substring(11)
      : "";
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    const mortgages = projectsMortgages[projectAddress];

    if (projects && projects.length > 0) {
      const projectAsks = topAsks[project.address];
      const filteredAsks =
        projectAsks && Object.keys(projectAsks).length > 0
          ? projectAsks.filter(ask => ask.state === "initial")
          : [];
      const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";
      const mortgageFilteredRequest =
        mortgagesRequests && mortgagesRequests[project.address]
          ? mortgagesRequests[project.address].filter(
              request => !request.trade && request.user === user.uid
            )
          : [];
      const approvedMortgage =
        mortgageFilteredRequest.length > 0 &&
        mortgageFilteredRequest[0].approved
          ? mortgageFilteredRequest[0]
          : "";
      const processOrder =
        userProjectPendingOrders[projectAddress] &&
        userProjectPendingOrders[projectAddress].length > 0;

      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              margin: 5,
              maxWidth: 1140,
              flexDirection: "column",
              marginTop: 90
            }}
          >
            {this.title(classes)}
            <ProjecHeadline project={project} lang={lang} />

            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {this.mainPanel(
                classes,
                activeAccount,
                project,
                projectInitialAsk,
                approvedMortgage,
                mortgagesRequests,
                mortgages,
                processOrder
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  mainPanel(
    classes,
    activeAccount,
    project,
    projectInitialAsk,
    approvedMortgage,
    mortgagesRequests,
    mortgages,
    processOrder
  ) {
    return (
      <div style={{ marginTop: 20 }}>
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          justify="center"
          spacing={16}
        >
          <Grid key="1" item>
            x
            {this.investPanel(
              classes,
              activeAccount,
              project,
              projectInitialAsk,
              processOrder
            )}
            {approvedMortgage &&
              this.approvedMortgagePanel(
                classes,
                approvedMortgage,
                activeAccount,
                project,
                projectInitialAsk,
                mortgagesRequests,
                processOrder
              )}
            {!approvedMortgage && mortgages && this.mortgageButton(classes)}
          </Grid>
          <Grid key="2" item>
            <div style={{ backgroundColor: "pink" }}>
              {this.informationPanel(classes)}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  title(classes) {
    return (
      <div style={{}}>
        <Typography
          className={classes.textFieldClass}
          align="left"
          variant="h5"
        >
          {this.props.t("InvestingProcess")}
        </Typography>
      </div>
    );
  }

  investPanel(
    classes,
    activeAccount,
    project,
    projectInitialAsk,
    processOrder
  ) {
    return (
      <Card className={classes.card}>
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "flex-start",
                  fontSize: 15
                }}
              >
                {this.props.t("invest")}
              </div>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-between"
                spacing={16}
              >
                <Grid key="1" item>
                  {this.amount(classes)}
                </Grid>
                <Grid key="2" item>
                  {projectInitialAsk &&
                    this.investButton(
                      activeAccount,
                      project,
                      classes,
                      processOrder
                    )}
                </Grid>
              </Grid>
              {!projectInitialAsk && (
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                  spacing={16}
                >
                  <Grid key="1" item>
                    {this.price(classes)}
                  </Grid>
                  <Grid key="2" item>
                    {this.investButton(
                      activeAccount,
                      project,
                      classes,
                      processOrder
                    )}
                  </Grid>
                </Grid>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  price(classes) {
    return (
      <TextField
        label={this.props.t("price")}
        id="price"
        className={classes.textField}
        onChange={this.handleChange("price")}
        margin="normal"
        fullWidth
        type="number"
        value={this.state.price}
      />
    );
  }

  amount(classes) {
    return (
      <TextField
        label={this.props.t("amount")}
        id="amount"
        className={classes.textField}
        onChange={this.handleChange("amount")}
        margin="normal"
        fullWidth
        type="number"
        value={this.state.amount}
      />
    );
  }
  processDone() {
    const projectAddress = this.props.location.pathname.substring(11)
      ? this.props.location.pathname.substring(11)
      : "";
    this.props.history.push("/projectsView/" + projectAddress);
  }

  investButton(activeAccount, project, classes, processOrder) {
    const cost = numberUtils.formatNumber(
      parseInt(this.state.amount) *
        parseFloat(this.state.price ? this.state.price : 1),
      2
    );

    return (
      <div style={{ marginTop: 30, marginLeft: 20 }}>
        <ApproveDialog
          cancelAction={this.cancelInvest.bind(this)}
          approveAction={this.invest.bind(this)}
          openDialog={this.state.approve}
          request={{
            projectId: project.address,
            amount: this.state.amount,
            limit: this.state.price,
            type: "bid"
          }}
          t={this.props.t}
          processDone={this.processDone.bind(this)}
          approveMessage={format(this.props.t("approveMessage"), [cost])}
          process={processOrder}
        />
        {activeAccount.type === "EXTERNAL" ? (
          <div style={{ borderColor: "black", border: 1 }}>
            <SubmitOperation
              onSuccess={this.investExternalBid.bind(this)}
              request={{
                projectId: project.address,
                amount: this.state.amount,
                limit: this.state.price * config.stoneRatio,
                signedDocument: ADDRESS_NULL
              }}
              label={this.props.t("buy")}
              contract={"CornerStone"}
              event={"BidCreated"}
              method={"bid"}
            />
          </div>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            className={classes.button}
            onClick={this.approveInvest.bind(this)}
          >
            {this.props.t("buy")}
          </Button>
        )}
      </div>
    );
  }
  approveInvest() {
    this.setState({ approve: true });
  }

  cancelInvest() {
    this.setState({ approve: false });
  }

  approveMortgageInvest() {
    this.setState({ approveMortgage: true });
  }

  cancelMortgageInvest() {
    this.setState({ approveMortgage: false });
  }

  approvedMortgagePanel(
    classes,
    approvedMortgage,
    activeAccount,
    project,
    projectInitialAsk,
    mortgagesRequests,
    processOrder
  ) {
    const cost = numberUtils.formatNumber(
      (parseInt(approvedMortgage.amount) +
        parseInt(approvedMortgage.downPayment)) *
        parseFloat(this.state.price ? this.state.price : 1),
      2
    );

    return (
      <div style={{ display: "flex", maxWidth: 500, marginTop: 20 }}>
        <Card className={classes.card}>
          <CardContent>
            <form noValidate autoComplete="off">
              <div
                style={{
                  display: "flex",
                  width: "100%",

                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "flex-start"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "row"
                  }}
                >
                  <AccountBalance
                    style={{ width: 50, height: 50, marginRight: 5 }}
                  />
                  <div
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "flex-start",
                      fontSize: 15,
                      marginRight: 20,
                      marginLeft: 20,
                      marginBottom: 10
                    }}
                  >
                    {this.props.t("investWithMortgage")}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <ApproveDialog
                    cancelAction={this.cancelMortgageInvest.bind(this)}
                    approveAction={this.invest.bind(this)}
                    openDialog={this.state.approveMortgage}
                    request={{
                      projectId: project.address,
                      amount:
                        parseInt(approvedMortgage.amount) +
                        parseInt(approvedMortgage.downPayment),
                      limit: this.state.price,
                      mortgageRequestAddress:
                        approvedMortgage.mortgageRequestAddress,
                      mortgageConditionAddress:
                        approvedMortgage.mortgageConditionAddress,
                      mortgageAddress: approvedMortgage.mortgageAddress,
                      downPayment: approvedMortgage.downPayment,
                      mortgagee: approvedMortgage.mortgagee,
                      mortgageId: approvedMortgage.mortgageId,
                      mortgageRequestId: approvedMortgage.key,
                      type: "bid"
                    }}
                    t={this.props.t}
                    processDone={this.processDone.bind(this)}
                    approveMessage={format(this.props.t("approveMessage"), [
                      cost
                    ])}
                    process={processOrder}
                  />
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <TextField
                      label={this.props.t("amount")}
                      id="amount"
                      className={classes.textField}
                      onChange={this.handleChange("amount")}
                      margin="normal"
                      disabled
                      fullWidth
                      type="number"
                      value={parseInt(
                        parseInt(approvedMortgage.amount) +
                          parseInt(approvedMortgage.downPayment) /
                            this.state.price
                      )}
                    />
                    <div style={{ marginTop: 30, marginLeft: 20 }}>
                      {activeAccount.type === "EXTERNAL" ? (
                        <div style={{ borderColor: "black", border: 1 }}>
                          <SubmitOperation
                            onSuccess={this.investExternalBid.bind(this)}
                            request={{
                              projectId: project.address,
                              amount: this.state.amount,
                              limit: this.state.price * config.stoneRatio,
                              signedDocument: ADDRESS_NULL
                            }}
                            label={this.props.t("buy")}
                            contract={"CornerStone"}
                            event={"BidCreated"}
                            method={"bid"}
                          />
                        </div>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          className={classes.button}
                          onClick={this.approveMortgageInvest.bind(this)}
                        >
                          {this.props.t("buy")}
                        </Button>
                      )}
                    </div>
                  </div>
                  {!projectInitialAsk && (
                    <TextField
                      label={this.props.t("price")}
                      id="price"
                      className={classes.textField}
                      onChange={this.handleChange("price")}
                      margin="normal"
                      fullWidth
                      type="number"
                      value={this.state.price}
                    />
                  )}
                </div>
              </div>
            </form>
            <MortgageRequestsDesc
              t={this.props.t}
              rows={mortgagesRequests[project.address]}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  mortgageButton(classes) {
    return (
      <div style={{ display: "flex", maxWidth: 500, marginTop: 20 }}>
        <Card className={classes.card}>
          <CardContent>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  justifyContent: "flex-start"
                }}
              >
                <AccountBalance
                  style={{ width: 50, height: 50, marginRight: 5 }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "flex-start",
                        fontSize: 15,
                        marginBottom: 10
                      }}
                    >
                      {this.props.t("gettingMortgage")}
                    </div>
                    <Typography
                      align={this.props.direction === "ltr" ? "left" : "right"}
                      variant="h6"
                      color="textSecondary"
                    >
                      {this.props.t("gettingMortgageMsg")}
                    </Typography>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end"
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={this.redirectToMortgages.bind(this)}
                      variant="outlined"
                      className={classes.button2}
                    >
                      {this.props.t("start")}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  projectStatistics(topProjectBidsAsks, topProjectHistory) {
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

  informationPanel(classes) {
    return (
      <Card className={classes.cardSmall}>
        <CardContent>
          <Typography
            align={this.props.direction === "ltr" ? "left" : "right"}
            variant="h5"
          >
            {" "}
            {this.props.t("InvestingProcess")}
          </Typography>
          <Typography
            align={this.props.direction === "ltr" ? "left" : "right"}
            variant="h6"
            color="textSecondary"
          >
            {this.props.t("InvestingProcessMsg")}
          </Typography>
          <div style={{ marginTop: 30 }}>
            <Typography
              align={this.props.direction === "ltr" ? "left" : "right"}
              variant="h5"
            >
              {this.props.t("GettingMortgage")}
            </Typography>
            <Typography
              align={this.props.direction === "ltr" ? "left" : "right"}
              variant="h6"
              color="textSecondary"
            >
              {this.props.t("GettingMortgageDesc")}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}

Investing.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  projectsMortgages: state.projects.projectsMortgages,
  user: state.login.user,
  errorMessage: state.login.errorMessage,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang,
  projects: getPopulatedProjects(state, props),
  topHistory: getTopHistory(state, props),
  topBidsAsks: getTopBidsAsks(state, props),
  mortgagesRequests: state.mortgage.mortgageRequests,
  userProjectPendingOrders: state.trades.userProjectPendingOrders,
  changed: state.trades.change,
  topAsks: state.trades.topAsks,
  activeAccount: state.userAccounts.activeAccount
});
const mapDispatchToProps = {
  trade,
  tradeExternalRequest
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Investing)
);
