import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { ApproveDialog, GenericList } from "../../UI/index";
import { setCases, setCasesOrders } from "../../redux/actions/case";
import { approveProject } from "../../redux/actions/trusteeManagment";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import { withUser } from "../../UI/warappers/withUser";
import { listenForCases } from "./casesUtils";

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
  bankAccountSum: { type: "number", width: 100 },
  orderSum: { type: "number", width: 100 },
  approvedOrderSum: { type: "number", width: 100 },
  approvedFunds: { type: "number", width: 100 },
  buyers: {
    type: "redirectLink",
    width: 50,
    icon: "users",
    linkParam: "id",
    redirectLink: `/manageProjectBuyers/`
  },
  projectStarted: { type: "checkBox", width: 100 },
  actions: {
    type: "action",
    param: "user",
    width: 110,
    noTitle: true,
    actions: ["projectTargetReached"]
  }
};

function Cases(props) {
  const [showApprove, setShowApprove] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loadingCases, setLoadingCases] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const { cases, lang, projects } = props;
  listenForCases(
    setLoadingCases,
    saveCases.bind(this, props),
    setChanged,
    changed,
    props.user.uid
  );

  if (projects.length === 0) {
    return <div />;
  }
  const rows = createRows(
    props,
    cases,
    lang,
    setShowApprove,
    setSelectedProject
  );
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
          t={props.t}
          columnDescription={LIST_DESCRIPTOR}
          rows={rows}
        />
      )}
      <ApproveDialog
        t={props.t}
        cancelAction={setShowApprove.bind(this, false)}
        processDone={showApprove}
        process={showApprove}
        openDialog={showApprove}
        title={props.t("Project Target Reached")}
        approveAction={projectTargetReached.bind(this, props, selectedProject)}
        approveMessage={props.t("ProjectTargetReachedMsg")}
      />
    </div>
  );
}

function saveCases(props, result) {
  props.setCases(result.cases);
  props.setCasesOrders(result.orders);
}

function createRows(props, cases, lang, setShowApprove, setSelectedProject) {
  return cases
    ? cases
        .filter(currentCase => currentCase.trustee)
        .map(currentCase => {
          createRow(
            props,
            currentCase,
            lang,
            setShowApprove,
            setSelectedProject
          );
          return currentCase;
        })
        .filter(caseInstance => caseInstance)
    : [];
}

function getProject(currentCase, props) {
  const { projects } = props;
  return projects.filter(project => project.id === currentCase.projectId)[0];
}

function createRow(
  props,
  currentCase,
  lang,
  setShowApprove,
  setSelectedProject
) {
  const { pendingOrders } = props;
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const project = getProject(currentCase, props);
  if (!project) {
    return "";
  }
  currentCase.name = project
    ? lang !== "En" && project.lang && project.lang[lang]
      ? project.lang[lang].name
      : project.name
    : "";
  currentCase.projectStarted = project.initTargetReached;
  currentCase.bankAccountSum = 0;
  currentCase.orderSum =
    project &&
    pendingOrders &&
    pendingOrders[project.address] &&
    pendingOrders[project.address].length > 0
      ? pendingOrders[project.address]
          .map(order => order.amount * order.price)
          .reduce(reducer)
      : 0;
  currentCase.approvedOrderSum =
    project &&
    pendingOrders &&
    pendingOrders[project.address] &&
    pendingOrders[project.address].length > 0
      ? pendingOrders[project.address]
          .map(order => (order.reserved ? order.amount * order.price : 0))
          .reduce(reducer)
      : 0;
  currentCase.approvedFunds =
    project &&
    pendingOrders &&
    pendingOrders[project.address] &&
    pendingOrders[project.address].length > 0
      ? pendingOrders[project.address]
          .map(order => (order.fullDeposit ? order.amount * order.price : 0))
          .reduce(reducer)
      : 0;
  currentCase.hideActions = getHideAction(currentCase.approvedFunds, project);
  currentCase.projectTargetReached = projectDoneDialog.bind(
    this,
    project ? project.address : "",
    setSelectedProject,
    setShowApprove
  );
}

function projectDoneDialog(project, setSelectedProject, setShowApprove) {
  setSelectedProject(project);
  setShowApprove(true);
}

function getHideAction(funds, project) {
  if (project.initTargetReached) {
    return ["projectTargetReached"];
  }
  if (parseInt(funds) >= parseInt(project.target)) {
    return [];
  }
  return ["projectTargetReached"];
}

function projectTargetReached(props, selectedProject) {
  const { approveProject } = props;
  approveProject(selectedProject);
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  cases: state.cases.list,
  lang: state.userProfileReducer.lang,
  projects: getAllProject(state, props),
  pendingOrders: state.cases.pendingOrders,
  loaded: state.cases.loaded
});
const mapDispatchToProps = {
  setCases,
  approveProject,
  setCasesOrders
};
export default withUser(connect(mapStateToProps, mapDispatchToProps)(Cases));
