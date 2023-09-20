import React from "react";
import PropTypes from "prop-types";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { ProjectSymbol } from "../../UI/index";
import ProjectStats from "../../UI/project/projecStats";
import { NavLink } from "react-router-dom";
import { withProject } from "../../UI/warappers/withProject";
import { connect } from "react-redux";
class ProjectPreviewDetails extends React.Component {
  render() {
    const { project } = this.props;
    if (!project) {
      return <div />;
    }
    return this.renderProjectDetails();
  }

  renderProjectDetails() {
    const { classes, project, showSecondery } = this.props;

    return (
      <div className={classes.projectDetails}>
        {this.projectHeader(classes, project)}
        {
          <ProjectStats
            showSecondery={showSecondery}
            project={project}
            t={this.props.t}
          />
        }
      </div>
    );
  }

  projectHeader(classes, project) {
    const { projectName, direction, projectDescription } = this.props;
    const projectLink = "/projectsView/" + project.address
    return (
      <CardContent className={classes.projectContent}>
        <div>
          {project.projectAggregator ? (
            project.structure === "Office" ? (
              <Typography
                align={direction === "ltr" ? "left" : "right"}
                variant="h5"
              >
                {this.props.t("officeCompound")}
              </Typography>
            ) : (
              <Typography
                align={direction === "ltr" ? "left" : "right"}
                variant="h5"
              >
                {this.props.t("AppCompound")}
              </Typography>
            )
          ) : (
            <div></div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <ProjectSymbol symbol={project.symbol} />
          <NavLink
          style={{
            textDecoration: "none",
            marginLeft: 10,
            color:'black',
            marginRight: 10,
            fontSize: 16
          }}
          
          to={projectLink}
        >
          <Typography
            align={direction === "ltr" ? "left" : "right"}
            variant="h5"
          >
            {projectName}
          </Typography>
          </NavLink>
        </div>
        {project.location && project.location.address && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant="h6"
            >
              {project.location.address}
            </Typography>
          </div>
        )}

        <div
          style={{
            display: "flex",
            textAlign: direction === "rtl" ? "right" : "left",
            fontSize: 14,
            flexDirection: "row",
            minWidth: this.props.width === "xs" ? 0 : 600,
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <div style={{ margin: 5 }}>{projectDescription}</div>
        </div>
      </CardContent>
    );
  }

  doSomething(){

  }
}
ProjectPreviewDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {};

export default withProject(
  connect(mapStateToProps, mapDispatchToProps)(ProjectPreviewDetails)
);
