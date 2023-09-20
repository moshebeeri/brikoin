import React from "react";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import SignatureCanvas from "react-signature-canvas";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

const styles = theme => {
  return {
    sigPad: {
      width: 300,
      height: 90,
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
      width: 280
    }}
  />
);
class GenericSignature extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sign: "Sign" };
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  signatureDone() {
    let fileDesc = this.sigPad.toDataURL();
    let file = this.dataURLtoFile(this.sigPad.toDataURL(), "signature.jpg");
    const { fieldKey } = this.props;
    this.props.setState({ [fieldKey + "_file"]: file });
    this.props.setState({ [fieldKey]: fileDesc });
  }

  beginDraw() {
    this.setState({
      sign: ""
    });
  }
  clear() {
    const { fieldKey } = this.props;
    this.sigPad.clear();
    this.setState({
      sign: "Sign"
    });
    this.props.setState({ [fieldKey]: "" });
  }
  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          width: 300,
          height: 90,
          flex: 1,
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <SignatureCanvas
          onEnd={this.signatureDone.bind(this)}
          onBegin={this.beginDraw.bind(this)}
          canvasProps={{ className: classes.sigPad }}
          ref={ref => {
            this.sigPad = ref;
          }}
        />
        <ColoredLine color="#e8eaed" />

        <div
          style={{
            width: 280,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end"
          }}
        >
          <IconButton
            style={{ marginTop: -45 }}
            onClick={this.clear.bind(this)}
          >
            <ClearIcon style={{ fontSize: 20 }} />
          </IconButton>
        </div>
        <div style={{ marginTop: -30 }}>{this.props.t(this.state.sign)}</div>
      </div>
    );
  }

  componentDidMount() {
    const { fieldValue } = this.props;
    if (fieldValue) {
      this.sigPad.fromDataURL(fieldValue);
      this.setState({
        sign: ""
      });
    }
  }
}

export default withWidth()(withStyles(styles)(GenericSignature));
