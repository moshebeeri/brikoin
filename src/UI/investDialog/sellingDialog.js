import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withProjectTradesStats } from "../warappers/withProjectTradesStats";
import { format } from "../../utils/stringUtils";
import numberUtils from "../../utils/numberUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";

class SellingDialog extends React.Component {
  constructor(props) {
    super(props);
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    this.state = {
      open: false,
      phoneValidation: false,
      phoneInvalid: false,
      dueDate: date.toLocaleDateString()
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
    this.setState({
      open: false,
      phoneValidation: false,
      checkPhoneValidation: false
    });
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  showSignUp() {
    this.setState({ showSignup: true });
  }
  submitOrder() {
    const { sellAmount, sellPrice } = this.state;

    let validationMessage = this.validateOfferMessage();
    if (!validationMessage) {
      this.setState(
        {
          errorMessage: "",
          loading: true
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false
            });
          }, 2000);
        }
      );
    } else {
      this.setState({ errorMessage: validationMessage });
    }
  }

  validateOfferMessage() {
    const { project } = this.props;
    const { sellAmount, sellPrice } = this.state;
    if (!sellPrice || sellPrice <= 0) {
      return this.props.t("Price Must be Greater then zero");
    }
    const minUnits = parseInt(project.target) / parseInt(project.maxOwners);
    const unitsMod = sellAmount % minUnits;
    if (unitsMod > 0 || !unitsMod) {
      return format(this.props.t("MinimumAmountMsg"), [
        numberUtils.formatNumber(minUnits, 0)
      ]);
    }
    return "";
  }

  render() {
    const { user, holdings } = this.props;
    if (!user) {
      return <div />;
    }

    if (!holdings || holdings.length === 0) {
      return <div />;
    }

    return this.renderDialog();
  }

  renderDialog() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          onClick={this.handleClickOpen.bind(this)}
          fullWidth
          variant="outlined"
          className={classes.button}
        >
          {this.props.t("sell")}
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.props.t("Selling Offer")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.props.t("auctionSellingMsg")}
            </DialogContentText>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                style={{
                  alignItems: "center",
                  flexDirection: "col",
                  justifyContent: "center"
                }}
              >
                <div style={{ flex: 1 }}>
                  <TextField
                    id="sellAmount"
                    label={this.props.t("sellAmount")}
                    className={classes.textField}
                    value={this.state.sellAmount}
                    onChange={this.handleChange("sellAmount")}
                    margin="number"
                    fullWidth
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    id="sellPrice"
                    fullWidth
                    label={this.props.t("Min Selling Price")}
                    value={this.state.sellPrice}
                    onChange={this.handleChange("sellPrice")}
                    className={classes.textField}
                    margin="normal"
                    type="number"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    id="dueDate"
                    fullWidth
                    label={this.props.t("Auction Due Date")}
                    value={this.state.dueDate}
                    onChange={this.handleChange("dueDate")}
                    className={classes.textField}
                    margin="normal"
                    type="date"
                  />
                </div>
              </div>
              {this.state.loading && (
                <LoadingCircular
                  open
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
              {
                <div style={{ fontSize: 14, color: "red" }}>
                  {this.state.errorMessage}
                </div>
              }
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.submitOrder.bind(this)} color="primary">
              {this.props.t("Submit Offer")}
            </Button>
            }
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
    direction: state.userProfileReducer.direction
  };
};

const mapDispatchToProps = {};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(SellingDialog)
);
