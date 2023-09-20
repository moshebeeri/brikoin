import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MortgageForm from "./mortgageForm";
import MortgageeForm from "./mortgageeForm";
import MortgageLogo from "./mortgageeLogo";
import MortgageConditionForm from "./mortgageConditionForm";
import { connect } from "react-redux";

const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: "center",
      color: theme.palette.text.secondary
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    control: {
      padding: theme.spacing.unit * 2
    }
  };
};

class Mortgage extends React.Component {
  state = {
    spacing: "16",
    project: ""
  };

  handleChange = key => (event, value) => {
    this.setState({
      [key]: event.target.value
    });
  };

  selectProject(event) {
    const { projects } = this.props;
    const selectedProject = projects.filter(
      project => project.id === event.target.value
    );
    if (selectedProject.length > 0) {
      this.props.selectProject(selectedProject[0]);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          {/*<Grid item xs={5} sm={6} key='MorgadeForm'>*/}
          {/*<Paper className={classes.paper}><MortgageForm /></Paper>*/}
          {/*</Grid>*/}
          <Grid item xs={5} sm={6} key="MorgadeForm">
            <Paper className={classes.paper}>
              <MortgageeForm />
            </Paper>
          </Grid>
          <Grid item xs={5} sm={6} key="MorgadeForm">
            <Paper className={classes.paper}>
              <MortgageLogo />
            </Paper>
          </Grid>

          <Grid item xs={5} sm={6} key="MorgadeForm">
            <Paper className={classes.paper}>
              <MortgageConditionForm />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Mortgage.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user
});

const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Mortgage)
);
