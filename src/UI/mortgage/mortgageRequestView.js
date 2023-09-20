import React, { useState } from "react";
import { GenericForm } from "../../UI/index";
import currencyUtils from "../../utils/currencyUtils";

const MORTGAGE_REQUEST = {
  approved: "readOnly-text-boolean",
  interestRate: "readOnly-text",
  downPayment: "readOnly-text-number",
  loanAmount: "readOnly-text-number",
  mortgageType: "readOnly-text",
  yearsNumber: "readOnly-text"
};

const MORTGAGE_REQUEST_NO_APPROVE = {
  interestRate: "readOnly-text",
  downPayment: "readOnly-text-number",
  loanAmount: "readOnly-text-number",
  mortgageType: "readOnly-text",
  yearsNumber: "readOnly-text"
};

export default function MortgageRequestView(props) {
  const [state, setState] = useState({});
  let detailRequest = props.request;
  detailRequest.loanAmount = props.request.amount;
  detailRequest.yearsNumber = props.request.years;
  detailRequest.interestRate =
    props.request.mortgageType.includes("FIXED") > 0
      ? props.request.interestRateFixed
      : props.request.armInterestRate;
  const SYMBOLS = {
    interestRate: "%",
    downPayment: currencyUtils.currencyCodeToSymbol(props.project.currency),
    loanAmount: currencyUtils.currencyCodeToSymbol(props.project.currency)
  };
  return (
    <div>
      <GenericForm
        entity={detailRequest}
        symbols={SYMBOLS}
        state={state}
        setState={setState.bind(this)}
        t={props.t}
        entityDescriptor={
          props.removeApprove ? MORTGAGE_REQUEST_NO_APPROVE : MORTGAGE_REQUEST
        }
        buttonTitle={"Submit Project"}
      />
    </div>
  );
}
