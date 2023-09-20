/* eslint-disable no-unused-vars */
import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { translate } from "react-i18next";
import { getMyMortgages } from "../redux/actions/mortgage";
// import {setUser} from '../utils/tracker'
import { syncUserState } from "../redux/actions/login";
import { setProjects } from "../redux/actions/projects";

import { Route } from "react-router-dom";
import { loadReCaptcha } from "react-recaptcha-google";
import { withCookies } from  "react-cookie";
import i18next from "i18next";
import AppHeader from "./suspense/AppHeaderSuspense";
import MyProjectGroups from "./groups/MyGroups"
import ProjectListSuspense from "./suspense/ProjectListSuspense";
import ProfileSuspense from "./suspense/ProfileSuspense";
import Footer from "./suspense/FooterSuspense";
import Home from "./suspense/HomeSuspense";
import Login from "./suspense/LoginSuspense";
import SignUp from "./suspense/SignUpSuspense";
import OperationManagement from "./suspense/OperationManagementSuspense";
import LawyerManagement from "./suspense/LawyerManagementSuspense";
import OwnerProject from "./suspense/OwnerOperationSuspense";
import Notifications from "./suspense/NotificationSuspense";
import NotificationsPanel from "./suspense/NotificationPanelSuspense";
import Case from "./suspense/CaseSuspense";
import LawyerCase from "./suspense/LawyerCaseSuspense";
import BankAccount from "./suspense/BankAccountSuspense";
import ProjectBuyers from "./suspense/ProjectBuyerSuspense";
import OwnerOperations from "./suspense/OwnerOperatiionsSuspense";
import ApartmentBuyers from "./suspense/ApartmentBuyersSuspense";
import RolesPanel from "./suspense/RolesPanelSuspense";
import Admin from "./suspense/AdminSuspense";
import Lending from "./suspense/LendingSuspense";
import AdminManagerRoles from "./suspense/AdminRolesSuspense";
import AdminManageProjects from "./suspense/AdminManagerProjectsSuspense";
import ProjectManagement from "./suspense/ProjectManagmentSuspense";
import AdminApproveRoles from "./suspense/AdminApproveRolesSuspense";
import OperationHuv from "./suspense/OperationHubSuspense";
import OperationHubV2 from "./../components/operationHub/operationHubWizard";
import OperationHubList from "./../components/operationHub/operationHubList"
import ProjectFullDetails from "./suspense/ProjectFullDetailsSuspense";
import TradeList from "./suspense/TraeeListSuspense";
import Mortgage from "./suspense/MortgageSuspense";
import Holdings from "./suspense/HoldingsSuspense";
import MyLoans from "./suspense/MyLoansSuspense";
import Fees from "./suspense/FeesSuspense";
import UserLedgers from "./suspense/UserLedgerSuspense";
import Mortgages from "./suspense/MortgagesSuspense";
import Investing from "./suspense/InvestingsSuspense";
import Funding from "./suspense/FundingSuspense";
import Auctions from "./suspense/AuctionSuspense";
import ApartmentLegals from "./suspense/ApartmentLegalsSuspense";
import ApartmentLegalsSeller from "./suspense/ApartmentLegalsSellerSuspense";
import Selling from "./suspense/SellingSuspense";
import SingleView from "./suspense/SingleViewSuspense";
import PaymentStatus from "./suspense/PaymentStatusSuspense";
import ProjectMortgages from "./suspense/ProjectMortgagesSuspense";
import UserKyc from "./suspense/UserKycSuspense";
import InitialStep1 from "./suspense/InitialStep1Suspense";
import InitialStep2 from "./suspense/InitialStep2Suspense";
import Wizard from "./suspense/WizardSuspense";
import PropertyLoaderList from "./suspense/PropertyLoaderListSuspense";
import PropertyLoader from "./suspense/PropertyLoaderSuspense";
import Groups from "./suspense/GroupsSuspense";
import firebase from "firebase";

const themeLtr = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  direction: "ltr" // Both here and <body dir="rtl">
});
const themeRtl = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  direction: "rtl" // Both here and <body dir="rtl">
});

function App(props) {
  const { direction, language, activeAccount, cookies, setProjects,user } = props;
  const [init, setInit] = useState(false);
  let findProjects = firebase
    .functions()
    .httpsCallable("projects/findProjects");

  const theme = direction === "ltr" ? themeLtr : themeRtl;
  useEffect(() => {
    if (!init) {
      findProjects('').then(result => {
        setProjects(result.data);
      });
    }
    setInit(true);
  }, [init]);
  useEffect(() => {
    if (language === "He") {
      i18next.changeLanguage("il");
    } else {
      i18next.changeLanguage("en");
    }
  }, [language, direction]);

  useEffect(() => {
    if ((activeAccount && activeAccount.broker) || (user && user.broker)) {
      let brokerCookie = cookies.get("brokerId");
      if (!brokerCookie) {
        cookies.set("brokerId", activeAccount.user_id, {
          path: "/",
          expires: new Date(new Date().getTime() + 432000000)
        });
      }
    }
  }, [activeAccount, cookies, user]);
  loadReCaptcha();
  return (
    <MuiThemeProvider theme={theme}>
      <div dir={direction} style={{ backgroundColor: "white" }}>
        <Route
          render={() => (
            <AppHeader
              history={props.history}
              t={props.t}
              cookies={cookies}
              location={props.location}
            />
          )}
        />
        <Route path="/login" render={() => <Login t={props.t} />} />
        <Route
          path="/signUp"
          render={() => (
            <SignUp
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
        path="/myGroups"
        render={() => (
          <MyProjectGroups  
            history={props.history}
            location={props.location}
            t={props.t}
          />
        )}
      />
        
        <Route
          path="/operationManagement"
          render={() => (
            <OperationManagement
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/operationLawyerManagement"
          render={() => (
            <LawyerManagement
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          exact
          path="/"
          render={() => (
            <Home
              history={props.history}
              match={props.match}
              cookies={cookies}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
        exact
        path="/broker/:brokerToken"
        render={() => (
          <Home
            history={props.history}
            match={props.match}
            cookies={cookies}
            location={props.location}
            t={props.t}
          />
        )}
      />
        <Route
          path="/projects"
          render={() => (
            <ProjectListSuspense
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/profile"
          render={() => (
            <ProfileSuspense
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/operationOwnedAsset"
          render={() => (
            <OwnerProject
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/notifications"
          render={() => (
            <Notifications
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/notificationMessage/:notificationId"
          render={() => (
            <NotificationsPanel
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/editCase/:caseId"
          render={() => (
            <Case
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/lawyerCase/:caseId"
          render={() => (
            <LawyerCase
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/manageBankAccount/:caseId"
          render={() => (
            <BankAccount
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/manageProjectBuyers/:caseId"
          render={() => (
            <ProjectBuyers
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/manageBuyersOffers/:projectId"
          render={() => (
            <OwnerOperations
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/manageApartmentBuyers/:caseId"
          render={() => (
            <ApartmentBuyers
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/userRole/:roleId"
          render={() => (
            <RolesPanel
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/addRole"
          render={() => (
            <RolesPanel
              history={props.history}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route path="/admin" render={() => <Admin t={props.t} />} />

        <Route
          path="/adminRoles"
          render={() => (
            <AdminManagerRoles
              t={props.t}
              history={props.history}
              match={props.match}
              location={props.location}
            />
          )}
        />

        <Route
          path="/adminManageProjects"
          render={() => (
            <AdminManageProjects
              t={props.t}
              history={props.history}
              match={props.match}
              location={props.location}
            />
          )}
        />

        <Route
          path="/manageProject/:project"
          render={() => (
            <ProjectManagement
              t={props.t}
              history={props.history}
              match={props.match}
              location={props.location}
            />
          )}
        />

        <Route
          path="/adminRolesApprove/:requestId"
          render={() => (
            <AdminApproveRoles
              t={props.t}
              history={props.history}
              match={props.match}
              location={props.location}
            />
          )}
        />

        <Route
          exact
          path="/lending"
          render={() => (
            <Lending
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/lending/:projectAddress"
          render={() => (
            <Lending
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/projectsView/:projectAddress"
          render={() => (
            <ProjectFullDetails
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/trades"
          render={() => (
            <TradeList
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/trades/:projectAddress"
          render={() => (
            <TradeList
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route path="/mortgage" render={() => <Mortgage t={props.t} />} />
        <Route
          path="/holdings"
          render={() => (
            <Holdings
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/myLoans"
          render={() => (
            <MyLoans
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/Fees"
          render={() => (
            <Fees
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/Develop"
          render={() => (
            <Test
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/userLedger"
          render={() => (
            <UserLedgers
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/mortgages"
          render={() => (
            <Mortgages
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/investing/:projectAddress"
          render={() => (
            <Investing
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/funding/:projectAddress"
          render={() => (
            <Funding
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/auction/:projectAddress"
          render={() => (
            <Auctions
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/apartmentLegals/:projectAddress"
          render={() => (
            <ApartmentLegals
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/apartmentLegalsSeller/:projectAddress"
          render={() => (
            <ApartmentLegalsSeller
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/selling/:projectAddress"
          render={() => (
            <Selling
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/singleProject/:projectAddress"
          render={() => (
            <SingleView
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/paymentStatus/:status/:productName/:productId"
          render={() => (
            <PaymentStatus
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/projectMortgages/:projectAddress"
          render={() => (
            <ProjectMortgages
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/userKyc/:projectAddress"
          render={() => (
            <UserKyc
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/initialStep1/:projectAddress"
          render={() => (
            <InitialStep1
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/initialStep2/:projectAddress"
          render={() => (
            <InitialStep2
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/wizard/:formName"
          render={() => (
            <Wizard
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/propertyLoader/"
          render={() => (
            <PropertyLoaderList
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />

        <Route
          path="/editPropertyLoader/:id"
          render={() => (
            <PropertyLoader
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/addPropertyLoader/"
          render={() => (
            <PropertyLoader
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
          path="/operationHub/"
          render={() => (
            <OperationHuv
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />
        <Route
        path="/operationHubV2/"
        render={() => (
          <OperationHubV2
            history={props.history}
            match={props.match}
            location={props.location}
            t={props.t}
          />
        )}
      />

      <Route
        path="/operationHubList/"
        render={() => (
          <OperationHubList
            history={props.history}
            match={props.match}
            location={props.location}
            t={props.t}
          />
        )}
      />

      

        
        <Route
          path="/groups/:projectAddress"
          render={() => (
            <Groups
              history={props.history}
              match={props.match}
              location={props.location}
              t={props.t}
            />
          )}
        />


        <Route
          render={() => (
            <Footer
              history={props.history}
              t={props.t}
              location={props.location}
            />
          )}
        />
      </div>
    </MuiThemeProvider>
  );
}

const mapStateToProps = state => ({
  user: state.login.user,
  init: state.mortgage.init,
  activeAccount: state.userAccounts.activeAccount,
  language: state.userProfileReducer.lang,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  getMyMortgages,
  syncUserState,
  setProjects
};

export { App };
export default withCookies(
  translate("common")(connect(mapStateToProps, mapDispatchToProps)(App))
);
