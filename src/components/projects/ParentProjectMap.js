import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import withWidth from "@material-ui/core/withWidth";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import Gallery from "react-grid-gallery";
function ParentProjectMap(props) {
  if (!props.project) {
    return <div></div>;
  }
  if (props.project.type !== "parentProject") {
    return <div></div>;
  }
  return (
    <div style={{ width: props.width === "xs" ? 200 : 800 }}>
      {props.project.subProjects.map && (
        <Gallery
        rowHeight={props.width === "xs"  ? 200 : 700}
        maxRows={2}
        images={[
          {
            src: props.project.subProjects.map,
            thumbnail: props.project.subProjects.map,
            thumbnailHeight: 9
          }
        ]}
      />
        
      )}

      
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {};
export default withWidth()(
  withCusomeStyle(
    connect(mapStateToProps, mapDispatchToProps)(ParentProjectMap)
  )
);
