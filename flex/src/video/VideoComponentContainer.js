import React, { Component } from "react";
import { Card, CardText } from "material-ui/Card";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import VideoComponent from "./VideoComponent";

class VideoComponentContainer extends Component {
  render() {
    /*
         Controls showing of the local track
         Only show video track after user has joined a room else show nothing
        */
    return (
      <MuiThemeProvider>
        {/*<h1>Video Placeholder</h1>*/}
        <VideoComponent />
      </MuiThemeProvider>
    );
  }
}

export default VideoComponentContainer;
