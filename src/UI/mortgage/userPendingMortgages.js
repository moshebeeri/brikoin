import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import { GenericForm } from "../../UI/index";
import currencyUtils from "../../utils/currencyUtils";
import MortgagePayment from "./mortgagePayments";
import { calculateMortgage } from "../../redux/actions/mortgage";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import LoadingCircular from "../../UI/loading/LoadingCircular";
const MORTGAGE_REQUEST = {
  approved: "readOnly-text-boolean",
  interestRate: "readOnly-text",
  downPayment: "readOnly-text-number",
  loanAmount: "readOnly-text-number",
  mortgageType: "readOnly-text",
  yearsNumber: "readOnly-text"
};

class UserPendingMortgages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCalcSpinner: false
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    return this.renderDialog();
  }

  renderDialog() {
    const { open, handleClose, request, project } = this.props;
    let detailRequest = request;
    detailRequest.loanAmount = request.amount;
    detailRequest.yearsNumber = request.years;
    detailRequest.interestRate =
      request.mortgageType.includes("FIXED") > 0
        ? request.interestRateFixed
        : request.armInterestRate;
    const SYMBOLS = {
      interestRate: "%",
      downPayment: currencyUtils.currencyCodeToSymbol(project.currency),
      loanAmount: currencyUtils.currencyCodeToSymbol(project.currency)
    };
    return (
      <div>
        <MortgagePayment t={this.props.t} />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.props.t("Mortgage Request Details")}
          </DialogTitle>
          <DialogContent>
            {this.state.showCalcSpinner && <LoadingCircular open />}
            <GenericForm
              entity={detailRequest}
              symbols={SYMBOLS}
              state={this.state}
              setState={this.setState.bind(this)}
              t={this.props.t}
              entityDescriptor={MORTGAGE_REQUEST}
              buttonTitle={"Submit Project"}
            />
            {this.actions()}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  actions() {
    const { classes } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginTop: 10,
          width: "100%",
          justifyContent: "center"
        }}
      >
        <Button
          onClick={this.calculate.bind(this)}
          fullWidth
          variant="outlined"
          className={classes.button}
        >
          {this.props.t("calculate")}
        </Button>
      </div>
    );
  }

  componentDidUpdate() {
    const { payments } = this.props;
    if (
      payments &&
      this.state.showCalcSpinner &&
      Object.keys(payments).length > 0
    ) {
      this.setState({ showCalcSpinner: false });
    }
  }

  calculate() {
    const { calculateMortgage, request } = this.props;
    let mortgageCondition = {
      mortgageType: request.mortgageType,
      armInterestRate: request.interestRateArm,
      interestRateFixed: request.interestRateFixed,
      amount: request.amount,
      years: request.years
    };
    calculateMortgage(mortgageCondition);
    this.setState({
      showCalcSpinner: true
    });
  }
}

const mapStateToProps = (state, props) => ({
  payments: state.mortgage.payments,
  projectMortgagesRequests: state.projectTradesStats.projectMortgagesRequests
});
const mapDispatchToProps = {
  calculateMortgage
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(UserPendingMortgages)
);
