import React from "react";
import * as FlexWebChat from "@twilio/flex-webchat-ui";

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    FlexWebChat.Manager.create({
      //  change the your AccountSid
      accountSid: "AC0469374b97845e2957fc5ef05ed7e6d7"
      // change to your Flex Flow SID
      // flexFlowSid: 'FW352033a3290e98c040531d86be706988'
    })
      .then(manager => this.setState({ manager }))
      .catch(error => this.setState({ error }));
  }

  render() {
    const { manager, error } = this.state;
    if (manager) {
      return (
        <FlexWebChat.ContextProvider manager={manager}>
          <FlexWebChat.RootContainer />
        </FlexWebChat.ContextProvider>
      );
    }

    if (error) {
      console.error("Failed to initialize Flex Web Chat", error);
    }

    return null;
  }
}

export default ChatBox;
