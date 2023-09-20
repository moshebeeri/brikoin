import React from "react";
import { connect } from "react-redux";
import InvestDialog from "../investDialog/investDialog";
import SellingDialog from "../investDialog/sellingDialog";
import { withProjectTradesStats } from "../warappers/withProjectTradesStats";
import LoginDialog from "../login/loginDiialog";
import Button from "@material-ui/core/Button";
import ApproveDialog from "../../UI/messageBox/ApproveDialog";
import MortgageInvest from "../../UI/investDialog/mortgageInvest";
import { setPendingOrder } from "../../redux/actions/trade";

class OfficeActionDialog extends React.Component {
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

  showSignUp() {
    this.setState({ showSignup: true });
  }

  showApprove() {
    if (this.state.offer > 0) {
      this.setState({ showApprove: true });
    }
  }

  closeDialog() {
    this.setState({
      cancelOrderDialog: false,
      updateOrderDialog: false,
      acceptCounterOffer: false
    });
  }

  updateOfferAction() {
    const { setPendingOrder, user, project } = this.props;
    setPendingOrder(user, project.address, this.state.order, 1);
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
            updateOrderDialog: false
          });
        }, 2000);
      }
    );
  }

  updateOffer() {
    this.setState({
      updateOrderDialog: true
    });
  }

  actionDone() {
    this.setState({
      updateOrderDialog: false
    });
  }

  closeDialog() {
    this.setState({
      updateOrderDialog: false
    });
  }

  redirectForTermSheet() {
    this.props.history.push("/operationHub");
  }

  render() {
    const { classes, project, order, user } = this.props;
    if (order && order.active) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {!order.signedAgreement && (
            <Button
              variant="outlined"
              fullWidth
              className={classes.button}
              onClick={this.updateOffer.bind(this)}
            >
              {this.props.t("Update Order")}
            </Button>
          )}
          {
            <Button
              variant="outlined"
              fullWidth
              className={classes.button}
              onClick={this.redirectForTermSheet.bind(this)}
            >
              {this.props.t("Sign Terms Sheet")}
            </Button>
          }
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            processDone={this.actionDone.bind(this)}
            process={this.state.loading}
            form={[
              {
                fieldKey: "order",
                type: "number",
                state: this.state,
                setState: this.setState.bind(this)
              }
            ]}
            openDialog={this.state.updateOrderDialog}
            title={this.props.t("Update Order")}
            approveAction={this.updateOfferAction.bind(this)}
            approveMessage={this.props.t("UpdateOrderMsg")}
          />
          <MortgageInvest
            history={this.props.history}
            t={this.props.t}
            project={project}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {user ? (
          <InvestDialog
            location={this.props.location}
            history={this.props.history}
            project={project}
            t={this.props.t}
          />
        ) : (
          <LoginDialog
            history={this.props.history}
            t={this.props.t}
            className={classes.button}
            variant
            buttonString={
              project.tradeMethod === "auction"
                ? this.props.t("placeBid")
                : this.props.t("buy")
            }
            title={this.props.t("pleaseLoginMessage")}
          />
        )}
        <div>
          <MortgageInvest
            history={this.props.history}
            t={this.props.t}
            project={project}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <SellingDialog
            location={this.props.location}
            history={this.props.history}
            t={this.props.t}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};
const mapDispatchToProps = {
  setPendingOrder
};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(OfficeActionDialog)
);
