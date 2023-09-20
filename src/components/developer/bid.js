import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { trade, tradeExternalRequest } from "../../redux/actions/trade";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { SubmitOperation } from "../../UI/index";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Collapse } from "react-collapse";
import MdExpandMore from '@material-ui/icons/ExpandMore';
import MdExpandLess from '@material-ui/icons/ExpandLess';

import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { config } from "../../conf/config";
const styles = theme => ({
  card: {
    maxWidth: 400
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
  }
});

class BidAsk extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      initial: false
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  openCollapse() {
    this.setState({ open: true });
  }

  closeCollapse() {
    this.setState({ open: false });
  }

  bid() {
    const { trade, activeAccount } = this.props;
    let bid = {
      name: this.getProjectName(this.state.projectId),
      price: this.state.price,
      projectId: this.state.projectId,
      side: "bid",
      userAccount: activeAccount.accountId,
      size: this.state.amount,
      state: this.state.initial ? "initial" : "trading",
      time: new Date().getTime(),
      user: this.props.user.uid,
      status: "pending"
    };
    trade(bid, "bid");
  }

  getProjectName(projectAddress) {
    const { projects } = this.props;
    return projects.filter(project => project.address === projectAddress)[0]
      .name;
  }

  sak() {
    const { trade, activeAccount } = this.props;
    let ask = {
      name: this.getProjectName(this.state.projectId),
      price: this.state.price,
      projectId: this.state.projectId,
      side: "ask",
      size: this.state.amount,
      userAccount: activeAccount.accountId,
      state: "trading",
      time: new Date().getTime(),
      user: this.props.user.uid
    };
    trade(ask, "ask");
  }
  onCheckbox(event) {
    this.setState({ initial: event.target.checked });
  }

  selectProject(event) {
    this.setState({
      projectId: event.target.value
    });
  }

  bidExternal(request, stackId) {
    const { tradeExternalRequest, activeAccount } = this.props;
    let bid = {
      name: this.getProjectName(this.state.projectId),
      price: request.limit,
      projectId: this.state.projectId,
      side: "bid",
      userAccount: activeAccount.accountId,
      size: request.amount,
      state: this.state.initial ? "initial" : "trading",
      time: new Date().getTime(),
      user: this.props.user.uid,
      status: "pending"
    };
    tradeExternalRequest(bid, activeAccount, stackId);
  }

  askExternal(request, stackId) {
    const { tradeExternalRequest, activeAccount } = this.props;
    let ask = {
      name: this.getProjectName(this.state.projectId),
      price: request.price,
      projectId: this.state.projectId,
      side: "ask",
      userAccount: activeAccount.accountId,
      size: request.amount,
      state: this.state.initial ? "initial" : "trading",
      time: new Date().getTime(),
      user: this.props.user.uid,
      status: "pending"
    };
    tradeExternalRequest(ask, activeAccount, stackId);
  }

  render() {
    const { classes, projects, activeAccount } = this.props;
    return (
      <div>
        {this.state.open ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div>Bid/Ask</div>
            <Button color={"primary"} onClick={this.closeCollapse.bind(this)}>
              <MdExpandMore />
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div>Bid/Ask</div>
            <Button color={"primary"} onClick={this.openCollapse.bind(this)}>
              <MdExpandLess />
            </Button>
          </div>
        )}

        <Collapse isOpened={this.state.open}>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                width: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  width: 100,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {projects && (
                  <div style={{ flex: 1, backgroundColor: "white" }}>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="age-simple">
                        Choose Projects
                      </InputLabel>
                      <Select
                        value={this.state.projectId || "None"}
                        onChange={this.selectProject.bind(this)}
                      >
                        <MenuItem value="None">
                          <em>None</em>
                        </MenuItem>
                        {projects.map(project => (
                          <MenuItem
                            key={project.address}
                            value={project.address}
                          >
                            {project.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
                <TextField
                  label="limit"
                  id="price"
                  className={classes.textField}
                  onChange={this.handleChange("price")}
                  margin="normal"
                  fullWidth
                  type="number"
                  value={this.state.price}
                />
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
                {activeAccount.type === "EXTERNAL" ? (
                  <SubmitOperation
                    onSuccess={this.bidExternal.bind(this)}
                    request={{
                      projectId: this.state.projectId,
                      amount: this.state.amount,
                      limit: this.state.price * config.stoneRatio
                    }}
                    label={"Bid"}
                    contract={"CornerStone"}
                    event={"BidCreated"}
                    method={"bid"}
                  />
                ) : (
                  <Button color={"primary"} onClick={this.bid.bind(this)}>
                    Bid
                  </Button>
                )}

                {activeAccount.type === "EXTERNAL" ? (
                  <SubmitOperation
                    onSuccess={this.askExternal.bind(this)}
                    request={{
                      projectId: this.state.projectId,
                      amount: this.state.amount,
                      limit: this.state.price * config.stoneRatio
                    }}
                    label={"ask"}
                    contract={"CornerStone"}
                    event={"BidCreated"}
                    method={"ask"}
                  />
                ) : (
                  <Button color={"primary"} onClick={this.sak.bind(this)}>
                    Ask
                  </Button>
                )}

                {activeAccount.type === "EXTERNAL" && (
                  <SubmitOperation
                    request={{ projectId: this.state.projectId }}
                    label={"BID Cancel"}
                    contract={"CornerStone"}
                    method={"bidCancel"}
                  />
                )}
                {activeAccount.type === "EXTERNAL" && (
                  <SubmitOperation
                    request={{ projectId: this.state.projectId }}
                    label={"Ask Cancel"}
                    contract={"CornerStone"}
                    method={"askCancel"}
                  />
                )}
              </div>
            </div>
          </form>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  accounts: state.accounts,
  selectedProject: state.admin.selectedProject,
  projects: getPopulatedProjects(state, props),
  activeAccount: state.userAccounts.activeAccount
});

const mapDispatchToProps = {
  trade,
  tradeExternalRequest
};
BidAsk.contextTypes = {
  drizzle: PropTypes.object
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(BidAsk)
);
