import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericForm } from "../../UI/index";
import Project from "../projects/ProjectNew";
import { saveCase, listenCases } from "../../redux/actions/case";
import Typography from "@material-ui/core/Typography";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
const styles = theme => {
  return {};
};

const CASE_DESCRIPTOR = {
  documentOne: "fileUpload",
  documentTwo: "fileUpload",
  signature: "signature",
  // idPicture: 'webCap',
  documentThree: "fileUpload"
};

class Case extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  saveCase(entity) {
    const { user } = this.props;
    this.props.saveCase(user, entity);
    this.props.history.goBack();
  }

  render() {
    const { cases, loaded, projects, lang, direction } = this.props;
    if (!loaded) {
      return <div />;
    }
    const caseId = this.props.location.pathname.substring(10)
      ? this.props.location.pathname.substring(10)
      : "";
    const caseView = cases.filter(currentCase => currentCase.id === caseId);
    const project =
      caseView && caseView.length === 1
        ? projects.filter(project => project.id === caseView[0].projectId)[0]
        : "";
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
        <div style={{ width: 800 }}>
          <Typography
            align={direction === "ltr" ? "left" : "right"}
            variant="h4"
          >
            {this.props.t("ManageProject")}
          </Typography>
        </div>

        {project && (
          <Project
            history={this.props.history}
            lang={lang}
            t={this.props.t}
            init
            viewOnly
            project={project}
          />
        )}
        {caseView && caseView.length === 1 && (
          <div style={{ marginTop: 30 }}>
            {" "}
            <GenericForm
              entity={caseView[0]}
              t={this.props.t}
              entityDescriptor={CASE_DESCRIPTOR}
              save={this.saveCase.bind(this)}
            />
          </div>
        )}
      </div>
    );
  }

  componentDidUpdate() {
    const { user, loaded, listenCases } = this.props;
    if (user && !loaded) {
      listenCases(user);
    }
  }

  componentDidMount() {
    const { user, loaded, listenCases } = this.props;
    if (user && !loaded) {
      listenCases(user);
    }
  }
}

Case.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  projects: getPopulatedProjects(state, props),
  cases: state.cases.list,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang,
  loaded: state.cases.loaded
});
const mapDispatchToProps = {
  saveCase,
  listenCases
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Case)
);
