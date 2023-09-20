import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import {
  getMortgagesRequests,
  paySchedulePayment,
  clearMortgage
} from "../../redux/actions/mortgage";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Collapse } from "react-collapse";
import MdExpandMore from '@material-ui/icons/ExpandMore';
import MdExpandLess from '@material-ui/icons/ExpandLess';
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { getMortgagesNextPayment } from "../../redux/selectors/mortgaegsSelector";

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

class PayMortgage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      initial: false
    };
  }

  omponentWillMount() {
    const { mortgageRequests } = this.props;
    if (Object.keys(mortgageRequests).length === 0) {
      this.props.getMortgagesRequests();
    }
  }

  componentDidUpdate() {
    const { mortgageRequests } = this.props;
    if (Object.keys(mortgageRequests).length === 0) {
      this.props.getMortgagesRequests();
    }
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

  payPayment() {
    const {
      user,
      paySchedulePayment,
      mortgageRequests,
      projectMortgagesPayments
    } = this.props;
    if (this.state.mortgageId) {
      const selectedMortgage = mortgageRequests[this.state.projectId].filter(
        mortgageRequest => mortgageRequest.key === this.state.mortgageId
      );
      if (selectedMortgage.length > 0) {
        paySchedulePayment(
          {
            mortgageRequestKey: this.state.mortgageId,
            mortgageConditionId: selectedMortgage[0].mortgageId,
            mortgageAddress: selectedMortgage[0].mortgageAddress,
            active: true,
            paymentId: projectMortgagesPayments[this.state.mortgageId].id,
            userId: user.uid,
            project: this.state.projectId
          },
          user
        );
      }
    }
  }

  payMortgage() {
    const { user, userMortgage, clearMortgage, mortgageRequests } = this.props;
    const selectedMortgage =
      this.state.projectId && userMortgage && userMortgage.length > 0
        ? userMortgage.filter(
            mortgage => mortgage.projectId === this.state.projectId
          )
        : [];
    if (selectedMortgage.length > 0) {
      clearMortgage(
        {
          mortgageId: selectedMortgage[0].id,
          mortgageAddress: selectedMortgage[0].mortgageAddress,
          active: true,
          userId: user.uid,
          project: this.state.projectId
        },
        user
      );
    }
  }

  selectProject(event) {
    this.setState({
      projectId: event.target.value
    });
  }
  selectMortgageRequest(event) {
    this.setState({
      mortgageId: event.target.value
    });
  }

  render() {
    const {
      classes,
      projects,
      mortgageRequests,
      projectMortgagesPayments
    } = this.props;

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
            <div>Pay Mortgage</div>
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
            <div>Pay Mortgage</div>
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
                {this.state.projectId &&
                  mortgageRequests[this.state.projectId] &&
                  mortgageRequests[this.state.projectId].length > 0 && (
                    <div style={{ flex: 1, backgroundColor: "white" }}>
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="age-simple">
                          Choose Mortgage
                        </InputLabel>
                        <Select
                          value={this.state.mortgageId || "None"}
                          onChange={this.selectMortgageRequest.bind(this)}
                        >
                          <MenuItem value="None">
                            <em>None</em>
                          </MenuItem>
                          {mortgageRequests[this.state.projectId].map(
                            mortgage => (
                              <MenuItem key={mortgage.key} value={mortgage.key}>
                                {mortgage.mortgageAddress}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </div>
                  )}
                {this.state.mortgageId &&
                  projectMortgagesPayments[this.state.mortgageId] && (
                    <div style={{ flex: 1, backgroundColor: "white" }}>
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="age-simple">
                          Choose Payment
                        </InputLabel>
                        <Select
                          value={
                            projectMortgagesPayments[this.state.mortgageId]
                              .id || "None"
                          }
                        >
                          <MenuItem value="None">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem
                            key={
                              projectMortgagesPayments[this.state.mortgageId].id
                            }
                            value={
                              projectMortgagesPayments[this.state.mortgageId].id
                            }
                          >
                            {
                              projectMortgagesPayments[this.state.mortgageId]
                                .scheduledMonthlyPayment
                            }
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  )}

                <Button color={"primary"} onClick={this.payPayment.bind(this)}>
                  Pay
                </Button>
                <Button color={"primary"} onClick={this.payMortgage.bind(this)}>
                  Return Mortgage
                </Button>
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
  mortgageRequests: state.mortgage.mortgageRequests,
  projectMortgagesPayments: getMortgagesNextPayment(state, props),
  activeAccount: state.userAccounts.activeAccount
});

const mapDispatchToProps = {
  getMortgagesRequests,
  paySchedulePayment,
  clearMortgage
};
PayMortgage.contextTypes = {
  drizzle: PropTypes.object
};


export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(PayMortgage))