import React, { Component } from "react";
import { connect } from "react-redux";
import { createChatToken } from "../redux/actions/video";
import Messages from "./messages";
import Input from "./input";
import Paper from "@material-ui/core/Paper";
import VideoComponent from "../video/VideoComponent";
import { withStyles } from "@material-ui/core/styles";
const Chat = require("twilio-chat");
const styles = theme => ({
  root: {
    margin: 20,
    padding: 5,
    width: 250
  }
});
class TwilioChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      username: "בנקאי",
      creating: false,
      joined: "",
      chanelName: "general Chanel" + new Date().getTime()
    };
  }

  async createChatClient() {
    const { chatToken, chatChannel } = this.props;
    console.log("Creating Chat Client");
    if (chatToken && chatChannel) {
      this.setState({ creating: true });
      console.log(chatToken);
      let client = await Chat.Client.create(chatToken);
      console.log("CLIENT CREATED");
      this.setState({ client: client });
      let chanel = await this.joinGeneralChannel(client);
      await this.configureChannelEvents(chanel);
    }
  }

  render() {
    const { classes, chatType } = this.props;
    const { messages } = this.state;
    return (
      <div>
        {chatType === "video" ? (
          <VideoComponent
            chatType={chatType}
            externalRoom={this.props.chatChannel}
          />
        ) : (
          <Paper className={classes.root} elevation={1}>
            {messages && <Messages messages={messages} />}
            <Input onSendMessage={this.handleNewMessage.bind(this)} />
          </Paper>
        )}
      </div>
    );
  }

  componentDidUpdate() {
    const { createChatToken, change, chatToken } = this.props;
    if (!chatToken) {
      createChatToken(this.state.username);
    }
    if (chatToken && !this.state.creating) {
      this.createChatClient();
    }
  }

  componentDidMount() {
    const { createChatToken } = this.props;
    const { userName } = this.state;
    console.log(userName);

    createChatToken(userName);
  }

  joinGeneralChannel(chatClient) {
    return new Promise((resolve, reject) => {
      chatClient
        .getSubscribedChannels()
        .then(() => {
          if (!this.props.chatChannel) {
            return;
          }
          chatClient
            .getChannelByUniqueName(this.props.chatChannel)
            .then(channel => {
              this.addMessage({ body: "Joining general channel..." });
              console.log("Joining general channel... ");
              this.setState({ channel: channel });

              channel
                .join()
                .then(() => {
                  this.addMessage({
                    body: `Joined general channel as ${this.state.username}`
                  });
                  console.log(
                    `Joined general channel as ${this.state.username}`
                  );
                  window.addEventListener("beforeunload", () =>
                    channel.leave()
                  );
                })
                .catch(() => reject(Error("Could not join general channel.")));

              resolve(channel);
            })
            .catch(() => reject(Error("Could not find general channel.")));
        })
        .catch(() => reject(Error("Could not get channel list.")));
    });
  }

  configureChannelEvents(channel) {
    channel.on("messageAdded", ({ author, body }) => {
      this.addMessage({ author, body });
    });

    channel.on("memberJoined", member => {
      this.addMessage({ body: `${member.identity} has joined the channel.` });
    });

    channel.on("memberLeft", member => {
      this.addMessage({ body: `${member.identity} has left the channel.` });
    });
  }

  handleNewMessage(text) {
    if (this.state.channel) {
      this.state.channel.sendMessage(text);
    }
  }

  addMessage(message) {
    const messageData = {
      message: message,
      me: message.author === "undefined"
    };
    if (message.author === "undefined") {
      messageData.message.author = "בנקאי";
    }
    this.setState({
      messages: [...this.state.messages, messageData]
    });
  }
}

const mapStateToProps = (state, props) => ({
  chatToken: state.video.chatToken,
  chatChannel: state.video.chatChannel,
  chatType: state.video.chatType,
  change: state.video.change
});

const mapDispatchToProps = {
  createChatToken
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(TwilioChat)
);
