import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import { addMortgageCondition } from "../../redux/actions/mortgage";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import { getAllProject } from "../../redux/selectors/projectsSelector";

const styles = theme => {
  return {
    button: {
      margin: theme.spacing.unit
    },
    input: {
      display: "none"
    },
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    formControl: {
      margin: theme.spacing.unit * 3
    },
    group: {
      margin: `${theme.spacing.unit}px 0`
    },
    menu: {
      width: 200
    },
    card: {
      maxWidth: 275,
      marginTop: "10%"
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
    }
  };
};

class MortgageConditionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  selectProject(event) {
    let projectId = event.target.value;
    this.setState({
      projectId: projectId
    });
  }

  saveCondition() {
    const { activeAccount } = this.props;
    const { ARM3, ARM5, ARM7, ARM10, FIXED10, FIXED15 } = this.state;
    let mortgageCondition = {
      project: this.state.projectId,
      ARM3: !!ARM3,
      ARM5: !!ARM5,
      ARM7: !!ARM7,
      ARM10: !!ARM10,
      FIXED10: !!FIXED10,
      FIXED15: !!FIXED15,
      maxYears: this.state.maxYears,
      downPayment: this.state.downPayment,
      maxMortgage: this.state.maxMortgage,
      interestRateFixed: this.state.interestRateFixed,
      interestRateArm: this.state.interestRateArm,
      userAccount: activeAccount.accountId,
      user: this.props.user.uid
    };
    this.props.addMortgageCondition(mortgageCondition, this.props.user);
  }

  render() {
    const { ARM3, ARM5, ARM7, ARM10, FIXED10, FIXED15 } = this.state;
    const { classes, projects } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "center"
        }}
      >
        <Card className={classes.card}>
          <h3>Mortgage Conditions</h3>
          <CardContent>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                style={{
                  alignItems: "center",
                  flexDirection: "col",
                  justifyContent: "center"
                }}
              >
                {projects && Object.keys(projects).length > 0 && (
                  <FormControl className={classes.textField}>
                    {!this.state.projectId && (
                      <InputLabel htmlFor="age-simple">
                        Choose Projects
                      </InputLabel>
                    )}
                    <Select
                      value={this.state.projectId}
                      onChange={this.selectProject.bind(this)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {projects.map(project => (
                        <MenuItem value={project.address}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <div style={{ flex: 1 }}>
                  <TextField
                    label="DownPayment"
                    id="downPayment"
                    className={classes.textField}
                    onChange={this.handleChange("downPayment")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Interest rate Arm"
                    id="interestRateArm"
                    className={classes.textField}
                    onChange={this.handleChange("interestRateArm")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>{" "}
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Interest rate Fixed"
                    id="interestRateFixed"
                    className={classes.textField}
                    onChange={this.handleChange("interestRateFixed")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Project mortgage budget"
                    id="maxMortgage"
                    className={classes.textField}
                    onChange={this.handleChange("maxMortgage")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Max number of years"
                    id="maxYears"
                    className={classes.textField}
                    onChange={this.handleChange("maxYears")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormLabel component="legend">Mortgage type</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ARM3}
                            onChange={this.handleChange("ARM3")}
                            value="ARM3"
                          />
                        }
                        label="3/1 ARM"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ARM5}
                            onChange={this.handleChange("ARM5")}
                            value="ARM5"
                          />
                        }
                        label="5/1 ARM"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ARM7}
                            onChange={this.handleChange("ARM7")}
                            value="ARM7"
                          />
                        }
                        label="7/1 ARM"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ARM10}
                            onChange={this.handleChange("ARM10")}
                            value="ARM10"
                          />
                        }
                        label="10/1 ARM"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={FIXED10}
                            onChange={this.handleChange("FIXED10")}
                            value="FIXED10"
                          />
                        }
                        label="10 year fixed"
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={FIXED15}
                            onChange={this.handleChange("FIXED15")}
                            value="FIXED15"
                          />
                        }
                        label="15 year fixed"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={FIXED15}
                            onChange={this.handleChange("FIXED20")}
                            value="FIXED20"
                          />
                        }
                        label="20 year fixed"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
                <label htmlFor="outlined-button-file">
                  <Button
                    variant="outlined"
                    onClick={this.saveCondition.bind(this)}
                    component="span"
                    className={classes.button}
                  >
                    Add Condition
                  </Button>
                </label>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

MortgageConditionForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  projects: getAllProject(state, props)
});

const mapDispatchToProps = {
  addMortgageCondition
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MortgageConditionForm)
);
