import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Project from "../../components/projects/ProjectNew";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
const styles = theme => {
  return {
    card: {
      display: "flex",
      boxShadow: "none",
      width: "100%",
      minWidth: 1000,
      maxWidth: 1000,
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    }
  };
};

export function withProjectHeader(WrappedComponent) {
  class ProjectHeader extends React.PureComponent {
    render() {
      const { projects, lang } = this.props;
      if (!projects || projects.length === 0) {
        return <div />;
      }
      const projectAddress = this.props.location.pathname.substring(
        this.props.location.pathname.lastIndexOf("/") + 1
      );
      const project = projects.filter(
        project => project.address === projectAddress
      );
      if (project.length === 0) {
        return <div />;
      }
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
          {project && (
            <Project
              history={this.props.history}
              lang={lang}
              t={this.props.t}
              init
              viewOnly
              project={project[0]}
            />
          )}
          <WrappedComponent project={project[0]} {...this.props} />
        </div>
      );
    }
  }
  ProjectHeader.propTypes = {
    classes: PropTypes.object.isRequired
  };

  const mapStateToProps = (state, props) => ({
    projects: getPopulatedProjects(state, props),
    lang: state.userProfileReducer.lang
  });

  const mapDispatchToProps = {};

  return withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(ProjectHeader)
  );
}
