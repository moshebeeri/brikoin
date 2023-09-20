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
import { connect } from "react-redux";
import numberUtils from "../../utils/numberUtils";
import { format } from "../../utils/stringUtils";
import Grid from "@material-ui/core/Grid";
import { trade, tradeExternalRequest } from "../../redux/actions/trade";
import { getTopHistory } from "../../redux/selectors/tradesSelector";
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

class InvestingAuctions extends React.Component {
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
    const { trade, activeAccount, projects, user } = this.props;
    const projectAddress = this.getProjectAddress();

    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";

    if (this.state.amount > 0 || request.amount > 0) {
      let bid = {
        name: project.name,
        price: request.limit ? request.limit : 1,
        projectId: project.address,
        side: request.type,
        auctionId: request.auctionId,
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
    const projectAddress = this.getProjectAddress();
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
        auctionId: request.auctionId,
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

  getProjectAddress() {
    return this.props.location.pathname.substring(9)
      ? this.props.location.pathname.substring(9)
      : "";
  }

  render() {
    const {
      classes,
      lang,
      activeAccount,
      projects,
      userProjectPendingOrders,
      userProjectAuctions
    } = this.props;
    // const locale = lang === 'En' ? 'en' : 'he-il'
    const projectAddress = this.getProjectAddress();
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";

    if (projects && projects.length > 0) {
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
              {userProjectAuctions[project.address].map(auction =>
                this.mainPanel(
                  classes,
                  activeAccount,
                  project,
                  auction,
                  processOrder
                )
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  mainPanel(classes, activeAccount, project, auction, processOrder) {
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
            {this.investPanel(
              classes,
              activeAccount,
              project,
              auction,
              processOrder
            )}
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

  investPanel(classes, activeAccount, project, auction, processOrder) {
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
              </Grid>
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
                    processOrder,
                    auction
                  )}
                </Grid>
              </Grid>
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
    const projectAddress = this.getProjectAddress();
    this.props.history.push("/projectsView/" + projectAddress);
  }

  investButton(activeAccount, project, classes, processOrder, auction) {
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
            auctionId: auction.id,
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
                auctionId: auction.id,
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
            {project.tradeMethod === "auction"
              ? this.props.t("placeBid")
              : this.props.t("buy")}
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

  informationPanel(classes) {
    return (
      <Card className={classes.cardSmall}>
        <CardContent>
          <Typography align="left" variant="h5">
            {" "}
            {this.props.t("InvestingProcess")}
          </Typography>
          <Typography align="left" variant="h6" color="textSecondary">
            {this.props.t("InvestingProcessMsg")}
          </Typography>
          <div style={{ marginTop: 30 }}>
            <Typography align="left" variant="h5">
              {this.props.t("GettingMortgage")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("GettingMortgageDesc")}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}

InvestingAuctions.propTypes = {
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
  userProjectAuctions: state.trades.userProjectAuctions,
  userProjectPendingOrders: state.trades.userProjectPendingOrders,
  changed: state.trades.change,
  activeAccount: state.userAccounts.activeAccount
});
const mapDispatchToProps = {
  trade,
  tradeExternalRequest
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(InvestingAuctions)
);
