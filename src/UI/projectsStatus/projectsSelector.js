import React from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { selectProjectsView } from "../../redux/actions/userProfile";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import Switch from '@material-ui/core/Switch';
function ProjectSelector(props) {
  const { projectsView, classes } = props;
  return (
    <div style={{ display: "flex",margin: 5, flexDirection: "row" }}>
      <div
        style={{
          display: "flex",
          width: 200,
          justifyContent: "flex-start",
          alignItems: "center"
        }}>
        {projectsView === "Real" ? props.t("Assets Status Real") : props.t("Assets Status Playgorund")}
      </div>
      <Switch
      checked={projectsView === "Real"}
      onChange={setProjectView.bind(this, props, projectsView)}
      color="primary"
      name="checkedB"
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    
    </div>
  );
}

function setProjectView(props) {
  const { projectsView, selectProjectsView } = props;
  if (projectsView === "Real") {
    selectProjectsView("PlayGround");
  } else {
    selectProjectsView("Real");
  }
}

const mapStateToProps = state => {
  return {
    projectsView: state.userProfileReducer.projectsView
  };
};
const mapDispatchToProps = {
  selectProjectsView
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(ProjectSelector)
);
