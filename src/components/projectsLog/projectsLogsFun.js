import React, { useEffect, useReducer, useState } from "react";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { listenForProjects } from "./projectsLogsUtils";
import { connect } from "react-redux";

function ProjectsLogs(props) {
  const [projects, setProjects] = useState({});
  listenForProjects(setProjects);
  if (projects && projects.length > 0) {
    return <div></div>; //<div>{JSON.stringify(toJsonSchema(projects[0]))}</div>
  }
  return <div></div>;
}

const mapStateToProps = state => ({
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(ProjectsLogs)
);
