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
  downPayment: { type: "checkBox", width: 100 },
  approvedFunds: { type: "number", width: 100 },
  offerAccepted: { type: "checkBox", width: 100 },
  termSheetSigned: { type: "checkBox", width: 100 },
  offer: { type: "number", width: 100 },
  customersOffers: {
    type: "redirectLink",
    width: 100,
    icon: "users",
    linkParam: "id",
    redirectLink: `/manageBuyersOffers/`
  }
};

class OwnerProjects extends React.Component {
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
    const { lang, projects, user } = this.props;
    if (projects.length === 0) {
      return <div />;
    }
    let ownedProjects = projects.filter(project => project.owner === user.uid);
    const rows = this.createRows(ownedProjects, lang);
    return (
      <div
        style={{
          display: "flex",
          marginTop: 90,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <GenericList
          title={"MyAssets"}
          t={this.props.t}
          columnDescription={LIST_DESCRIPTOR}
          rows={rows}
        />
      </div>
    );
  }

  createRows(ownedProjects, lang) {
    return ownedProjects && ownedProjects.length > 0
      ? ownedProjects.map(project => {
          let projectRow = this.createRow(project, lang);
          return projectRow;
        })
      : [];
  }

  createRow(project, lang) {
    const { pendingOrders } = this.props;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let result = {};
    result.name = project
      ? lang !== "En" && project.lang && project.lang[lang]
        ? project.lang[lang].name
        : project.name
      : "";
    result.projectStarted = false;
    result.orderSum =
      project &&
      pendingOrders &&
      pendingOrders[project.address] &&
      pendingOrders[project.address].length > 0
        ? pendingOrders[project.address]
            .map(order => order.amount * order.price)
            .reduce(reducer)
        : 0;
    result.approvedFunds =
      project &&
      pendingOrders &&
      pendingOrders[project.address] &&
      pendingOrders[project.address].length > 0
        ? pendingOrders[project.address]
            .map(order => this.getOrderFunding(order, project))
            .reduce(reducer)
        : 0;
    result.downPayment = this.getAcceptedOrder(project).reserved;
    result.offerAccepted = this.getAcceptedOrder(project).acceptOffer;
    result.termSheetSigned = this.getAcceptedOrder(
      project
    ).sellerSignedTermSheet;
    result.offer = this.getAcceptedOrder(project).amount;
    result.id = project.id;
    return result;
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
  componentDidUpdate() {}

  componentDidMount() {}
}

OwnerProjects.propTypes = {
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
  connect(mapStateToProps, mapDispatchToProps)(OwnerProjects)
);
