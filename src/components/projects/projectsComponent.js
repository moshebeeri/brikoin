import React, { PureComponent } from "react";
import styled from "styled-components";
import AppHeader from "../appHeader/appHeader";
import ProjectsList from "../projects/ProjectsList";
import Developer from "../developer/developer";

import { getRegistrars } from "../../redux/actions/registrars";
import { getTrustees } from "../../redux/actions/trustees";
import { getManagers } from "../../redux/actions/managers";
import { getEstimations } from "../../redux/actions/estimations";
import { getProperties } from "../../redux/actions/properties";
import { getTerms } from "../../redux/actions/terms";
import { getProjects } from "../../redux/actions/projects";
import { getAccounts, listenForAccount } from "../../redux/actions/accounts";

import { connect } from "react-redux";
const Container = styled.main`
  display: flex;
  flex-flow: column nowrap;
  margin: 0 auto;
  max-width: ${p => 160 * p.theme.spacing}px;
`;

class App extends PureComponent {
  componentWillMount() {
    const { userAccounts, user } = this.props;
    if (user && userAccounts.length === 0) {
      this.props.getAccounts(user);
    }
    if (user) {
      this.props.getRegistrars();
      this.props.getTrustees();
      this.props.getManagers();
      this.props.getEstimations();
      this.props.getProperties();
      this.props.getTerms();
      this.props.getProjects();
    }
  }

  componentDidUpdate() {
    const { userAccounts, user } = this.props;
    if (user && userAccounts.length === 0) {
      this.props.getAccounts(user);
      this.props.listenForAccount(user);
    }
    if (user) {
      this.props.getRegistrars();
      this.props.getTrustees();
      this.props.getManagers();
      this.props.getEstimations();
      this.props.getProperties();
      this.props.getTerms();
      this.props.getProjects();
    }
  }

  render() {
    return (
      <Container>
        <AppHeader />

        <ProjectsList />
        <Developer />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  showHoldings: state.main.showHoldings,
  showProjects: state.main.showProjects,
  showHome: state.main.showHome,
  showAdmin: state.main.showAdmin,
  showLogin: state.main.showLogin,
  showSignUp: state.main.showSignUp,
  user: state.login.user,
  userAccounts: state.userAccounts.accounts,
  update: state.userAccounts.update
});
const mapDispatchToProps = {
  getRegistrars,
  getTrustees,
  getManagers,
  getEstimations,
  getProperties,
  getTerms,
  getProjects,
  getAccounts,
  listenForAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
