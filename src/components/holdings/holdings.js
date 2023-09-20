import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { SubmitOperation } from "../../UI/index";
import CardMedia from "@material-ui/core/CardMedia";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import { trade, tradeExternalRequest } from "../../redux/actions/trade";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { NavLink } from "react-router-dom";
import { config } from "../../conf/config";
const styles = theme => {
  return {
    root: {
      width: "80%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginTop: 70,
      flexGrow: 1
    },
    rootGrid: {
      overflowX: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1
    },
    table: {
      minWidth: 700,
      width: "auto",
      tableLayout: "auto"
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    },
    card: {
      marginTop: "1%",
      width: "80%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      borderColor: "white"
    },
    cardDeveloper: {
      maxWidth: 400,
      position: "absolute",
      bottom: 0,
      right: 0
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    actions: {
      display: "flex"
    },
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      }),
      marginLeft: "auto"
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    },
    details: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "100%",
      marginTop: 30,
      flexDirection: "column"
    },
    cardRow: {
      display: "flex",
      marginLeft: "10%",
      marginRight: "10%",
      width: "60%",
      marginTop: "1%"
    },

    cover: {
      marginTop: "1%",
      marginLeft: 10,
      marginRight: 10,
      width: 180,
      height: 120
    },

    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  };
};
import LoadingCircular from "../../UI/loading/LoadingCircular";
class Holdings extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }
  invest(projectAddress) {
    const { trade, activeAccount, projects, user } = this.props;
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";

    this.setState({ open: false });
    if (this.state.amount > 0) {
      let bid = {
        name: project.name,
        price: 1,
        projectId: project.address,
        side: "bid",
        userAccount: activeAccount.accountId,
        size: this.state.amount,
        state: "initial",
        time: new Date().getTime(),
        user: user.uid,
        status: "pending"
      };
      trade(bid, "bid");
    }
  }

  investExternal(request, stackId, projectAddress) {
    const { tradeExternalRequest, activeAccount, user, projects } = this.props;

    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    this.setState({ open: false });
    if (this.state.amount > 0) {
      let bid = {
        name: project.name,
        price: request.limit,
        projectId: project.address,
        side: "bid",
        userAccount: activeAccount.accountId,
        size: request.amount,
        state: "initial",
        time: new Date().getTime(),
        user: user.uid,
        status: "pending"
      };
      tradeExternalRequest(bid, activeAccount, stackId);
    }
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const {
      classes,
      holdings,
      projects,
      activeAccount,
      direction
    } = this.props;
    if (!projects || (projects && projects.length === 0)) {
      return (
        <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
          <LoadingCircular open className={classes.progress} />
        </div>
      );
    }
    if (projects && projects.length > 0 && holdings && holdings.length > 0) {
      const projectMaps = projects.reduce(function(map, obj) {
        map[obj.address] = obj;
        return map;
      }, {});
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItem: "center",
            width: "100%",
            justifyContent: "center",
            marginBottom: 10,
            marginTop: 70
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItem: "center",
              width: "100%",
              justifyContent: "center"
            }}
          >
            <Card className={classes.card}>
              <CardContent className={classes.details}>
                <Typography
                  align={props.direction === "ltr" ? "left" : "right"}
                  variant="h5"
                >
                  Holdings
                </Typography>
                <Typography
                  align={props.direction === "ltr" ? "left" : "right"}
                  variant="h6"
                  color="textSecondary"
                >
                  Text out bla bla bla - Owing sdasd sdfsdf sdfgdsfg dfgdfg
                  dfgdfg
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItem: "center",
              width: "100%",
              justifyContent: "center"
            }}
          >
            <Card className={classes.card}>
              <Grid container spacing={0}>
                <div
                  style={{
                    overflowX: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1
                  }}
                >
                  <Grid item sm={8}>
                    <div className={classes.details}>
                      <div className={classes.controls} />
                    </div>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography
                      align={props.direction === "ltr" ? "left" : "right"}
                      variant="title"
                      color="textPrimary"
                    >
                      Status
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography
                      align={props.direction === "ltr" ? "left" : "right"}
                      variant="title"
                      color="textPrimary"
                    >
                      Volume
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography
                      align={props.direction === "ltr" ? "left" : "right"}
                      variant="title"
                      color="textPrimary"
                    >
                      Est($)
                    </Typography>
                  </Grid>
                  <Grid item sm={1} />
                </div>
              </Grid>
              {holdings.map(holding => {
                const link = `/projectsView/${holding.projectAddress}`;

                return (
                  <Grid container spacing={0}>
                    <Paper className={classes.rootGrid}>
                      <Grid item sm={8}>
                        <div className={classes.details}>
                          <CardContent className={classes.content}>
                            <Typography
                              align={
                                props.direction === "ltr" ? "left" : "right"
                              }
                              variant="h5"
                            >
                              {projectMaps[holding.projectAddress].name}
                            </Typography>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <Grid container spacing={0}>
                                <Grid item sm={4}>
                                  <CardMedia
                                    className={classes.cover}
                                    image={
                                      projectMaps[holding.projectAddress]
                                        .property.pictures[0]
                                    }
                                    title="Live from space album cover"
                                  />
                                </Grid>
                                <Grid item sm={8}>
                                  <Typography
                                    align={
                                      props.direction === "ltr"
                                        ? "left"
                                        : "right"
                                    }
                                    variant="h6"
                                    color="textSecondary"
                                  >
                                    {
                                      projectMaps[holding.projectAddress]
                                        .description
                                    }
                                  </Typography>
                                </Grid>
                              </Grid>
                            </div>
                          </CardContent>
                          <div className={classes.controls} />
                        </div>
                      </Grid>
                      <Grid item sm={2}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <ErrorOutline />
                          <div style={{ marginRight: 5, marginLeft: 5 }}>
                            <Typography
                              align={
                                props.direction === "ltr" ? "left" : "right"
                              }
                              variant="h6"
                              color="textPrimary"
                            >
                              Initial Offering
                            </Typography>
                          </div>
                        </div>
                      </Grid>
                      <Grid item sm={1}>
                        <Typography
                          align={props.direction === "ltr" ? "left" : "right"}
                          variant="h6"
                          color="textPrimary"
                        >
                          {parseInt(holding.holdings)
                            .toFixed(1)
                            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                        </Typography>
                      </Grid>
                      <Grid item sm={1}>
                        <Typography
                          align={props.direction === "ltr" ? "left" : "right"}
                          variant="h6"
                          color="textPrimary"
                        >
                          {parseInt(holding.holdings)
                            .toFixed(1)
                            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                        </Typography>
                      </Grid>
                      <Grid item sm={1}>
                        <div>
                          <Button
                            className={classes.button}
                            onClick={this.handleClickOpen.bind(this)}
                          >
                            Buy
                          </Button>
                          <Dialog
                            open={this.state.open}
                            onClose={this.handleClose.bind(this)}
                            aria-labelledby="form-dialog-title"
                          >
                            <DialogTitle id="form-dialog-title">
                              Buy
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Enter investment amount
                              </DialogContentText>
                              <form
                                className={classes.container}
                                noValidate
                                autoComplete="off"
                              >
                                <TextField
                                  label="amount"
                                  id="amount"
                                  className={classes.textField}
                                  onChange={this.handleChange("amount")}
                                  margin="normal"
                                  fullWidth
                                  type="number"
                                  value={this.state.amount}
                                />
                              </form>
                            </DialogContent>
                            <DialogActions>
                              {activeAccount.type === "EXTERNAL" ? (
                                <div
                                  style={{ borderColor: "black", border: 1 }}
                                >
                                  <SubmitOperation
                                    onSuccess={this.investExternal.bind(
                                      this,
                                      holding.projectAddress
                                    )}
                                    request={{
                                      projectId: holding.projectAddress,
                                      amount: this.state.amount,
                                      limit: 1 * config.stoneRatio
                                    }}
                                    label={"Invest"}
                                    contract={"CornerStone"}
                                    event={"BidCreated"}
                                    method={"bid"}
                                  />
                                </div>
                              ) : (
                                <Button
                                  color="primary"
                                  className={classes.button}
                                  onClick={this.invest.bind(
                                    this,
                                    holding.projectAddress
                                  )}
                                >
                                  Buy
                                </Button>
                              )}
                              <Button
                                onClick={this.handleClose.bind(this)}
                                color="primary"
                              >
                                Cancel
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>

                        <Button disabled color="textSecondary">
                          Sell
                        </Button>
                        <Button color="textSecondary">
                          <NavLink
                            style={{
                              textDecoration: "none"
                            }}
                            to={link}
                          >
                            View
                          </NavLink>
                        </Button>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          backgroundColor: "white",
          marginTop: 70
        }}
      >
        yyy
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  holdings: state.userAccounts.holdings,
  update: state.userAccounts.update,
  activeAccount: state.userAccounts.activeAccount,
  direction: state.userProfileReducer.direction,
  projects: getPopulatedProjects(state, props)
});
const mapDispatchToProps = {
  trade,
  tradeExternalRequest
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Holdings)
);
