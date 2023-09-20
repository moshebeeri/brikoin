import React from "react";
import { connect } from "react-redux";
import { withProject } from "./withProject";
import {
  listenForProject,
  stopListenForProject
} from "../../redux/actions/projectTradeStats";
import LoadingCircular from "../../UI/loading/LoadingCircular";
export function withProjectTradesStatsParam(WrappedComponent) {
  class ProjectTradesStatsParam extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { listen: false };
    }

    render() {
      const {
        project,
        projectAsks,
        projectPendingOrders,
        projectHistory,
        projectBids,
        user,
        projectHoldings,
        projectMortgages,
        projectMortgagesRequests
      } = this.props;
      
      const currentProjectAsks = projectAsks[project.address]
        ? projectAsks[project.address].filter(ask => ask.active)
        : [];
      const filteredAsks =
        currentProjectAsks && currentProjectAsks.length > 0
          ? currentProjectAsks.filter(ask => ask.state === "initial")
          : [];
      const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";
      const userOrders =
        user && user.uid
          ? projectPendingOrders[project.address] &&
            projectPendingOrders[project.address].length > 0 &&
            projectPendingOrders[project.address].filter(
              order => order.userId === user.uid && order.active
            )
          : {};
      return (
        <WrappedComponent
          dataLoading={this.dataLoaded()}
          project={project}
          holdings={projectHoldings[project.address]}
          order={userOrders && userOrders.length > 0 ? userOrders[0] : {}}
          initialAsk={projectInitialAsk}
          mortgages={projectMortgages[project.address] || []}
          mortgageRequests={projectMortgagesRequests[project.address] || []}
          bids={projectBids[project.address]}
          history={projectHistory[project.address]}
          pendingOrders={projectPendingOrders[project.address]}
          asks={currentProjectAsks}
          {...this.props}
        />
      );
    }

    dataLoaded() {
      const { loaded, project, preview } = this.props;
      if (preview) {
        return true;
      }
      if (!loaded[project.address]) {
        return false;
      }
      if (loaded[project.address]["ASKS"]) {
        return true;
      }
      if (loaded[project.address]["BIDS"]) {
        return true;
      }
      if (loaded[project.address]["PENDING"]) {
        return true;
      }
      if (loaded[project.address]["HOLDINGS"]) {
        return true;
      }
      if (loaded[project.address]["TRADES"]) {
        return true;
      }
      return false;
    }

    componentDidMount() {
      const { project, listenForProject } = this.props;
      if (project && project.address) {
        listenForProject(project);
        this.setState({ listen: true });
      }
    }

    componentDidUpdate() {
      const { project, listenForProject } = this.props;
      if (project && project.address && !this.state.listen) {
        listenForProject(project);
        this.setState({ listen: true });
      }
    }

    componentWillUnmount() {
      const { project, stopListenForProject } = this.props;
      stopListenForProject(project);
    }
  }

  const mapStateToProps = (state, props) => ({
    projectAsks: state.projectTradesStats.projectAsks,
    projectHoldings: state.projectTradesStats.projectHoldings,
    projectBids: state.projectTradesStats.projectBids,
    projectMortgages: state.projectTradesStats.projectMortgages,
    projectPendingOrders: state.projectTradesStats.projectPendingOrders,
    projectMortgagesRequests: state.projectTradesStats.projectMortgagesRequests,
    projectHistory: state.projectTradesStats.projectHistory,
    loaded: state.projectTradesStats.loaded,
    change: state.projectTradesStats.change
  });
  const mapDispatchToProps = {
    listenForProject,
    stopListenForProject
  };
  return withProject(
    connect(mapStateToProps, mapDispatchToProps)(ProjectTradesStatsParam)
  );
}
