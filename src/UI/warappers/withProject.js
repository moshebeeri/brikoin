import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import { withCusomeStyle } from "./withCusomeStyle";
import {
  initProjectStats,
  listenForProjects,
  listenProject
} from "../../redux/actions/trade";
export function withProject(WrappedComponent) {
  class ProjectData extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { orders: [] };
    }
    render() {
      const { lang, direction } = this.props;
      const project = this.getProject();
      const projectName =
        lang !== "En" && project.lang && project.lang[lang]
          ? project.lang[lang].name
          : project.name;
      const projectDescription =
        lang !== "En" && project.lang && project.lang[lang]
          ? project.lang[lang].description
          : project.description;
      if (!project.address) {
        return <div></div>;
      }
      return (
        <WrappedComponent
          direction={direction}
          lang={lang}
          projectName={projectName}
          projectDescription={projectDescription}
          project={project}
          {...this.props}
        />
      );
    }

    componentDidMount() {
      const { projects } = this.props;
      if (!projects || projects.length === 0) {
        this.props.listenForProjects();
      }
    }

    getProject() {
      const { projects, project, address } = this.props;
      if (project) {
        return project;
      }
      if (!projects || projects.length === 0) {
        return {};
      }
      const projectAddress = address
        ? address
        : this.props.location.pathname.substring(
            this.props.location.pathname.lastIndexOf("/") + 1
          );
      const filteredProjects = projects.filter(
        project => project.address === projectAddress
      );
      if (filteredProjects.length === 0) {
        return {};
      }
      return filteredProjects[0];
    }
  }

  const mapStateToProps = (state, props) => ({
    projects: getAllProject(state, props),
    change: state.trades.change,
    user: state.login.user,
    lang: state.userProfileReducer.lang,
    direction: state.userProfileReducer.direction
  });

  const mapDispatchToProps = {
    listenForProjects,
    initProjectStats,
    listenProject
  };

  return withRouter(
    withCusomeStyle(connect(mapStateToProps, mapDispatchToProps)(ProjectData))
  );
}
