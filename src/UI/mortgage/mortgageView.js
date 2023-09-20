import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import MortgagePayment from "./mortgagePayments";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import CardMedia from "@material-ui/core/CardMedia";
import { askMortgage, calculateMortgage } from "../../redux/actions/mortgage";
import { connect } from "react-redux";
import LoadingCircular from "../../UI/loading/LoadingCircular";
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300
  },
  textField: {
    width: 100,
    margin: theme.spacing.unit
  },
  textFieldDownPayment: {
    width: 140,
    margin: theme.spacing.unit
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  media: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    width: 100
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3
  },
  button: {
    width: 110,
    marginTop: 10,
    height: 30
  },
  button2: {
    width: 110,
    height: 30
  }
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class MortgageView extends React.Component {
  state = {
    name: [],
    selected: false,
    showCalcSpinner: false,
    amount: 0
  };
  handleChange = name => event => {
    const { mortgage } = this.props;
    if (name === "downPayment") {
      this.setState({
        downPayment: event.target.value,
        amount:
          (100 * parseInt(event.target.value)) /
            parseInt(mortgage.downPayment) -
          event.target.value
      });
    } else {
      this.setState({
        [name]: event.target.value
      });
    }
  };

  calculate() {
    const { calculateMortgage, mortgage } = this.props;
    if (this.state.amount && this.state.mortgageType) {
      let mortgageCondition = {
        mortgageType: this.state.mortgageType,
        armInterestRate: mortgage.interestRateArm,
        interestRateFixed: mortgage.interestRateFixed,
        amount: this.state.amount,
        years: this.state.years
          ? this.state.years
          : this.getYears(this.state.mortgageType)
      };
      calculateMortgage(mortgageCondition);
      this.setState({
        showCalcSpinner: true
      });
    }
  }

  getYears(mortgageType) {
    switch (mortgageType) {
      case "FIXED10":
        return 10;
      case "FIXED15":
        return 15;
      case "FIXED20":
        return 20;
      default:
        return 1;
    }
  }

  askMortgage() {
    const { askMortgage, mortgage, project, user, process } = this.props;
    // TODO validate terms
    if (this.state.amount && this.state.mortgageType) {
      let years = this.state.mortgageType === "FIXED10" ? 10 : 0;
      years = this.state.mortgageType === "FIXED15" ? 10 : years;
      let mortgageRequest = {
        mortgageType: this.state.mortgageType,
        downPayment: this.state.downPayment,
        project: project.address,
        armInterestRate: mortgage.interestRateArm,
        interestRateFixed: mortgage.interestRateFixed,
        mortgageConditionAddress: mortgage.mortgageConditionAddress,
        amount: this.state.amount,
        user: user.uid,
        mortgageId: mortgage.mortgageId,
        mortgagee: mortgage.userAccount,
        active: true,
        years: this.state.years ? this.state.years : years
      };
      askMortgage(mortgageRequest);
      if (process) {
        process(true);
      }
    }
  }

  render() {
    const { classes, mortgage, logos } = this.props;
    const arm10 = mortgage.ARM10 ? "ARM10" + "," : "";
    const arm3 = mortgage.ARM3 ? "ARM3" + "," : "";
    const arm5 = mortgage.ARM5 ? "ARM5" + "," : "";
    const arm7 = mortgage.ARM7 ? "ARM7" + "," : "";
    const fixed10 = mortgage.FIXED10 ? "FIXED10" + "," : "";
    const fixed15 = mortgage.FIXED15 ? "FIXED15" : "";
    const mortgageTypes = arm10 + arm3 + arm5 + arm7 + fixed10 + fixed15;
    const mortgageTypesArr = mortgageTypes.split(",");
    const availableFounds =
      parseInt(mortgage.avalibaleFounds) > parseInt(mortgage.maxMortgage)
        ? parseInt(mortgage.maxMortgage)
        : parseInt(mortgage.avalibaleFounds);
    let maxYears = [];
    for (let i = 1; i <= parseInt(mortgage.maxYears); i++) {
      maxYears.push(i);
    }
    const logo = logos[mortgage.user];
    const hideYears =
      this.state.mortgageType === "FIXED10" ||
      this.state.mortgageType === "FIXED15";
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {this.mortgageTerms(logo, classes, mortgage, availableFounds)}

        <MortgagePayment t={this.props.t} />
        <div className={classes.root}>
          {this.mortgageTypeSelector(classes, mortgageTypesArr)}
          {this.amount(availableFounds, classes)}
          <TextField
            label={
              this.props.t("downPayment") + " " + mortgage.downPayment + "%"
            }
            id="downPayment"
            className={classes.textFieldDownPayment}
            onChange={this.handleChange("downPayment")}
            margin="normal"
            fullWidth
            type="number"
            value={this.state.downPayment}
          />
          ־{!hideYears && this.yearsSelector(classes, maxYears)}
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {this.state.showCalcSpinner && <LoadingCircular open />}
        </div>
        {this.actions(classes)}
      </div>
    );
  }

  yearsSelector(classes, maxYears) {
    return (
      <FormControl className={classes.formControl}>
        {!this.state.years ? (
          <InputLabel htmlFor="select-multiple">
            {this.props.t("years")}
          </InputLabel>
        ) : (
          <InputLabel variant={"outlined  "} />
        )}
        <Select
          value={this.state.years}
          onChange={this.handleChange("years")}
          input={<Input id="select-multiple" />}
          MenuProps={MenuProps}
        >
          {maxYears.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  actions(classes) {
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
        <Button
          onClick={this.askMortgage.bind(this)}
          fullWidth
          variant="outlined"
          className={classes.button}
        >
          {this.props.t("Check Entitlement")}
        </Button>
      </div>
    );
  }

  amount(availableFounds, classes) {
    return (
      <TextField
        label={this.props.t("Loan Amount")}
        id="amount"
        inputProps={{ min: 0, max: availableFounds, step: 10 }}
        className={classes.textField}
        onChange={this.handleChange("amount")}
        margin="normal"
        fullWidth
        disabled={true}
        type="number"
        value={this.state.amount}
      />
    );
  }

  mortgageTypeSelector(classes, mortgageTypesArr) {
    return (
      <FormControl className={classes.formControl}>
        {!this.state.mortgageType ? (
          <InputLabel>{this.props.t("mortgageType")}</InputLabel>
        ) : (
          <InputLabel />
        )}
        <Select
          value={this.state.mortgageType}
          onChange={this.handleChange("mortgageType")}
          input={<Input id="select-multiple" />}
          MenuProps={MenuProps}
        >
          {mortgageTypesArr.map(mortgageType => (
            <MenuItem key={mortgageType} value={mortgageType}>
              {this.props.t(mortgageType)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  mortgageTerms(logo, classes, mortgage, availableFounds) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {logo && (
          <CardMedia
            image={logo}
            className={classes.media}
            title="Contemplative Reptile"
          />
        )}
        <div style={{ fontWeight: "bold" }}>
          {this.props.t("fixedInterest")} : {mortgage.interestRateFixed}%
        </div>
        <div style={{ marginLeft: 10, marginRight: 10, fontWeight: "bold" }}>
          {this.props.t("changingRate")} : {mortgage.interestRateArm}%
        </div>
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

  componentDidMount() {
    window.scrollTo(0, 0);
  }
}

MortgageView.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, props) => ({
  user: state.login.user,
  logos: state.userAccounts.usersLogos,
  payments: state.mortgage.payments
});
const mapDispatchToProps = {
  askMortgage,
  calculateMortgage
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MortgageView)
);
