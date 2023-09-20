import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { payYield } from "../../redux/actions/trade";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Collapse } from "react-collapse";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import MdExpandMore from '@material-ui/icons/ExpandMore';
import MdExpandLess from '@material-ui/icons/ExpandLess';

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

class PayYield extends React.Component {
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

  payYield() {
    const { payYield } = this.props;
    payYield(this.state.projectId, this.state.yield);
  }

  getProjectName(projectAddress) {
    const { projects } = this.props;
    return projects.filter(project => project.address === projectAddress)[0]
      .name;
  }

  selectProject(event) {
    this.setState({
      projectId: event.target.value
    });
  }

  render() {
    const { classes, projects } = this.props;
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
            <div>Pay Property Yield</div>
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
            <div>Pay Property Yield</div>
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
                  label="yield"
                  id="yield"
                  className={classes.textField}
                  onChange={this.handleChange("yield")}
                  margin="normal"
                  fullWidth
                  type="number"
                  value={this.state.yield}
                />
                <Button color={"primary"} onClick={this.payYield.bind(this)}>
                  PayYield
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
  activeAccount: state.userAccounts.activeAccount
});

const mapDispatchToProps = {
  payYield
};
PayYield.contextTypes = {
  drizzle: PropTypes.object
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PayYield)
);
