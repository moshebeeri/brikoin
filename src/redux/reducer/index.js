import { combineReducers } from "redux";
import { firebaseReducer as firebase } from "react-redux-firebase";
import login from "./login";
import main from "./main";
import groups from "./groups";
import messaging from "./messaging";
import registrars from "./registrars";
import trustees from "./trustees";
import loadingProperties from "./loadingProperties";
import userProfileReducer from "./userProfileReducer";
import storage from "./storage";
import managers from "./managers";
import payments from "./payments";
import documentOperaions from "./documentOperaions";
import trusteesManagment from "./trusteesManagment";
import addressInput from "./addressInput";
import estimations from "./estimations";
import userLedger from "./userLedger";
import userAccounts from "./userAccounts";
import { mortgage } from "./mortgage";
import { projectTradesStats } from "./projectTradesStats";
import properties from "./properties";
import projects from "./projects";
import cases from "./cases";
import userRoles from "./userRoles";
import notifications from "./notifications";
import terms from "./terms";
import admin from "./admin";
import blockChainKeys from "./blockChainKeys";
import inputForms from "./inputFormReducer";
import trades from "./trades";
import submitForm from "./submitForm";
import { routerReducer } from "react-router-redux";

export default combineReducers({
  login,
  routerReducer,
  main,
  mortgage,
  groups,
  submitForm,
  payments,
  userAccounts,
  trusteesManagment,
  projectTradesStats,
  trades,
  projects,
  blockChainKeys,
  messaging,
  userLedger,
  inputForms,
  addressInput,
  registrars,
  documentOperaions,
  userProfileReducer,
  storage,
  trustees,
  managers,
  loadingProperties,
  estimations,
  terms,
  properties,
  userRoles,
  cases,
  notifications,
  admin,
  firebase,
});
