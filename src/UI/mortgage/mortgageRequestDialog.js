import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import MortgagePayment from "./mortgagePayments";
import { calculateMortgage } from "../../redux/actions/mortgage";
import MortgageRequestView from "./mortgageRequestView";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import LoadingCircular from "../../UI/loading/LoadingCircular";
class MortgageRequestDialog extends React.Component {
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
            {this.state.showCalcSpinner && <LoadingCircular />}
            <MortgageRequestView
              t={this.props.t}
              request={request}
              project={project}
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
  payments: state.mortgage.payments
});
const mapDispatchToProps = {
  calculateMortgage
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(MortgageRequestDialog)
);
