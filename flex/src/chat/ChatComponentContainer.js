import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatComponent from "./twillioChat";

class ChatComponentContainer extends Component {
  render() {
    /*
         Controls showing of the local track
         Only show video track after user has joined a room else show nothing
        */
    return (
      <MuiThemeProvider>
        <ChatComponent />
      </MuiThemeProvider>
    );
  }
}

export default ChatComponentContainer;
