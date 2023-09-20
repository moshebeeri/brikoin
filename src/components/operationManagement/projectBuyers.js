import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { ApproveDialog, GenericList } from "../../UI/index";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import Grid from "@material-ui/core/Grid";
import { listenForDocumentsUser } from "../operationHub/operationUtils";
import {
  approveDownPayment,
  approveFullFund,
  approvePendingOrder,
  cancelAllOrder,
  withdrawANoReserved,
  withdrawProjectFunds
} from "../../redux/actions/trusteeManagment";
import numberUtils from "../../utils/numberUtils";
import currencyUtils from "../../utils/currencyUtils";
import { format } from "../../utils/stringUtils";
import { setCases, setCasesOrders } from "../../redux/actions/case";
import { listenForCases } from "./casesUtils";
import { withUser } from "../../UI/warappers/withUser";

const LIST_DESCRIPTOR = {
  user: { type: "user", width: 250 },
  kycDocument: {
    type: "fileDownload",
    width: 80,
    icon: "document",
    category: "legalDocument"
  },
  legal: {
    type: "fileDownload",
    width: 80,
    icon: "document",
    category: "legalDocument"
  },
  transferReserved: {
    type: "fileDownload",
    width: 100,
    icon: "document",
    category: "legalDocument"
  },
  transferFirstPayment: {
    type: "fileDownload",
    width: 100,
    icon: "document",
    category: "legalDocument"
  },
  amount: { type: "number", width: 70 },
  reserved: { type: "checkBox", width: 55 },
  fullDeposit: { type: "checkBox", width: 55 },
  orderApproved: { type: "checkBox", width: 55 },
  actions: {
    type: "action",
    param: "user",
    width: 220,
    noTitle: true,
    actions: [
      "cancelAllOrder",
      "withdrawANoReserved",
      "withdrawProjectFunds",
      "saveReserved",
      "approveFund",
      "approveOrder"
    ]
  }
};

function ProjectBuyers(props) {
  const { cases, loaded, publicUsers, pendingOrders } = props;
  const [withdrawProjectFundsDialog, setWithdrawProjectFundsDialog] = useState(
    false
  );
  const [withdrawANoReservedDialog, setWithdrawANoReservedDialog] = useState(
    false
  );
  const [cancelAllOrderDialog, setCancelAllOrderDialog] = useState(false);
  const [approveOrderDialog, setApproveOrderDialog] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);
  const [approveFund, setApproveFund] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [documents, setDocuments] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [loadingCases, setLoadingCases] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [changed, setChanged] = useState(false);
  listenForCases(
    setLoadingCases,
    saveCases.bind(this, props),
    setChanged,
    changed,
    props.user.uid
  );
  useEffect(() => {
    if (processing) {
      const caseId = getCaseId(props);
      const caseView = cases.filter(
        currentCase => currentCase.id === caseId
      )[0];
      const order = getUserPendingOrder(caseView, pendingOrders, currentUser);
      if (!order) {
        setProcessing(false);
        return;
      }
      if (currentAction === "CancelAllOrder" && order.cancelOrder) {
        setProcessing(false);
      }
      if (currentAction === "ApproveReserved" && order.reserved) {
        setProcessing(false);
      }
      if (currentAction === "ApproveOrder" && order.orderApproved) {
        setProcessing(false);
      }
      if (currentAction === "ApproveFund" && order.fullDeposit) {
        setProcessing(false);
      }
    }
  });
  const caseId = getCaseId(props);
  const caseView = cases.filter(currentCase => currentCase.id === caseId)[0];
  const rows = createRow(
    caseView,
    pendingOrders,
    caseId,
    setCurrentUser,
    setWithdrawProjectFundsDialog,
    setWithdrawANoReservedDialog,
    setCancelAllOrderDialog,
    setApproveOrderDialog,
    setApproveDialog,
    setApproveFund,
    currentAction
  ).filter(row => row);
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
        {renderBuyersTable(publicUsers, rows, props)}
        <ApproveDialog
          t={props.t}
          cancelAction={setWithdrawProjectFundsDialog.bind(this, false)}
          openDialog={withdrawProjectFundsDialog}
          processDone={actionDone.bind(
            this,
            setCurrentUser,
            setWithdrawProjectFundsDialog,
            setCurrentAction
          )}
          process={processing}
          title={props.t("WithdrawProjectFunds")}
          approveAction={approveAction.bind(
            this,
            props.withdrawProjectFunds,
            props,
            currentUser,
            setProcessing,
            "WithdrawProjectFunds",
            setCurrentAction
          )}
          approveMessage={props.t("WithdrawProjectFundsMsg")}
        />
        <ApproveDialog
          t={props.t}
          cancelAction={setWithdrawANoReservedDialog.bind(this, false)}
          openDialog={withdrawANoReservedDialog}
          processDone={actionDone.bind(
            this,
            setCurrentUser,
            setWithdrawANoReservedDialog,
            setCurrentAction
          )}
          title={props.t("WithdrawNoReserved")}
          process={processing}
          approveAction={approveAction.bind(
            this,
            props.withdrawANoReserved,
            props,
            currentUser,
            setProcessing,
            "WithdrawNoReserved",
            setCurrentAction
          )}
          approveMessage={props.t("WithdrawNoReservedMsg")}
        />

        <ApproveDialog
          t={props.t}
          cancelAction={setCancelAllOrderDialog.bind(this, false)}
          openDialog={cancelAllOrderDialog}
          processDone={actionDone.bind(
            this,
            setCurrentUser,
            setCancelAllOrderDialog,
            setCurrentAction
          )}
          process={processing}
          title={props.t("CancelAllOrder")}
          approveAction={approveAction.bind(
            this,
            props.cancelAllOrder,
            props,
            currentUser,
            setProcessing,
            "CancelAllOrder",
            setCurrentAction
          )}
          approveMessage={props.t("CancelAllOrderMsg")}
        />

        <ApproveDialog
          t={props.t}
          cancelAction={setApproveOrderDialog.bind(this, false)}
          openDialog={approveOrderDialog}
          processDone={actionDone.bind(
            this,
            setCurrentUser,
            setApproveOrderDialog,
            setCurrentAction
          )}
          process={processing}
          title={props.t("ApproveOrder")}
          approveAction={approveAction.bind(
            this,
            props.approvePendingOrder,
            props,
            currentUser,
            setProcessing,
            "ApproveOrder",
            setCurrentAction
          )}
          approveMessage={props.t("ApproveOrderMsg")}
        />

        <ApproveDialog
          t={props.t}
          cancelAction={setApproveDialog.bind(this, false)}
          openDialog={approveDialog}
          process={processing}
          processDone={actionDone.bind(
            this,
            setCurrentUser,
            setApproveDialog,
            setCurrentAction
          )}
          title={props.t("ApproveReserved")}
          approveAction={approveAction.bind(
            this,
            props.approveDownPayment,
            props,
            currentUser,
            setProcessing,
            "ApproveReserved",
            setCurrentAction
          )}
          approveMessage={format(props.t("ApproveReservedMsg"), [
            getProjectReservedPrice(props)
          ])}
        />

        <ApproveDialog
          t={props.t}
          cancelAction={setApproveFund.bind(this, false)}
          processDone={actionDone.bind(
            this,
            setCurrentUser,
            setApproveDialog,
            setCurrentAction
          )}
          process={processing}
          approveAction={approveAction.bind(
            this,
            props.approveFullFund,
            props,
            currentUser,
            setProcessing,
            "ApproveFund",
            setCurrentAction
          )}
          openDialog={approveFund}
          title={props.t("ApproveFund")}
          approveMessage={props.t("ApproveFundMsg")}
        />
      </div>
    </div>
  );
}

function renderBuyersTable(publicUsers, rows, props) {
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
            title={"Project Buyers"}
            t={props.t}
            columnDescription={LIST_DESCRIPTOR}
            rows={rows}
          />
        </div>
      </Grid>
    </Grid>
  );
}

function approveAction(
  action,
  props,
  currentUser,
  setProcessing,
  currentAction,
  setCurrentAction
) {
  const { cases, pendingOrders } = props;
  const user = currentUser;
  const caseId = getCaseId(props);
  const caseView = cases.filter(currentCase => currentCase.id === caseId)[0];
  const orderId = getUserPendingOrderId(caseView, pendingOrders, user);
  setProcessing(true);
  setCurrentAction(currentAction);
  action(user, caseView.projectAddress, orderId);
}

function actionDone(setCurrentUser, showAction, setCurrentAction) {
  setCurrentUser("");
  showAction(false);
  setCurrentAction("");
}

function getUserPendingOrderId(caseView, pendingOrders, buyer) {
  const pendingOrder = pendingOrders[caseView.projectAddress]
    ? pendingOrders[caseView.projectAddress].filter(
        order => order.userId === buyer
      )[0]
    : {};
  return pendingOrder.id;
}

function getUserPendingOrder(caseView, pendingOrders, buyer) {
  const pendingOrder = pendingOrders[caseView.projectAddress]
    ? pendingOrders[caseView.projectAddress].filter(
        order => order.userId === buyer
      )[0]
    : {};
  return pendingOrder;
}

function getCaseId(props) {
  return props.location && props.location.pathname.substring(21)
    ? props.location.pathname.substring(21)
    : "";
}

function createRow(
  caseView,
  pendingOrders,
  caseId,
  setCurrentUser,
  setWithdrawProjectFundsDialog,
  setWithdrawANoReservedDialog,
  setCancelAllOrderDialog,
  setApproveOrderDialog,
  setApproveDialog,
  setApproveFund,
  currentAction
) {
  return caseView && caseView.buyers
    ? Object.keys(caseView.buyers).map(key => {
        const buyer = caseView.buyers[key];
        const pendingOrder =
          buyer.offer && pendingOrders[caseView.projectAddress]
            ? pendingOrders[caseView.projectAddress].filter(
                order => order.id === buyer.offer
              )[0]
            : {};
        if (!pendingOrder) {
          return "";
        }
        buyer.id = key;
        if (pendingOrder) {
          buyer.amount = pendingOrder.amount * pendingOrder.price;
          buyer.reserved = pendingOrder.reserved;
          buyer.fullDeposit = pendingOrder.fullDeposit;
          buyer.orderApproved = pendingOrder.orderApproved;
          buyer.hideActions = getHideActions(pendingOrder, currentAction);
        }
        buyer.caseId = caseId;
        buyer.legal = buyer.legalDocument;
        buyer.saveReserved = handleAction.bind(
          this,
          buyer.user,
          setCurrentUser,
          setApproveDialog
        );
        buyer.approveFund = handleAction.bind(
          this,
          buyer.user,
          setCurrentUser,
          setApproveFund
        );
        buyer.approveOrder = handleAction.bind(
          this,
          buyer.user,
          setCurrentUser,
          setApproveOrderDialog
        );
        buyer.cancelAllOrder = handleAction.bind(
          this,
          buyer.user,
          setCurrentUser,
          setCancelAllOrderDialog
        );
        buyer.withdrawANoReserved = handleAction.bind(
          this,
          buyer.user,
          setCurrentUser,
          setWithdrawANoReservedDialog
        );
        buyer.withdrawProjectFunds = handleAction.bind(
          this,
          buyer.user,
          setCurrentUser,
          setWithdrawProjectFundsDialog
        );
        return buyer;
      })
    : [];
}

function getHideActions(pendingOrder, currentAction) {
  let hideOrders = [];
  if (currentAction) {
    return [
      "approveFund",
      "cancelAllOrder",
      "withdrawANoReserved",
      "withdrawProjectFunds",
      "approveOrder",
      "saveReserved"
    ];
  }
  if (pendingOrder.cancelOrder) {
    return ["saveReserved", "approveFund", "cancelAllOrder", "approveOrder"];
  }
  if (!pendingOrder.reserved) {
    return [
      "approveFund",
      "cancelAllOrder",
      "withdrawANoReserved",
      "withdrawProjectFunds",
      "approveOrder"
    ];
  }
  if (!pendingOrder.fullDeposit) {
    return [
      "saveReserved",
      "cancelAllOrder",
      "withdrawANoReserved",
      "withdrawProjectFunds",
      "approveOrder"
    ];
  }
  if (!pendingOrder.orderApproved) {
    return [
      "saveReserved",
      "approveFund",
      "withdrawANoReserved",
      "withdrawProjectFunds"
    ];
  }
  if (pendingOrder.orderApproved) {
    return [
      "saveReserved",
      "approveFund",
      "withdrawANoReserved",
      "withdrawProjectFunds",
      "approveOrder"
    ];
  }
  return hideOrders;
}

function getProjectReservedPrice(props) {
  const { projects, cases } = props;
  if (!projects) {
    return 0;
  }
  const caseId = getCaseId(props);
  const caseView = cases.filter(currentCase => currentCase.id === caseId)[0];
  const currentProject = projects.filter(
    project => project.id === caseView.projectId
  );
  if (!currentProject || currentProject.length === 0) {
    return 0;
  }
  const reservedBid = currentProject[0].reservedBid
    ? parseInt(currentProject[0].reservedBid) / 1000000
    : 0;
  return (
    numberUtils.formatNumber(reservedBid, 0) +
    currencyUtils.currencyCodeToSymbol(currentProject[0].currency)
  );
}

function saveCases(props, result) {
  props.setCases(result.cases);
  props.setCasesOrders(result.orders);
}

function handleAction(user, setCurrentUser, showAction) {
  setCurrentUser(user);
  showAction(true);
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  cases: state.cases.list,
  lang: state.userProfileReducer.lang,
  publicUsers: state.userAccounts.publicUUsers,
  projects: getPopulatedProjects(state, props),
  pendingOrders: state.cases.pendingOrders,
  change: state.trades.change,
  loaded: state.cases.loaded
});
const mapDispatchToProps = {
  approveDownPayment,
  approveFullFund,
  approvePendingOrder,
  cancelAllOrder,
  withdrawANoReserved,
  withdrawProjectFunds,
  setCases,
  setCasesOrders
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(ProjectBuyers)
);
