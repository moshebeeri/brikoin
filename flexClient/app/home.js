import React from "react";
import PropTypes from "prop-types";
import VideoComponent from "./VideoComponent";
import TwillioChat from "./twillioChat";
import AppBar from "material-ui/AppBar";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { role: "" };
  }

  componentDidUpdate() {}

  selectRole(role) {
    this.setState({
      role: role
    });
  }

  render() {
    return (
      <div>
        <AppBar
          style={{ backgroundColor: "#3F7BD8" }}
          title="Bank Leumi Twilio Video"
        />
        <VideoComponent role={this.state.role} />
        <TwillioChat />
        {/* <ChatBox/> */}
      </div>
    );
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
};

export default Home;
