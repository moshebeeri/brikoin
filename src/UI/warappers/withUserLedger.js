import React from "react";
import { connect } from "react-redux";
import { listenLedger } from "../../redux/actions/ledger";
import { withCusomeStyle } from "./withCusomeStyle";

export function withUserLedger(WrappedComponent) {
  class UserLedger extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { listenLedger: false };
    }

    render() {
      const { ledger } = this.props;
      const sum = this.calcSum();
      const sumByProject = this.calcSumByProject();
      const sumInvestedByProject = this.calcInvestmentByProject();
      return (
        <WrappedComponent
          totalProject={sumByProject}
          totalInvested={sumInvestedByProject}
          totalBalance={sum}
          ledgerList={ledger}
          {...this.props}
        />
      );
    }

    calcSum() {
      const { ledger } = this.props;
      if (ledger && ledger.length > 0) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        return (
          ledger
            .map(transaction =>
              transaction.isAdd
                ? parseInt(transaction.amount)
                : parseInt(transaction.amount) * -1
            )
            .reduce(reducer) / 1000000
        );
      }
      return 0;
    }

    calcSumByProject() {
      const { ledger } = this.props;
      if (ledger && ledger.length > 0) {
        const projects = ledger.map(transaction => transaction.projectAddress);
        const uniqueProjects = [...new Set(projects)];
        return uniqueProjects.map(project => {
          return {
            projectAddress: project,
            totalBalance: this.getProjectSum(project)
          };
        });
      }
    }

    calcInvestmentByProject() {
      const { ledger } = this.props;
      if (ledger && ledger.length > 0) {
        const projects = ledger.map(transaction => transaction.projectAddress);
        const uniqueProjects = [...new Set(projects)];
        return uniqueProjects.map(project => {
          return {
            projectAddress: project,
            totalBalance: this.getProjectInvestedSum(project)
          };
        });
      }
    }

    getProjectInvestedSum(project) {
      const { ledger } = this.props;
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      return (
        ledger
          .filter(transaction => transaction.projectAddress === project)
          .map(transaction =>
            transaction.description === "CANCEL_BID" ||
            transaction.description === "INTERNAL_BID"
              ? transaction.isAdd
                ? parseInt(transaction.amount) * -1
                : parseInt(transaction.amount)
              : 0
          )
          .reduce(reducer) / 1000000
      );
    }

    getProjectSum(project) {
      const { ledger } = this.props;
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      return (
        ledger
          .filter(transaction => transaction.projectAddress === project)
          .map(transaction =>
            transaction.isAdd
              ? parseInt(transaction.amount)
              : parseInt(transaction.amount) * -1
          )
          .reduce(reducer) / 1000000
      );
    }

    componentDidUpdate() {
      const { listenLedger, user } = this.props;
      if (user && !this.state.listenLedger) {
        listenLedger(user);
        this.setState({ listenLedger: true });
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    user: state.login.user,
    ledger: state.userLedger.fullList,
    changed: state.userLedger.changed
  });
  const mapDispatchToProps = {
    listenLedger
  };
  return withCusomeStyle(
    connect(mapStateToProps, mapDispatchToProps)(UserLedger)
  );
}
