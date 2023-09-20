import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { setPendingOrder, cancelPendingOrder } from "../../redux/actions/trade";
import { listenForProjectRequests } from "../../redux/actions/case";
import Typography from "@material-ui/core/Typography";
import { format } from "../../utils/stringUtils";
import currencyUtils from "../../utils/currencyUtils";
import ApproveDialog from "../../UI/messageBox/ApproveDialog";
import numberUtils from "../../utils/numberUtils";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import LoadingCircular from "../../UI/loading/LoadingCircular";
class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      open: false,
      stackId: "",
      showSignup: false,
      listen: {},
      useInternal: true,
      cancelOrderDialog: false,
      updateOrderDialog: false,
      acceptCounterOffer: false
    };
  }

  login() {
    const { email, password } = this.state;
    this.props.login(email, password);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  handleClose() {
    this.setState({ open: false, showSignup: false });
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  showSignUp() {
    this.setState({ showSignup: true });
  }

  showApprove() {
    if (this.state.offer > 0) {
      this.setState({ showApprove: true });
    }
  }
  submitOffer() {
    const { user, project, setPendingOrder } = this.props;
    if (this.state.offer > 0) {
      setPendingOrder(user, project.address, this.state.offer, 1);
      this.setState(
        {
          loading: true,
          investPrice: "",
          investAmount: ""
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false,
              open: false
            });
          }, 2000);
        }
      );
    }
  }

  cancelOfferAction() {
    const { user, cancelPendingOrder, project, order } = this.props;
    cancelPendingOrder(user, project.address, order.id);

    this.setState(
      {
        loading: true
      },
      () => {
        this.timer = setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 7000);
      }
    );
  }

  acceptCounterAction() {
    const { user, setPendingOrder, project, order } = this.props;
    setPendingOrder(user, project.address, order.counterOffer, 1);
    this.setState(
      {
        loading: true
      },
      () => {
        this.timer = setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 7000);
      }
    );
  }
  updateOfferAction() {
    const { user, setPendingOrder, project } = this.props;
    setPendingOrder(user, project.address, this.state.offer, 1);

    this.setState(
      {
        loading: true
      },
      () => {
        this.timer = setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 7000);
      }
    );
  }

  cancelOffer() {
    this.setState({
      cancelOrderDialog: true
    });
  }

  acceptCounterOffer() {
    this.setState({
      acceptCounterOffer: true
    });
  }

  completePurchase() {
    const { project } = this.props;
    this.props.history.push("/apartmentLegals/" + project.address);
  }
  updateOffer() {
    this.setState({
      updateOrderDialog: true
    });
  }
  actionDone() {
    this.setState({
      cancelOrderDialog: false,
      updateOrderDialog: false,
      acceptCounterOffer: false
    });
  }

  closeDialog() {
    this.setState({
      cancelOrderDialog: false,
      updateOrderDialog: false,
      acceptCounterOffer: false
    });
  }

  render() {
    const { classes, direction, project, order } = this.props;
    if (order) {
      if (order.sellerSignedTermSheet) {
        return (
          <div>
            <Typography align="center" variant="h6" color="textSecondary">
              {this.props.t("Terms Sheet Document is signed")}
            </Typography>
          </div>
        );
      }
      if (order.buyerSignedTermSheet) {
        return (
          <div>
            <Typography align="center" variant="h6" color="textSecondary">
              {this.props.t("Waiting for Seller Signature")}
            </Typography>
          </div>
        );
      }
      if (order.acceptOffer) {
        return (
          <div>
            <Button
              variant="outlined"
              fullWidth
              className={classes.button}
              onClick={this.completePurchase.bind(this)}
            >
              {this.props.t("Complete Purchase")}
            </Button>
          </div>
        );
      }
      return (
        <div>
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            processDone={this.actionDone.bind(this)}
            process={this.state.loading}
            openDialog={this.state.cancelOrderDialog}
            title={this.props.t("Cancel Offer")}
            approveAction={this.cancelOfferAction.bind(this)}
            approveMessage={this.props.t("CancelOfferMsg")}
          />
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            processDone={this.actionDone.bind(this)}
            process={this.state.loading}
            openDialog={this.state.acceptCounterOffer}
            title={this.props.t("Accept Counter Offer")}
            approveAction={this.acceptCounterAction.bind(this)}
            approveMessage={this.props.t("AcceptCounterMsg")}
          />
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            processDone={this.actionDone.bind(this)}
            process={this.state.loading}
            form={[
              {
                fieldKey: "offer",
                type: "number",
                state: this.state,
                setState: this.setState.bind(this)
              }
            ]}
            openDialog={this.state.updateOrderDialog}
            title={this.props.t("Update Offer")}
            approveAction={this.updateOfferAction.bind(this)}
            approveMessage={this.props.t("UpdateOfferMsg")}
          />
          <Button
            variant="outlined"
            fullWidth
            className={classes.button}
            onClick={this.cancelOffer.bind(this)}
          >
            {this.props.t("Cancel Offer")}
          </Button>

          {order && order.counterOffer > 0 && (
            <Button
              variant="outlined"
              fullWidth
              className={classes.button}
              onClick={this.acceptCounterOffer.bind(this)}
            >
              {this.props.t("Accept Counter Offer")}
            </Button>
          )}
          {order && order.counterOffer > 0 && (
            <Button
              variant="outlined"
              fullWidth
              className={classes.button}
              onClick={this.updateOffer.bind(this)}
            >
              {this.props.t("Update Offer")}
            </Button>
          )}
        </div>
      );
    }
    if (this.state.showApprove) {
      return (
        <div>
          <Button
            variant="outlined"
            fullWidth
            className={classes.button}
            onClick={this.handleClickOpen.bind(this)}
          >
            {this.props.t("placeOffer")}
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose.bind(this)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {this.props.t("approveOffer")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {format(this.props.t("approveOfferMsg"), [
                  currencyUtils.currencyCodeToSymbol(project.currency) +
                    " " +
                    numberUtils.formatNumber(this.state.offer, 0)
                ])}
              </DialogContentText>
              {this.state.loading && <LoadingCircular size={24} open />}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.submitOffer.bind(this)} color="primary">
                {this.props.t("approve")}
              </Button>
              <Button onClick={this.handleClose.bind(this)} color="primary">
                {this.props.t("cancel")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    return (
      <div>
        <Button
          variant="outlined"
          fullWidth
          className={classes.button}
          onClick={this.handleClickOpen.bind(this)}
        >
          {this.props.t("placeOffer")}
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.props.t("placeOffer")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {format(this.props.t("makeOfferMsg"), [
                parseInt(project.reservedBid) / 1000000
              ])}
            </DialogContentText>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                dir={direction}
                style={{
                  alignItems: "center",
                  flexDirection: "col",
                  justifyContent: "center"
                }}
              >
                <div dir={"ltr"} style={{ flex: 1 }}>
                  <TextField
                    id="email"
                    label={this.props.t("offer")}
                    className={classes.textField}
                    value={this.state.offer}
                    onChange={this.handleChange("offer")}
                    margin="normal"
                    fullWidth
                  />
                </div>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.showApprove.bind(this)} color="primary">
              {this.props.t("submitOffer")}
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              {this.props.t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user,
    direction: state.userProfileReducer.direction,
    activeAccount: state.userAccounts.activeAccount,
    pendingOrders: state.trades.pendingOrders
  };
};

LoginDialog.contextTypes = {
  drizzle: PropTypes.object
};

const mapDispatchToProps = {
  setPendingOrder,
  cancelPendingOrder,
  listenForProjectRequests
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(LoginDialog)
);
