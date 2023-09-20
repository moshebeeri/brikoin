import { fork } from "redux-saga/effects";

import login from "./login";
import messaging from "./messaging";
import registrar from "./registrarSaga";
import payment from "./payment";
import property from "./propertySaga";
import accounts from "./accountsSaga";
import manager from "./managerSaga";
import listSaga from "./listSaga";
import groupsSaga from "./groupsSaga";
import trustee from "./trusteeSaga";
import operationHubSaga from "./operationHubSaga";
import orderSaga from "./orderSaga";
import propertyLoaderSaga from "./propertyLoaderSaga";
import documentsOperationSaga from "./documentsOperationSaga";
import ledgerSaga from "./ledgerSaga";
import projectTradesStatsSaga from "./projectTradesStatsSaga";
import estimation from "./estimationSaga";
import organizationSaga from "./organizationSaga";
import addressSaga from "./addressSaga";
import project from "./projectSaga";
import admin from "./adminSaga";
import casesSaga from "./casesSaga";
import userRolesSaga from "./userRolesSaga";
import notificationsSaga from "./notificationsSaga";
import mortgage from "./mortgageSaga";
import trusteeManagmentSaga from "./trusteeManagmentSaga";
import terms from "./termsSaga";
import inputForm from "./inputFormSaga";
import syncProjectStats from "./syncProjectStats";
import eventsOperationSaga from "./eventsOperationSaga";
import sendMailSega from "./sendMailSega";
import tradeSaga from "./tradeSaga";

export default function* rootSaga() {
  yield [
    fork(accounts),
    fork(ledgerSaga),
    fork(projectTradesStatsSaga),
    fork(inputForm),
    fork(listSaga),
    fork(admin),
    //  fork(tradeSaga),
    fork(userRolesSaga),
    fork(casesSaga),
    fork(trusteeManagmentSaga),
    fork(documentsOperationSaga),
    fork(notificationsSaga),
    fork(syncProjectStats),
    fork(login),
    fork(organizationSaga),
    fork(orderSaga),
    fork(propertyLoaderSaga),
    fork(groupsSaga),
    fork(sendMailSega),
    fork(operationHubSaga),
    fork(mortgage),
    fork(eventsOperationSaga),
    // fork(messaging),
    fork(addressSaga),
    fork(property),
    fork(terms),
    fork(payment),
    fork(registrar),
    fork(project),
    fork(manager),
    fork(estimation),
    fork(trustee)
  ];
}
