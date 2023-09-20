import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import EstimationForm from "../estimation/EstimationForm";
import ManagerForm from "../manager/ManagerForm";
import PropertyForm from "../property/PropertyForm";
import TrusteeForm from "../trustee/TrusteeForm";
import RegistrarForm from "../registrar/RegistrarForm";
import TermsForm from "../terms/TermsForm";
import ProjectForm from "../projects/ProjectForm";
import Developer from "../developer/developer";
import { connect } from "react-redux";
import { getRegistrars } from "../../redux/actions/registrars";
import { selectProject } from "../../redux/actions/admin";
import { getTrustees } from "../../redux/actions/trustees";
import { getManagers } from "../../redux/actions/managers";
import { getEstimations } from "../../redux/actions/estimations";
import { getProperties } from "../../redux/actions/properties";
import { getTerms } from "../../redux/actions/terms";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";

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

class Admin extends React.Component {
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
    const { classes, selectedProject, projects } = this.props;
    return (
      <div className={classes.root}>
        <Developer />
        <Grid container spacing={24}>
          <Grid item xs={5} sm={6} key="EstimationForm">
            <Paper className={classes.paper}>
              <EstimationForm />
            </Paper>
          </Grid>
          <Grid item xs={5} sm={6} key="ManagerForm">
            <Paper className={classes.paper}>
              <ManagerForm />
            </Paper>
          </Grid>
          <Grid item xs={5} sm={6} key="PropertyForm">
            <Paper className={classes.paper}>
              <PropertyForm />
            </Paper>
          </Grid>
          <Grid item xs={5} sm={6} key="TrusteeForm">
            <Paper className={classes.paper}>
              <TrusteeForm />
            </Paper>
          </Grid>
          <Grid item xs={5} sm={6} key="RegistrarForm">
            <Paper className={classes.paper}>
              <RegistrarForm />
            </Paper>
          </Grid>
          <Grid item xs={5} sm={6} key="TermsForm">
            <Paper className={classes.paper}>
              <TermsForm />
            </Paper>
          </Grid>
          <Grid item xs={5} sm={12} key="ProjectForm">
            <Paper className={classes.paper}>
              <h3>Create Project</h3>
              <ProjectForm />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  selectedProject: state.admin.selectedProject,
  projects: getPopulatedProjects(state, props)
});

const mapDispatchToProps = {
  getRegistrars,
  getTrustees,
  getManagers,
  getEstimations,
  getProperties,
  getTerms,
  selectProject
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Admin)
);
