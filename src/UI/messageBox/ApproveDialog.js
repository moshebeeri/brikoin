import React from "react";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import GenericTextField from "../generics/GenericTextField";
import LinesEllipsis from "react-lines-ellipsis";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { connect } from "react-redux";

class ApproveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, approve: false };
  }

  approve() {
    const { approveAction, request, stackId } = this.props;
    this.setState({ showSpinner: true });
    approveAction(request, stackId);
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  handleClose() {
    const { cancelAction } = this.props;
    cancelAction();
  }

  render() {
    const {
      approveMessage,
      openDialog,
      title,
      form,
      hideAction,
      processNow,
      paragraph,
      direction
    } = this.props;
    return (
      <div>
        <Dialog
          open={openDialog}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {title || this.props.t("approveInvestment")}
          </DialogTitle>
          <DialogContent>
            {paragraph ? (
              <div
                style={{
                  display: "flex",
                  textAlign: direction === "rtl" ? "right" : "left",
                  fontSize: 14,
                  margin: 3,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <LinesEllipsis
                  text={approveMessage}
                  maxLine="30"
                  ellipsis="..."
                  basedOn="words"
                />
              </div>
            ) : (
              <DialogContentText>
                <div dir={direction}>
                  {!this.state.showSpinner
                    ? approveMessage
                    : this.props.t("processing")}
                </div>
              </DialogContentText>
            )}
            {processNow && (
              <div dir={direction} style={{ marginTop: 10 }}>
                <LoadingCircular open size={30} />
              </div>
            )}
            {this.state.showSpinner && (
              <div style={{ marginTop: 10 }}>
                <LoadingCircular open size={30} />
              </div>
            )}
            <div
              dir={direction}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start"
              }}
            >
              {form && form.length > 0 ? (
                form.map(field => this.renedrField(field))
              ) : (
                <div />
              )}
            </div>
          </DialogContent>
          <DialogActions>
            {!this.state.showSpinner && !hideAction && (
              <Button onClick={this.approve.bind(this)} color="primary">
                {this.props.t("approve")}
              </Button>
            )}
            {!this.state.showSpinner && !hideAction && (
              <Button onClick={this.handleClose.bind(this)} color="primary">
                {this.props.t("cancel")}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  renedrField(field) {
    if (field.type === "number") {
      return (
        <GenericTextField
          key={field.state}
          t={this.props.t}
          state={field.state}
          setState={field.setState}
          textType="number"
          fieldKey={field.fieldKey}
        />
      );
    }
  }

  componentDidUpdate() {
    const { process, processDone } = this.props;
    if (!this.state.startProcess && this.state.showSpinner && process) {
      this.setState({ startProcess: true });
    }
    if (this.state.startProcess && !process) {
      processDone();
      this.setState({ startProcess: false, showSpinner: false });
    }
  }
}

const mapStateToProps = state => {
  return {
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ApproveDialog);
