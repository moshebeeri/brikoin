import React, { Component } from "react";
import Video, { createLocalTracks } from "twilio-video";
import { connect } from "react-redux";
import { CardText } from "material-ui/Card";
import Stop from "@material-ui/icons/Stop";
import Button from "@material-ui/core/Button";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { withCusomeStyle } from "../warappers/withCusomeStyle";

class VideoComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      identity: null /* Will hold the fake name assigned to the client. The name is generated by faker on the server */,
      roomName: "" /* Will store the room name */,
      roomNameErr: false /* Track error for room name TextField. This will    enable us to show an error message when this variable is true */,
      previewTracks: null,
      localMediaAvailable: false /* Represents the availability of a LocalAudioTrack(microphone) and a LocalVideoTrack(camera) */,
      hasJoinedRoom: false,
      activeRoom: null // Track the current active room
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.detachTracks = this.detachTracks.bind(this);
    this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ height: 500, width: "100%" }}>
        {this.state.hasJoinedRoom ? (
          <div
            className="flex-container"
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              id={`video`}
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div className="flex-item">
                <div ref="localMedia" />
              </div>
              <div style={{ margin: 5 }}></div>
              <div className="flex-item">
                <br />
              </div>
              <div className="flex-item" ref="remoteMedia" id="remote-media" />
            </div>
            {this.state.takePicture && (
              <img
                style={{ backgroundColor: "red", width: 100, height: 100 }}
                src={this.state.takePicture}
              />
            )}
            <Button
              variant="contained"
              onClick={this.leaveRoom.bind(this)}
              className={classes.buttonRegular}
            >
              <Stop />
            </Button>

            <Button
              variant="contained"
              onClick={this.printScreen.bind(this)}
              className={classes.buttonRegular}
            >
              {this.props.t("capture")}
            </Button>
          </div>
        ) : (
          <LoadingCircular open />
        )}
      </div>
    );
  }

  handleRoomNameChange(e) {
    /* Fetch room name from text field and update state */
    let roomName = e.target.value;
    this.setState({ roomName });
  }

  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }

  detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  async joinRoom() {
    /*
     Show an error message on room name text field if user tries         joining a room without providing a room name. This is enabled by setting `roomNameErr` to true
       */
    // if (!this.state.roomName.trim()) {
    //     this.setState({ roomNameErr: true });
    //     return;
    // }
    console.log("Joining room '" + "'...");
    // const stream = await navigator.mediaDevices.getDisplayMedia();
    // const screenTrack = new LocalVideoTrack(stream.getTracks()[0]);
    // this.setState({screenTrack: screenTrack})

    let devices = await navigator.mediaDevices.enumerateDevices();
    const audioInput = devices.find(device => device.kind === "audioinput");
    const localTracks = await createLocalTracks({
      audio: { deviceId: audioInput.deviceId },
      video: { width: 500 }
    });
    let connectOptions = {
      name: this.props.roomName,
      video: { width: 500 },
      // tracks: [screenTrack]
      tracks: localTracks
    };
    this.setState({ localTracks: localTracks });
    /*

Connect to a room by providing the token and connection    options that include the room name and tracks. We also show an alert if an error occurs while connecting to the room.
*/
    Video.connect(this.props.token, connectOptions).then(
      this.roomJoined,
      error => {
        alert("Could not connect to Twilio: " + error.message);
      }
    );
  }

  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  }

  // Attach the Participant's Tracks to the DOM.
  attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  roomJoined(room) {
    // Called when a participant joins a room
    console.log("Joined as '" + this.props.identity + "'");
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true // Removes ‘Join Room’ button and shows ‘Leave Room’
    });
    const localState = this.state;
    // Attach LocalParticipant's tracks to the DOM, if not already attached.
    var previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector("video")) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }
    // ... more event listeners
    // Attach the Tracks of the room's participants.
    room.participants.forEach(participant => {
      var previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });
    // Participant joining room
    room.on("participantConnected", participant => {});
    // Attach participant’s tracks to DOM when they add a track
    room.on("trackAdded", (track, participant) => {
      var previewContainer = this.refs.remoteMedia;
      this.attachTracks([track], previewContainer);
    });
    // Detach participant’s track from DOM when they remove a track.
    room.on("trackRemoved", (track, participant) => {
      this.detachTracks([track]);
    });
    // Detach all participant’s track when they leave a room.
    room.on("participantDisconnected", participant => {
      this.detachParticipantTracks(participant);
    });
    // Once the local participant leaves the room, detach the Tracks
    // of all other participants, including that of the LocalParticipant.
    room.on("disconnected", () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach(track => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.detachTracks(localState.localTracks);
      localState.localTracks.forEach(track => track.stop());
      this.state.activeRoom = null;
      this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
    });
  }

  leaveRoom() {
    if (this.state.activeRoom && !this.state.leaveRoom) {
      this.props.onCallEnd();
      this.state.activeRoom.disconnect();
      this.setState({
        hasJoinedRoom: false,
        leaveRoom: true,
        localMediaAvailable: false
      });
    }
  }

  componentDidUpdate() {
    if (!this.props.endCall) {
      this.leaveRoom();
    }
  }

  async printScreen() {
    window.print();
  }

  componentDidMount() {
    this.joinRoom();
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(VideoComponent)
);
