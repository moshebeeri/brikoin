import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericForm } from "../../UI/index";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { assigmentReqeust } from "../../redux/actions/projects";
import Typography from "@material-ui/core/Typography";
const styles = theme => {
  return {
    textFieldClass: {
      width: 280,
      flex: 1
    }
  };
};

const PROJECT_DESCRIPTOR = {
  name: "textView-translate",
  address: "textView-translate",
  sellerLawyer: "userSelection",
  trustee: "userSelection"
};

const USER_SELECTION = {
  sellerLawyer: "LAWYER",
  trustee: "TRUSTEE"
};

class ProjectManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  assignProject(entity) {
    const project = this.getProject();

    if (entity.sellerLawyer) {
      const sellerRequest = {
        projectId: project.id,
        projectAddress: project.address,
        sellerLawyer: entity.sellerLawyer,
        assignment: "sellerLawyer"
      };
      this.props.assigmentReqeust(sellerRequest);
    }

    if (entity.trustee) {
      const trusteeRequest = {
        projectId: project.id,
        projectAddress: project.address,
        trustee: entity.trustee,
        assignment: "trustee"
      };
      this.props.assigmentReqeust(trusteeRequest);
    }
    this.props.history.goBack();
  }

  getProject() {
    const { projects, direction } = this.props;

    const projectId = this.props.location.pathname.substring(15)
      ? this.props.location.pathname.substring(15)
      : "";

    const project = projects
      ? projects.filter(project => project.id === projectId)
      : "";
    if (project.length > 0) {
      return project[0];
    }
    return "";
  }
  render() {
    const { classes } = this.props;
    const project = this.getProject();
    return (
      <div
        style={{
          marginTop: "10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <Typography
            className={classes.textFieldClass}
            align={direction === "ltr" ? "left" : "right"}
            variant="h5"
          >
            {this.props.t("Manage Project")}
          </Typography>
          {/* <ProjectNew history={this.props.history} lang={lang} t={this.props.t} init={topAsks} user={user} */}
          {/* project={project} */}
          {/* />) */}
          <GenericForm
            selectionFilter={USER_SELECTION}
            buttonTitle={"update"}
            entity={project || {}}
            t={this.props.t}
            entityDescriptor={PROJECT_DESCRIPTOR}
            save={this.assignProject.bind(this)}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
}

ProjectManagement.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  publicUsers: state.userAccounts.publicUUsers,
  roles: state.userRoles.rolesRequests,
  direction: state.userProfileReducer.direction,
  projects: getPopulatedProjects(state, props)
});
const mapDispatchToProps = {
  assigmentReqeust
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ProjectManagement)
);
