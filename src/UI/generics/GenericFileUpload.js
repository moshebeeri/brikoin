import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import withWidth from "@material-ui/core/withWidth";
import GennericImageUploader from "./GenericIImageUploader";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { connect } from 'react-redux';
const styles = theme => {
  return {
    root: {
      display: "flex",
      flexWrap: "wrap"
    },

    input: {
      marginLeft: 8,
      marginRight: 8,
      fontSize: 16,
      height: 41,

      flex: 1,
      border: "1px solid #ced4da",
      borderRadius: 4,
      padding: "10px 26px 10px 12px"
    },
    bootstrapFormLabel: {
      fontSize: 18
    },
    icon: {
      height: 40,
      fontSize: 20
    }
  };
};

class GenericFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errorMessage: "" };
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const {
      fieldKey,
      fieldValue,
      classes,
      edit,
      direction,
      multiple
    } = this.props;
    let link =
      this.props.state[fieldKey + "_file"] &&
      this.props.state[fieldKey + "_file"].length > 0
        ? window.URL.createObjectURL(this.props.state[fieldKey + "_file"][0])
        : "";
    let currentLink =
      link || (this.props.state[fieldKey + "_clean"] ? "" : fieldValue);
    return (
      <div
        style={{
          width: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
          flex: 1
        }}
      >
        <form className={classes.container} noValidate autoComplete="off">
          {currentLink ? (
            <div
              style={{
                marginRight: direction === "rtl" ? 20 : 0,
                marginLeft: direction === "rtl" ? 0 : 20,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                width: 300,
                height: 60
              }}
            >
              {
                <a href={currentLink} target="_blank">
                  {this.props.t(fieldKey)}
                </a>
              }
              {edit && (
                <Button
                  className={classes.icon}
                  onClick={this.clearUpload.bind(this, fieldKey)}
                >
                  <DeleteForeverIcon className={classes.icon} />
                </Button>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
            >
              <div
                style={{
                  width: 300,
                  height: 60,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "center"
                }}
              >
                {!currentLink && this.props.t(fieldKey)}

                <div style={{ width: 200 }}>
                  <input
                    id="jpg"
                    multiple={multiple}
                    placeholder={this.props.t("file")}
                    className={classes.fileUpload}
                    type="file"
                    accept="jpg"
                    onChange={this.handleChangeFile(fieldKey)}
                  />
                </div>
                {this.state.errorMessage}
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }

  clearUpload(fileName) {
    this.props.setState({
      [fileName + "_clean"]: true,
      [fileName]: "",
      [fileName + "_file"]: ""
    });
  }

  handleChangeFile(name) {
    const { maxFiles } = this.props;
    let file = name + "_file";
    let setState = this.setState.bind(this);
    return event => {
      if (maxFiles && event.target.files.length > maxFiles) {
        setState({ errorMessage: "Please Select Only 5 pictures" });
        return;
      }
      setState({ errorMessage: "" });
      this.props.setState({
        [name]: event.target.value,
        [file]: event.target.files
      });
    };
  }
}

const mapStateToProps = (state, props) => ({
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {};


export default withWidth()(withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(GenericFileUpload)))