import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Project from "./ProjectNew";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { selectLanguage } from "../../redux/actions/userProfile";
import i18next from "i18next";
const styles = theme => {
  return {};
};

class SingleProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { projects, lang } = this.props;
    // const locale = lang === 'En' ? 'en' : 'he-il'
    const projectAddress = this.props.location.pathname.substring(15)
      ? this.props.location.pathname.substring(15)
      : "";
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";

    if (project) {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Project
            lang={lang}
            init
            project={project}
            t={this.props.t}
            history={this.props.history}
          />
        </div>
      );
    } else {
      return <div />;
    }
  }

  componentDidMount() {
    const { selectLanguage, location } = this.props;

    const externalLang =
      location.search && location.search.includes("He") ? "He" : "En";
    window.scrollTo(0, 0);
    if (externalLang) {
      if (externalLang === "He") {
        selectLanguage(externalLang, "rtl");
        i18next.changeLanguage("il");
      } else {
        selectLanguage(externalLang, "ltr");
        i18next.changeLanguage("en");
      }
    }
  }
}

SingleProjectView.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  lang: state.userProfileReducer.lang,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  selectLanguage
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SingleProjectView)
);
