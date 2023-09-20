import React, { Component } from "react";
import * as Flex from "@twilio/flex-ui";
import { MyCustomTaskInfoPanelItem } from "./customComponenet/taskInfoPanelItem";
import VideoComponentContainer from "./video/VideoComponentContainer";
import ChatComponentContainer from "./chat/ChatComponentContainer";
import ClientView from "./client/ClientView";
import { connect } from "react-redux";
import {
  leaveRoom,
  joinRoom,
  joinChatChannel,
  leaveChatChanel
} from "./redux/actions/video";
class FlexContainer extends Component {
  constructor(props) {
    super(props);

    Flex.TaskInfoPanel.Content.add(
      <MyCustomTaskInfoPanelItem key="to-do-list" />
    );
    Flex.CRMContainer.Content.replace(<ClientView key="end" />);

    // const myOwnVideoChannel = Flex.DefaultTaskChannels.createDefaultTaskChannel('My Video', this.isVideoChanel.bind(this))
    const myOwnVideoChannel = Flex.DefaultTaskChannels.createChatTaskChannel(
      "My Video",
      this.isVideoChanel.bind(this),
      "Video",
      "VideoBold",
      "blue"
    );
    myOwnVideoChannel.addedComponents = [
      {
        target: "TaskCanvasTabs",
        component: (
          <VideoComponentContainer
            key="Video-Tab"
            icon={
              <img src="https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/IcnVideo.width-800.png" />
            }
            iconActive={
              <img src="https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/IcnVideoBold.width-800.png" />
            }
          />
        ),
        options: {
          sortOrder: 0,
          align: "start"
        }
      }
    ];
    Flex.TaskChannels.register(myOwnVideoChannel);

    const myOwnChatChannel = Flex.DefaultTaskChannels.createChatTaskChannel(
      "My Chat",
      this.isChatChanel.bind(this),
      "Chat",
      "ChatBold",
      "blue"
    );
    myOwnChatChannel.addedComponents = [
      {
        target: "TaskCanvasTabs",
        component: <ChatComponentContainer key="Chat-Tab" />,
        options: {
          sortOrder: 0,
          align: "start"
        }
      }
    ];
    Flex.TaskChannels.register(myOwnChatChannel);
    const joinRoom = this.props.joinRoom;
    const joinChatChannel = this.props.joinChatChannel;
    Flex.Actions.replaceAction("AcceptTask", async (payload, original) => {
      if (payload.task.attributes.type === "video") {
        joinRoom(
          payload.task.attributes.roomName,
          payload.task.attributes.clientId
        );
        console.log("VIDEO ACCEPTED");
      }

      if (payload.task.attributes.channelType === "default") {
        joinChatChannel(
          payload.task.attributes.channelSid,
          payload.task.attributes.name
        );
        console.log("CHAT ACCEPTED");
      }
      let response = await original(payload);
      return response;
    });

    Flex.Actions.replaceAction("RejectTask", async (payload, original) => {
      if (payload.task.attributes.type === "video") {
        console.log("VIDEO REJECTED");
      }
      let response = await original(payload);
      return response;
    });
    Flex.Actions.replaceAction("EndTask", async (payload, original) => {
      if (payload.task.attributes.type === "video") {
        console.log("VIDEO ENDED");
      }
      let response = await original(payload);
      return response;
    });

    const leaveRoom = this.props.leaveRoom;
    const leaveChatChanel = this.props.leaveChatChanel;
    Flex.Actions.addListener("afterCompleteTask", payload => {
      if (payload.task.attributes.type === "video") {
        leaveRoom();
        console.log("VIDEO COMPLETED");
      }
      if (payload.task.attributes.channelType === "default") {
        leaveChatChanel();
      }
    });
  }

  isVideoChanel(task) {
    // console.log(task)
    if (task.attributes.type === "video") {
      return true;
    }
    return false;
  }
  x;
  isChatChanel(task) {
    // console.log(task)
    if (task.attributes.channelType === "default") {
      return true;
    }
    return false;
  }
  render() {
    const { manager } = this.props;

    if (!manager) {
      return null;
    }

    /*
     Controls showing of the local track
     Only show video track after user has joined a room else show nothing
    */
    return (
      <Flex.ContextProvider manager={manager}>
        <Flex.RootContainer />
      </Flex.ContextProvider>
    );
  }
}

const mapStateToProps = (state, props) => ({
  videoToken: state.video.videoToken
});

const mapDispatchToProps = {
  leaveRoom,
  joinRoom,
  joinChatChannel,
  leaveChatChanel
};
export default connect(mapStateToProps, mapDispatchToProps)(FlexContainer);
