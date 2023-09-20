import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericList, ApproveDialog } from "../../UI/index";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import Grid from "@material-ui/core/Grid";
import {
  approveDownPayment,
  approveFullFund,
  approvePendingOrder,
  cancelAllOrder,
  withdrawANoReserved,
  withdrawProjectFunds,
  approvePendingOrderSecondPayment
} from "../../redux/actions/trusteeManagment";

import numberUtils from "../../utils/numberUtils";
import currencyUtils from "../../utils/currencyUtils";
import { format } from "../../utils/stringUtils";
const styles = theme => {
  return {};
};

const LIST_DESCRIPTOR = {
  user: { type: "user", width: 150 },
  kyc: {
    type: "redirectLink",
    width: 100,
    valuePath: "caseId",
    icon: "documents",
    linkParam: "id",
    redirectLink: `/customerKyc/`
  },
  legal: {
    type: "redirectLink",
    width: 100,
    valuePath: "caseId",
    icon: "documents",
    linkParam: "id",
    redirectLink: `/customerLegal/`
  },
  amount: { type: "number", width: 100 },
  reserved: { type: "checkBox", width: 60 },
  orderSecondApproved: { type: "checkBox", width: 60 },
  fullDeposit: { type: "checkBox", width: 60 },
  orderApproved: { type: "checkBox", width: 60 },
  actions: {
    type: "action",
    param: "user",
    width: 310,
    noTitle: true,
    actions: [
      "cancelAllOrder",
      "withdrawANoReserved",
      "withdrawProjectFunds",
      "saveReserved",
      "approveFund",
      "approveOrder",
      "approveSecondOrder"
    ]
  }
  // withdrawANoReserved: {type: 'action', param: 'user', width: 100, noTitle: true},
  // withdrawProjectFunds: {type: 'action', param: 'user', width: 100, noTitle: true},
  // saveReserved: {type: 'action', param: 'user', width: 100, noTitle: true},
  // approveFund: {type: 'action', param: 'user', width: 100, noTitle: true},
  // approveOrder: {type: 'action', param: 'user', width: 100, noTitle: true}
};

class LawyerCase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      approveDialog: false,
      approveFund: false,
      listen: false,
      approveOrderDialog: false,
      withdrawANoReservedDialog: false,
      withdrawProjectFundsDialog: false,
      rejectOrderDialog: false,
      counterOrderDialog: false,
      acceptOrderDialog: false,
      approveSecondOrderDialog: false,
      cancelAllOrderDialog: false
    };
  }

  withdrawANoReserved(user) {
    this.setState({
      dialogUser: user,
      withdrawANoReservedDialog: true
    });
  }
  rejectOrder(user) {
    this.setState({
      dialogUser: user,
      rejectOrderDialog: true
    });
  }
  acceptOrder(user) {
    this.setState({
      dialogUser: user,
      acceptOrderDialog: true
    });
  }

  counterOrder(user) {
    this.setState({
      dialogUser: user,
      counterOrderDialog: true
    });
  }
  withdrawProjectFund(user) {
    this.setState({
      dialogUser: user,
      withdrawProjectFundsDialog: true
    });
  }

  cancelAllOrder(user) {
    this.setState({
      dialogUser: user,
      cancelAllOrderDialog: true
    });
  }

  saveReserved(user) {
    this.setState({
      dialogUser: user,
      approveDialog: true
    });
  }

  approveOrder(user) {
    this.setState({
      dialogUser: user,
      approveOrderDialog: true
    });
  }

  approveSecondOrder(user) {
    this.setState({
      dialogUser: user,
      approveSecondOrderDialog: true
    });
  }

  approveFund(user) {
    this.setState({
      dialogUser: user,
      approveFund: true
    });
  }

  cancelAllOrderAction() {
    const { cancelAllOrder } = this.props;
    this.setState({
      action: "cancelAllOrderAction"
    });
    this.approveAction(cancelAllOrder);
  }
  withdrawProjectFundsAction() {
    const { withdrawProjectFunds } = this.props;
    this.setState({
      action: "withdrawProjectFundsAction"
    });
    this.approveAction(withdrawProjectFunds);
  }

  withdrawANoReservedAction() {
    const { withdrawANoReserved } = this.props;
    this.setState({
      action: "withdrawANoReservedAction"
    });
    this.approveAction(withdrawANoReserved);
  }
  saveReservedAction() {
    const { approveDownPayment } = this.props;
    this.setState({
      action: "saveReservedAction"
    });
    this.approveAction(approveDownPayment);
  }
  approveOrderAction() {
    const { approvePendingOrder } = this.props;
    this.setState({
      action: "approveOrderAction"
    });
    this.approveAction(approvePendingOrder);
  }
  approveSecondOrderAction() {
    const { approvePendingOrderSecondPayment } = this.props;
    this.setState({
      action: "approveSecondOrderAction"
    });
    this.approveAction(approvePendingOrderSecondPayment);
  }

  saveFundAction() {
    const { approveFullFund } = this.props;
    this.setState({
      action: "saveFundAction"
    });
    this.approveAction(approveFullFund);
  }

  approveAction(action) {
    const { cases, pendingOrders } = this.props;
    const user = this.state.dialogUser;
    const caseId = this.getCaseId();
    const caseView = cases.filter(currentCase => currentCase.id === caseId)[0];
    const orderId = this.getUserPendingOrderId(
      caseView,
      pendingOrders,
      this.state.dialogUser
    );
    this.setState({
      processing: true
    });
    action(user, caseView.projectAddress, orderId);
  }

  componentDidUpdate() {
    const { cases, pendingOrders } = this.props;

    if (this.state.processing) {
      const caseId = this.getCaseId();
      const caseView = cases.filter(
        currentCase => currentCase.id === caseId
      )[0];
      const order = this.getUserPendingOrder(
        caseView,
        pendingOrders,
        this.state.dialogUser
      );
      if (!order) {
        this.setState({ processing: false });
        return;
      }
      if (this.state.action === "cancelAllOrderAction" && order.cancelOrder) {
        this.setState({ processing: false });
      }
      if (this.state.action === "saveReservedAction" && order.reserved) {
        this.setState({ processing: false });
      }
      if (this.state.action === "approveOrderAction" && order.orderApproved) {
        this.setState({ processing: false });
      }
      if (
        this.state.action === "approveSecondOrderAction" &&
        order.orderSecondApproved
      ) {
        this.setState({ processing: false });
      }
      if (this.state.action === "saveFundAction" && order.fullDeposit) {
        this.setState({ processing: false });
      }
    }
  }

  closeDialog() {
    this.setState({
      approveDialog: false,
      approveFund: false,
      approveOrderDialog: false,
      withdrawANoReservedDialog: false,
      withdrawProjectFundsDialog: false,
      approveSecondOrderDialog: false,
      cancelAllOrderDialog: false
    });
  }

  actionDone() {
    this.setState({
      dialogUser: "",
      action: "",
      processing: false,
      approveDialog: false,
      approveFund: false,
      approveSecondOrderDialog: false,
      approveOrderDialog: false,
      withdrawANoReservedDialog: false,
      withdrawProjectFundsDialog: false,
      cancelAllOrderDialog: false
    });
  }

  getUserPendingOrderId(caseView, pendingOrders, buyer) {
    const pendingOrder = pendingOrders[caseView.projectAddress]
      ? pendingOrders[caseView.projectAddress].filter(
          order => order.userId === buyer
        )[0]
      : {};

    return pendingOrder.id;
  }
  getUserPendingOrder(caseView, pendingOrders, buyer) {
    const pendingOrder = pendingOrders[caseView.projectAddress]
      ? pendingOrders[caseView.projectAddress].filter(
          order => order.userId === buyer
        )[0]
      : {};
    return pendingOrder;
  }
  render() {
    const { cases, loaded, publicUsers, pendingOrders } = this.props;
    if (!loaded) {
      return <div />;
    }
    const caseId = this.getCaseId();
    const caseView = cases.filter(currentCase => currentCase.id === caseId)[0];
    const rows = this.createRow(caseView, pendingOrders, caseId).filter(
      row => row
    );
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            margin: 5,
            maxWidth: 1140,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: 90
          }}
        >
          {this.renderBuyersTable(publicUsers, rows)}
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            openDialog={this.state.withdrawProjectFundsDialog}
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            title={this.props.t("WithdrawProjectFunds")}
            approveAction={this.withdrawProjectFundsAction.bind(this)}
            approveMessage={this.props.t("WithdrawProjectFundsMsg")}
          />

          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            openDialog={this.state.withdrawANoReservedDialog}
            processDone={this.actionDone.bind(this)}
            title={this.props.t("WithdrawNoReserved")}
            process={this.state.processing}
            approveAction={this.withdrawANoReservedAction.bind(this)}
            approveMessage={this.props.t("WithdrawNoReservedMsg")}
          />

          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            openDialog={this.state.cancelAllOrderDialog}
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            title={this.props.t("CancelAllOrder")}
            approveAction={this.cancelAllOrderAction.bind(this)}
            approveMessage={this.props.t("CancelAllOrderMsg")}
          />

          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            openDialog={this.state.approveOrderDialog}
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            title={this.props.t("ApproveOrder")}
            approveAction={this.approveOrderAction.bind(this)}
            approveMessage={this.props.t("ApproveOrderMsg")}
          />
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            openDialog={this.state.approveSecondOrderDialog}
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            title={this.props.t("ApproveOrderSecond")}
            approveAction={this.approveSecondOrderAction.bind(this)}
            approveMessage={this.props.t("ApproveOrderSecondMsg")}
          />

          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            openDialog={this.state.approveDialog}
            process={this.state.processing}
            processDone={this.actionDone.bind(this)}
            title={this.props.t("ApproveReserved")}
            approveAction={this.saveReservedAction.bind(this)}
            approveMessage={format(this.props.t("ApproveReservedMsg"), [
              this.getProjectReservedPrice()
            ])}
          />

          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            openDialog={this.state.approveFund}
            title={this.props.t("ApproveFund")}
            approveAction={this.saveFundAction.bind(this)}
            approveMessage={this.props.t("ApproveFundMsg")}
          />
        </div>
      </div>
    );
  }

  renderBuyersTable(publicUsers, rows) {
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={16}
      >
        <Grid key="1" item>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <GenericList
              users={publicUsers}
              title={"Buyers Offers"}
              t={this.props.t}
              columnDescription={LIST_DESCRIPTOR}
              rows={rows}
            />
          </div>
        </Grid>
      </Grid>
    );
  }

  getProjectReservedPrice() {
    const { projects, cases } = this.props;
    if (!projects) {
      return 0;
    }
    const caseId = this.getCaseId();
    const caseView = cases.filter(currentCase => currentCase.id === caseId)[0];
    const currentProject = projects.filter(
      project => project.id === caseView.projectId
    );
    if (!currentProject || currentProject.length === 0) {
      return 0;
    }
    const reservedBid = currentProject[0].reservedBid
      ? parseInt(currentProject[0].reservedBid) / 1000000
      : 0;
    return (
      numberUtils.formatNumber(reservedBid, 0) +
      currencyUtils.currencyCodeToSymbol(currentProject[0].currency)
    );
  }

  createRow(caseView, pendingOrders, caseId) {
    return caseView && caseView.buyers
      ? Object.keys(caseView.buyers).map(key => {
          const buyer = caseView.buyers[key];
          const pendingOrder =
            buyer.offer && pendingOrders[caseView.projectAddress]
              ? pendingOrders[caseView.projectAddress].filter(
                  order => order.id === buyer.offer
                )[0]
              : {};
          if (!pendingOrder) {
            return "";
          }
          buyer.id = key;
          if (pendingOrder) {
            buyer.amount = pendingOrder.amount * pendingOrder.price;
            buyer.reserved = pendingOrder.reserved;
            buyer.fullDeposit = pendingOrder.fullDeposit;
            buyer.orderApproved = pendingOrder.orderApproved;
            buyer.orderSecondApproved = pendingOrder.orderSecondApproved;
            buyer.hideActions = this.getHideActions(pendingOrder);
          }
          buyer.caseId = caseId;
          buyer.saveReserved = this.saveReserved.bind(this, buyer.user);
          buyer.approveFund = this.approveFund.bind(this, buyer.user);
          buyer.approveOrder = this.approveOrder.bind(this, buyer.user);
          buyer.cancelAllOrder = this.cancelAllOrder.bind(this, buyer.user);
          buyer.withdrawANoReserved = this.withdrawANoReserved.bind(
            this,
            buyer.user
          );
          buyer.withdrawProjectFunds = this.withdrawProjectFund.bind(
            this,
            buyer.user
          );
          buyer.rejectOrder = this.rejectOrder.bind(this, buyer.user);
          buyer.acceptOrder = this.acceptOrder.bind(this, buyer.user);
          buyer.counterOrder = this.counterOrder.bind(this, buyer.user);
          buyer.approveSecondOrder = this.approveSecondOrder.bind(
            this,
            buyer.user
          );
          return buyer;
        })
      : [];
  }

  getHideActions(pendingOrder) {
    if (pendingOrder.cancelOrder) {
      return [
        "saveReserved",
        "approveFund",
        "cancelAllOrder",
        "approveOrder",
        "approveSecondOrder"
      ];
    }
    if (!pendingOrder.reserved) {
      return [
        "approveFund",
        "approveOrder",
        "cancelAllOrder",
        "withdrawANoReserved",
        "withdrawProjectFunds",
        "approveOrder",
        "approveSecondOrder"
      ];
    }

    if (!pendingOrder.orderSecondApproved) {
      return [
        "approveFund",
        "approveOrder",
        "cancelAllOrder",
        "withdrawANoReserved",
        "withdrawProjectFunds",
        "approveOrder",
        "saveReserved"
      ];
    }

    if (!pendingOrder.fullDeposit) {
      return [
        "saveReserved",
        "cancelAllOrder",
        "approveOrder",
        "approveSecondOrder"
      ];
    }
    if (!pendingOrder.orderApproved) {
      return [
        "saveReserved",
        "approveFund",
        "withdrawANoReserved",
        "withdrawProjectFunds",
        "approveSecondOrder"
      ];
    }

    if (pendingOrder.orderApproved) {
      return [
        "saveReserved",
        "approveFund",
        "withdrawANoReserved",
        "withdrawProjectFunds",
        "approveOrder",
        "approveSecondOrder"
      ];
    }

    return [
      "approveFund",
      "saveReserved",
      "approveOrder",
      "cancelAllOrder",
      "withdrawANoReserved",
      "withdrawProjectFunds",
      "approveOrder",
      "saveReserved",
      "approveSecondOrder"
    ];
  }

  getCaseId() {
    return this.props.location.pathname.substring("lawyerCase".length + 2)
      ? this.props.location.pathname.substring("lawyerCase".length + 2)
      : "";
  }
}

LawyerCase.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  cases: state.cases.list,
  lang: state.userProfileReducer.lang,
  publicUsers: state.userAccounts.publicUUsers,
  projects: getPopulatedProjects(state, props),
  pendingOrders: state.trades.pendingOrders,
  change: state.trades.change,
  loaded: state.cases.loaded
});
const mapDispatchToProps = {
  approveDownPayment,
  approveFullFund,
  approvePendingOrder,
  cancelAllOrder,
  withdrawANoReserved,
  withdrawProjectFunds,
  approvePendingOrderSecondPayment
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(LawyerCase)
);
