import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericList } from "../../UI/index";
import {
  saveCase,
  listenCases,
  getCases,
  listenForProjectRequests
} from "../../redux/actions/case";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import funding from "../investing/funding";
const styles = theme => {
  return {};
};

const LIST_DESCRIPTOR = {
  projectAddress: {
    type: "redirectLink",
    width: 200,
    labelField: "name",
    noTitle: true,
    redirectLink: `/projectsView/`
  },
  bankAccount: {
    type: "redirectLink",
    width: 100,
    valuePath: "accountNumber",
    add: true,
    linkParam: "id",
    redirectLink: `/manageBankAccount/`
  },
  customersOffers: {
    type: "redirectLink",
    width: 50,
    icon: "users",
    linkParam: "id",
    redirectLink: `/lawyerCase/`
  },
  sellerApproveOffer: { type: "checkBox", width: 100 },
  downPayment: { type: "checkBox", width: 70 },
  secondPayment: { type: "checkBox", width: 70 },
  finalPayment: { type: "checkBox", width: 70 },
  approvedFunds: { type: "number", width: 100 },
  projectSoled: { type: "checkBox", width: 100 },
  actions: {
    type: "action",
    param: "user",
    width: 110,
    noTitle: true,
    actions: ["approveProjectSold"]
  }
};

class LawyerCases extends React.Component {
  constructor(props) {
    super(props);
    this.state = { listen: false, listenForOrders: {} };
  }

  getProject(currentCase) {
    const { projects } = this.props;
    return projects.filter(project => project.id === currentCase.projectId)[0];
  }
  approveProjectSold(project) {}

  render() {
    const { cases, lang, projects } = this.props;
    if (projects.length === 0) {
      return <div />;
    }
    const rows = this.createRows(cases, lang);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {cases && cases.length > 0 && (
          <GenericList
            title={"cases"}
            t={this.props.t}
            columnDescription={LIST_DESCRIPTOR}
            rows={rows}
          />
        )}
      </div>
    );
  }

  createRows(cases, lang) {
    return cases
      ? cases
          .filter(currentCase => currentCase.seller)
          .map(currentCase => {
            this.createRow(currentCase, lang);
            return currentCase;
          })
      : [];
  }

  createRow(currentCase, lang) {
    const { pendingOrders } = this.props;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const project = this.getProject(currentCase);
    currentCase.name = project
      ? lang !== "En" && project.lang && project.lang[lang]
        ? project.lang[lang].name
        : project.name
      : "";
    currentCase.projectStarted = false;
    currentCase.bankAccountSum = 0;
    currentCase.hideActions = ["approveProjectSold"];
    currentCase.orderSum =
      project &&
      pendingOrders &&
      pendingOrders[project.address] &&
      pendingOrders[project.address].length > 0
        ? pendingOrders[project.address]
            .map(order => order.amount * order.price)
            .reduce(reducer)
        : 0;
    currentCase.approvedFunds =
      project &&
      pendingOrders &&
      pendingOrders[project.address] &&
      pendingOrders[project.address].length > 0
        ? pendingOrders[project.address]
            .map(order => this.getOrderFunding(order, project))
            .reduce(reducer)
        : 0;
    currentCase.sellerApproveOffer = this.getAcceptedOrder(
      project
    ).sellerSignedTermSheet;
    currentCase.downPayment = this.getAcceptedOrder(project).reserved;
    currentCase.secondPayment = this.getAcceptedOrder(
      project
    ).orderSecondApproved;
    currentCase.finalPayment = this.getAcceptedOrder(project).fullDeposit;
    currentCase.approveProjectSold = this.approveProjectSold.bind(
      this,
      project ? project.address : ""
    );
  }

  getOrderFunding(order, project) {
    let funding = 0;
    if (order.fullDeposit) {
      return order.amount * order.price;
    }
    if (order.orderSecondApproved) {
      return (order.amount * order.price) / 10;
    }
    if (order.reserved) {
      return funding + parseInt(project.reservedBid) / 1000000;
    }

    return 0;
  }

  getAcceptedOrder(project) {
    const { pendingOrders } = this.props;
    if (!project) {
      return {};
    }
    if (!pendingOrders) {
      return {};
    }
    if (!pendingOrders[project.address]) {
      return {};
    }

    const orders = pendingOrders[project.address].filter(
      order => order.acceptOffer
    );
    if (orders && orders.length > 0) {
      return orders[0];
    }

    return {};
  }
  componentDidUpdate() {
    const {
      user,
      listenCases,
      getCases,
      cases,
      listenForProjectRequests
    } = this.props;
    if (user && !this.state.listen) {
      listenCases(user);
      getCases(user);
      this.setState({ listen: true });
    }

    if (cases.length > 0) {
      cases.forEach(givenCase => {
        if (!this.state.listenForOrders[givenCase.projectAddress]) {
          listenForProjectRequests(givenCase.projectAddress);
          let listener = this.state.listenForOrders;
          listener[givenCase.projectAddress] = true;
          this.setState({ listenForOrders: listener });
        }
      });
    }
  }

  componentDidMount() {
    const { user, listenCases } = this.props;
    if (user && !this.state.listen) {
      listenCases(user);
    }
  }
}

LawyerCases.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  cases: state.cases.list,
  lang: state.userProfileReducer.lang,
  projects: getPopulatedProjects(state, props),
  pendingOrders: state.trades.pendingOrders,
  loaded: state.cases.loaded
});
const mapDispatchToProps = {
  saveCase,
  listenCases,
  getCases,
  listenForProjectRequests
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(LawyerCases)
);
