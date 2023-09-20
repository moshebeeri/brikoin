import React, { useEffect, useReducer, useState } from "react";
import Grid from "@material-ui/core/Grid";
import withWidth from "@material-ui/core/withWidth";
import ProjectFeature from "../generics/GenericProjectFeature";
import { connect } from "react-redux";

function ProjectStats(props) {
  const { project } = props;
  return (
    <div
      dir={props.direction}
      style={{
        width: "80%",
        marginBottom: 10,
        marginRight: 25,
        marginLeft: 25
      }}
    >
      <Grid container spacing={16}>
        {project.features
          ? Object.keys(project.features).map(key => (
              <ProjectFeature
                project={project}
                t={props.t}
                featureKey={key}
                value={project.features[key]}
              />
            ))
          : []}
      </Grid>
      <Grid container spacing={16}>
        {props.showSecondery && project.secondFeatures
          ? Object.keys(project.secondFeatures)
              .sort(function(a, b) {
                if (
                  project.secondFeatures[a].order <
                  project.secondFeatures[b].order
                )
                  return -1;
                if (
                  project.secondFeatures[a].order >
                  project.secondFeatures[b].order
                )
                  return 1;
                return 0;
              })
              .map(key => (
                <ProjectFeature
                  project={project}
                  t={props.t}
                  featureKey={key}
                  value={project.secondFeatures[key]}
                />
              ))
          : []}
      </Grid>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {};
export default withWidth()(
  connect(mapStateToProps, mapDispatchToProps)(ProjectStats)
);
