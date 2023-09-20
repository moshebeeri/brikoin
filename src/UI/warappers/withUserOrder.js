import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { listenOrder } from "../../redux/actions/order";
import { withCusomeStyle } from "./withCusomeStyle";

export function withUserOrder(WrappedComponent) {
  class UserOrder extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { orders: [] };
    }
    render() {
      const project = this.getProject();
      const order = this.getOrder();
      return (
        <WrappedComponent order={order} project={project} {...this.props} />
      );
    }

    componentDidUpdate() {
      const { listenOrder } = this.props;
      const order = this.getOrder();
      if (order.id && !this.state.orders.includes(order.id)) {
        listenOrder(order.project, order.id);
        let orders = this.state.orders;
        orders.push(order.id);
        this.setState({ orders: orders });
      }
    }

    getProject() {
      const { projects, address } = this.props;
      if (!projects || projects.length === 0) {
        return {};
      }
      const projectAddress = address
        ? address
        : this.props.location.pathname.substring(
            this.props.location.pathname.lastIndexOf("/") + 1
          );
      const filteredProjects = projects.filter(
        project => project.address === projectAddress
      );
      if (filteredProjects.length === 0) {
        return {};
      }
      return filteredProjects[0];
    }
    getOrder() {
      const { projectPendingOrders, user } = this.props;
      const project = this.getProject();
      if (!project.address) {
        return {};
      }
      if (!projectPendingOrders || !projectPendingOrders[project.address]) {
        return {};
      }
      const userOrders = projectPendingOrders[project.address].filter(
        order => order.userId === user.uid && order.active && !order.cancelOrder
      );
      return userOrders.length > 0 ? userOrders[0] : {};
    }
  }
  UserOrder.propTypes = {
    classes: PropTypes.object.isRequired
  };

  const mapStateToProps = (state, props) => ({
    projects: getPopulatedProjects(state, props),
    pendingOrders: state.trades.pendingOrders,
    projectPendingOrders: state.projectTradesStats.projectPendingOrders,
    change: state.trades.change,
    user: state.login.user,
    lang: state.userProfileReducer.lang
  });

  const mapDispatchToProps = {
    listenOrder
  };

  return withCusomeStyle(
    connect(mapStateToProps, mapDispatchToProps)(UserOrder)
  );
}
