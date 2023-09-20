import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ProjectNew from "./ProjectNew";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { withRouter } from "react-router-dom";
import withWidth from "@material-ui/core/withWidth";
import { pageViewd } from "../../utils/tracker";
import { initUserProjectStats } from "../../redux/actions/trade";
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});
import LoadingCircular from "../../UI/loading/LoadingCircular";
function Projects(props){
    const { classes, lang, projects, user, direction } = props;
    if (projects && projects.length > 0) {
      const projectList = projects.map((project, index) => (
        <ProjectNew
          key={index + "-project"}
          history={props.history}
          lang={lang}
          t={props.t}
          user={user}
          project={project}
          subProjects={[]}
          direction={direction}
        />
      ));
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            marginTop: props.width === "xs" ? "6%" : "3%",
            backgroundColor: "white"
          }}
        >
          {projectList}
        </div>
      );
    }
    return (
      <div style={{ width: "100%", marginTop: "10%", minHeight: 500 }}>
        <LoadingCircular open className={classes.progress} />
      </div>
    );
}


Projects.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  accountInit: state.userAccounts.accountInit,
  activeAccount: state.userAccounts.activeAccount,
  user: state.login.user,
  lang: state.userProfileReducer.lang,
  init: state.trades.init,
  direction: state.userProfileReducer.direction,
  errorMessage: state.login.errorMessage
});

const mapDispatchToProps = {};
export default withRouter(
  withWidth()(
    withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Projects))
  )
);
