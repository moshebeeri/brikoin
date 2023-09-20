import React, { useEffect, useReducer, useState } from "react";
import { GenericList } from "../../UI/index";
import { calculateMortgage } from "../../redux/actions/mortgage";
import MortgagePayment from "../../UI/mortgage/mortgagePayments";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { connect } from "react-redux";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { listenForMortgages } from "../../UI/mortgage/mortgageUtils";

const LIST_DESCRIPTOR = {
  projectName: {
    type: "redirectLink",
    width: 200,
    linkParam: "projectAddress",
    labelField: "projectName",
    noTitle: true,
    redirectLink: `/projectsView/`
  },
  loanAmount: { type: "number", width: 100 },
  downPayment: { type: "number", width: 100 },
  approved: { type: "checkBox", width: 50 },
  rejected: { type: "checkBox", width: 50 },
  mortgageType: { type: "text", width: 200 },
  actions: {
    type: "action",
    param: "key",
    width: 200,
    noTitle: true,
    actions: ["calculate"]
  }
};

function MortgagePendingRows(props) {
  const [rows, setRows] = useState({});
  const [spinner, setSpinner] = useState(false);
  listenForMortgages(setRows, props);
  useEffect(() => {
    if (spinner && Object.keys(props.payments).length > 0) {
      setSpinner(false);
    }
  }, [props.payments]);
  return (
    <div>
      <div style={{ position: "relative", top: 100 }}>
        {spinner && <LoadingCircular open />}
      </div>
      {rows && rows.length > 0 ? (
        createPendingRowsTable(rows, props, setSpinner)
      ) : (
        <div></div>
      )}
      <MortgagePayment t={props.t} />
    </div>
  );
}

function calculateAction(request, setSpinner, dispatch, key) {
  let mortgageCondition = {
    mortgageType: request.mortgageType,
    armInterestRate: request.interestRateArm,
    interestRateFixed: request.interestRateFixed,
    amount: request.amount,
    years: request.years
  };
  dispatch(mortgageCondition);
  setSpinner(true);
}

function createPendingRowsTable(rows, props, setSpinner) {
  const presentationRows = rows.map(row => {
    if (row.key) {
      return {
        projectName: row.project.name,
        key: row.key,
        projectAddress: row.project.address,
        loanAmount: row.amount,
        approved: row.approved,
        rejected: !row.active && !row.approved,
        downPayment: row.downPayment,
        mortgageType: props.t(row.mortgageType),
        calculate: calculateAction.bind(
          this,
          row,
          setSpinner,
          props.calculateMortgage
        )
      };
    }
    return "";
  });
  return (
    <GenericList
      title={"Pending Funding Requests"}
      t={props.t}
      columnDescription={LIST_DESCRIPTOR}
      rows={presentationRows.filter(row => row)}
    />
  );
}

const mapStateToProps = (state, props) => ({
  payments: state.mortgage.payments,
  user: state.login.user,
  projects: getPopulatedProjects(state, props)
});
const mapDispatch = {
  calculateMortgage
};
export default connect(mapStateToProps, mapDispatch)(MortgagePendingRows);
