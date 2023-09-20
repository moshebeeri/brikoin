import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericList, ApproveDialog } from "../../UI/index";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import Grid from "@material-ui/core/Grid";
import {
  acceptOrder,
  rejectOrder,
  counterOffer
} from "../../redux/actions/trusteeManagment";
import { listenForProjectRequests } from "../../redux/actions/case";

const styles = theme => {
  return {};
};

const LIST_DESCRIPTOR = {
  user: { type: "user", width: 150 },
  amount: { type: "number", width: 100 },
  acceptOffer: { type: "checkBox", width: 100 },
  rejectOffer: { type: "checkBox", width: 100 },
  buyerSignedTermSheet: { type: "checkBox", width: 100 },
  counterOffer: { type: "number", width: 100 },
  actions: {
    type: "action",
    width: 310,
    noTitle: true,
    actions: ["acceptOrder", "rejectOrder", "counterOrder", "signTermSheet"]
  }
};

class OwnerOperations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      approveDialog: false,
      approveFund: false,
      listen: false,
      acceptOrderDialog: false,
      counterOrderDialog: false,
      withdrawProjectFundsDialog: false
    };
  }

  rejectOrder(pendingOrderId) {
    this.setState({
      pendingOrderId: pendingOrderId,
      rejectOrderDialog: true
    });
  }
  acceptOrder(pendingOrderId) {
    this.setState({
      pendingOrderId: pendingOrderId,
      acceptOrderDialog: true
    });
  }

  counterOrder(pendingOrderId) {
    this.setState({
      pendingOrderId: pendingOrderId,
      counterOrderDialog: true
    });
  }

  signTermSheet(projectAddress) {
    this.props.history.push("/apartmentLegalsSeller/" + projectAddress);
  }
  acceptOrderAction() {
    const { acceptOrder } = this.props;
    this.setState({
      action: "acceptOrder"
    });
    this.approveAction(acceptOrder);
  }

  counterOrderAction() {
    const { counterOffer } = this.props;
    this.setState({
      action: "counterOffer"
    });
    this.approveAction(counterOffer, this.state.counterOffer);
  }

  rejectOrderAction() {
    const { rejectOrder } = this.props;
    this.setState({
      action: "rejectOffer"
    });
    this.approveAction(rejectOrder);
  }

  approveAction(action, param) {
    const { projects, user } = this.props;

    const projectId = this.getProjectId();
    const currentProject = projects.filter(
      project => project.id === projectId
    )[0];

    this.setState({
      processing: true
    });
    if (param) {
      action(
        user.uid,
        currentProject.address,
        this.state.pendingOrderId,
        param
      );
    } else {
      action(user.uid, currentProject.address, this.state.pendingOrderId);
    }
  }

  componentDidUpdate() {
    const { projects, pendingOrders, listenForProjectRequests } = this.props;

    if (projects) {
      const projectId = this.getProjectId();
      const project = projects.filter(
        currentProject => currentProject.id === projectId
      )[0];
      if (!this.state.listen && project) {
        listenForProjectRequests(project.address);
        this.setState({ listen: true });
      }
    }

    if (this.state.processing) {
      const pendingOrder = this.getPendingOrder(projects, pendingOrders);

      if (!this.state.pendingOrderId) {
        this.setState({ processing: false });
        return;
      }

      if (!pendingOrder) {
        this.setState({ processing: false });
        return;
      }
      if (this.state.action === "acceptOrder" && pendingOrder.acceptOffer) {
        this.setState({ processing: false });
      }
      if (this.state.action === "rejectOffer" && pendingOrder.rejectOffer) {
        this.setState({ processing: false });
      }
      if (this.state.action === "counterOffer" && pendingOrder.counterOffer) {
        this.setState({ processing: false });
      }
    }
  }

  getPendingOrder(projects, pendingOrders) {
    const projectId = this.getProjectId();
    const project = projects.filter(
      currentProject => currentProject.id === projectId
    )[0];
    const pendingOrder = pendingOrders[project.address].filter(
      order => order.id === this.state.pendingOrderId
    )[0];
    return pendingOrder;
  }

  componentDidMount() {
    const { projects, listenForProjectRequests } = this.props;
    if (projects) {
      const projectId = this.getProjectId();
      const project = projects.filter(
        currentProject => currentProject.id === projectId
      )[0];
      if (!this.state.listen && project) {
        listenForProjectRequests(project.address);
        this.setState({ listen: true });
      }
    }
  }

  closeDialog() {
    this.setState({
      acceptOrderDialog: false,
      counterOrderDialog: false,
      rejectOrderDialog: false
    });
  }

  actionDone() {
    this.setState({
      pendingOrderId: "",
      action: "",
      counterOffer: "",
      processing: false,
      acceptOrderDialog: false,
      counterOrderDialog: false,
      rejectOrderDialog: false
    });
  }

  render() {
    const { projects, loaded, publicUsers, pendingOrders } = this.props;
    if (!loaded) {
      return <div />;
    }
    if (!pendingOrders || pendingOrders.length === 0) {
      return <div />;
    }
    const projectId = this.getProjectId();
    const project = projects.filter(project => project.id === projectId)[0];
    if (!project) {
      return <div />;
    }
    const rows = this.createRow(project, pendingOrders).filter(row => row);
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
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            openDialog={this.state.acceptOrderDialog}
            title={this.props.t("AcceptOffer")}
            approveAction={this.acceptOrderAction.bind(this)}
            approveMessage={this.props.t("AcceptOfferMsg")}
          />
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            openDialog={this.state.rejectOrderDialog}
            title={this.props.t("RejectOffer")}
            approveAction={this.rejectOrderAction.bind(this)}
            approveMessage={this.props.t("RejectOfferMsg")}
          />
          <ApproveDialog
            t={this.props.t}
            cancelAction={this.closeDialog.bind(this)}
            processDone={this.actionDone.bind(this)}
            process={this.state.processing}
            form={[
              {
                fieldKey: "counterOffer",
                type: "number",
                state: this.state,
                setState: this.setState.bind(this)
              }
            ]}
            openDialog={this.state.counterOrderDialog}
            title={this.props.t("CounterOffer")}
            approveAction={this.counterOrderAction.bind(this)}
            approveMessage={this.props.t("CounterOfferMsg")}
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

  createRow(project, pendingOrders) {
    return pendingOrders[project.address] &&
      pendingOrders[project.address].length > 0
      ? pendingOrders[project.address].map(pendingOrder => {
          if (!pendingOrder) {
            return "";
          }
          let buyer = {};
          buyer.id = pendingOrder.id;
          buyer.amount = pendingOrder.amount * pendingOrder.price;
          buyer.acceptOffer = pendingOrder.acceptOffer;
          buyer.rejectOffer = pendingOrder.rejectOffer;
          buyer.buyerSignedTermSheet = pendingOrder.buyerSignedTermSheet;
          buyer.user = pendingOrder.userId;
          buyer.counterOffer = pendingOrder.counterOffer;
          buyer.hideActions = this.getHideActions(pendingOrder);
          buyer.rejectOrder = this.rejectOrder.bind(this, buyer.id);
          buyer.acceptOrder = this.acceptOrder.bind(this, buyer.id);
          buyer.counterOrder = this.counterOrder.bind(this, buyer.id);
          buyer.signTermSheet = this.signTermSheet.bind(this, project.address);
          return buyer;
        })
      : [];
  }

  getHideActions(pendingOrder) {
    if (
      pendingOrder.buyerSignedTermSheet &&
      !pendingOrder.sellerSignedTermSheet
    ) {
      return ["acceptOrder", "rejectOrder", "counterOrder"];
    }
    if (pendingOrder.acceptOffer) {
      return ["acceptOrder", "rejectOrder", "counterOrder", "signTermSheet"];
    }

    if (pendingOrder.rejectOffer) {
      return ["acceptOrder", "rejectOrder", "counterOrder", "signTermSheet"];
    }
    return ["signTermSheet"];
  }

  getProjectId() {
    return this.props.location.pathname.substring(20)
      ? this.props.location.pathname.substring(20)
      : "";
  }
}

OwnerOperations.propTypes = {
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
  acceptOrder,
  rejectOrder,
  counterOffer,
  listenForProjectRequests
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(OwnerOperations)
);
