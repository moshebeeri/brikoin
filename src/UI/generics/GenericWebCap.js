import React from "react";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
const styles = theme => {
  return {
    sigPad: {
      width: 200,
      height: 50,
      borderColor: "#e8eaed",
      borderWidth: 1,
      borderStyle: "solid",
      backgroundColor: "transparent"
    }
  };
};

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 1,
      marginTop: -15,
      width: 170
    }}
  />
);
class GenericWebCap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log("takePhoto");
  }

  onCameraError(error) {
    console.error("onCameraError", error);
  }

  onCameraStart(stream) {
    console.log("onCameraStart");
  }

  onCameraStop() {
    console.log("onCameraStop");
  }

  render() {
    return (
      <div className="App">
        <Camera
          onTakePhoto={dataUri => {
            this.onTakePhoto(dataUri);
          }}
          onCameraError={error => {
            this.onCameraError(error);
          }}
          idealFacingMode={FACING_MODES.ENVIRONMENT}
          idealResolution={{ width: 640, height: 480 }}
          imageType={IMAGE_TYPES.JPG}
          imageCompression={0.97}
          isMaxResolution={false}
          isImageMirror={false}
          isDisplayStartCameraError
          sizeFactor={1}
          onCameraStart={stream => {
            this.onCameraStart(stream);
          }}
          onCameraStop={() => {
            this.onCameraStop();
          }}
        />
      </div>
    );
  }
}
//   capture () {
//     const imageSrc = this.webcam.getScreenshot()
//     console.log(imageSrc)
//   };
//
//   render () {
//     const videoConstraints = {
//       width: 300,
//       height: 300,
//       facingMode: 'user'
//     }
//
//     return (
//       <div style={{width: 400 , height: 400}}>
//         <Webcam
//           audio={false}
//           height={200}
//           ref={(webcam) => {
//             this.webcam = webcam
//           }}
//           screenshotFormat='image/jpeg'
//           width={300}
//           videoConstraints={videoConstraints}
//         />
//         <IconButton onClick={this.capture.bind(this)}><CameraIcon style={{fontSize: 20}} /></IconButton>
//       </div>
//     )
//   }
// }

export default withWidth()(withStyles(styles)(GenericWebCap));
