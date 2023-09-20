import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import { tradeBidWithMortgage } from "../../redux/actions/trade";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20
  },
  details: {
    alignItems: "center"
  },
  column: {
    flexBasis: "33.33%"
  },
  textField: {
    width: 200
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  }
});

class MortgagePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }
  investWithMortgage() {
    const {
      projectAddress,
      user,
      tradeBidWithMortgage,
      mortgageCondition,
      activeAccount
    } = this.props;
    let mortgageBid = {};
    mortgageBid.projectId = projectAddress;
    mortgageBid.side = "bid";
    mortgageBid.isMortgage = "true";
    mortgageBid.price = this.state.limit ? this.state.limit : 1;
    mortgageBid.mortgageeAddress = mortgageCondition.userAccount;
    mortgageBid.maxMortgage = mortgageCondition.maxMortgage;
    mortgageBid.user = user.uid;
    mortgageBid.mortgageePayment = this.state.amount;
    mortgageBid.downPayment = this.state.downPayment;
    mortgageBid.downPaymentPercent = mortgageCondition.downPayment;
    mortgageBid.size =
      parseInt(this.state.amount) + parseInt(this.state.downPayment);
    mortgageBid.startDate = new Date().getTime();
    mortgageBid.time = new Date().getTime();
    mortgageBid.userAccount = activeAccount.accountId;
    switch (this.state.mortgageType) {
      case "ARM3":
        mortgageBid.interestRate = mortgageCondition.interestRateArm;
        mortgageBid.adjustFixedRateMonths = 36;
        mortgageBid.adjustIntervalMonths = 12;
        mortgageBid.adjustInitialCap = 0.25;
        mortgageBid.adjustPeriodicCap = 0.25;
        mortgageBid.adjustLifetimeCap = 10;
        mortgageBid.loanTermMonths = this.state.mortgageYears * 12;
        break;
      case "ARM5":
        mortgageBid.interestRate = mortgageCondition.interestRateArm;
        mortgageBid.adjustFixedRateMonths = 60;
        mortgageBid.adjustIntervalMonths = 12;
        mortgageBid.adjustInitialCap = 0.25;
        mortgageBid.adjustPeriodicCap = 0.25;
        mortgageBid.adjustLifetimeCap = 10;
        mortgageBid.loanTermMonths = this.state.mortgageYears * 12;
        break;
      case "ARM7":
        mortgageBid.interestRate = mortgageCondition.interestRateArm;
        mortgageBid.adjustFixedRateMonths = 84;
        mortgageBid.adjustIntervalMonths = 12;
        mortgageBid.adjustInitialCap = 0.25;
        mortgageBid.adjustPeriodicCap = 0.25;
        mortgageBid.adjustLifetimeCap = 10;
        mortgageBid.loanTermMonths = this.state.mortgageYears * 12;
        break;
      case "ARM10":
        mortgageBid.interestRate = mortgageCondition.interestRateArm;
        mortgageBid.adjustFixedRateMonths = 120;
        mortgageBid.adjustIntervalMonths = 12;
        mortgageBid.adjustInitialCap = 0.25;
        mortgageBid.adjustPeriodicCap = 0.25;
        mortgageBid.adjustLifetimeCap = 10;
        mortgageBid.loanTermMonths = this.state.mortgageYears * 12;
        break;
      case "FIXED10":
        mortgageBid.interestRate = mortgageCondition.interestRateFixed;
        mortgageBid.adjustFixedRateMonths = 120;
        mortgageBid.adjustIntervalMonths = 12;
        mortgageBid.adjustInitialCap = 0.25;
        mortgageBid.adjustPeriodicCap = 0.25;
        mortgageBid.loanTermMonths = 120;
        break;
      case "FIXED15":
        mortgageBid.interestRate = mortgageCondition.interestRateFixed;
        mortgageBid.adjustFixedRateMonths = 180;
        mortgageBid.adjustIntervalMonths = 0;
        mortgageBid.adjustInitialCap = 0;
        mortgageBid.adjustPeriodicCap = 0;
        mortgageBid.loanTermMonths = 180;
        break;
    }
    tradeBidWithMortgage(mortgageBid);
  }

  render() {
    const { classes, mortgageCondition, showBid } = this.props;
    let maxYearsString =
      "Mortgage period,  up to " + mortgageCondition.maxYears + " years";
    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.column}>
              <Typography className={classes.heading}>
                Mortgage funds: {mortgageCondition.avalibaleFounds}
              </Typography>
            </div>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>
                Conditions
              </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <div className={classes.column}>
              {(this.state.mortgageType === "ARM3" ||
                this.state.mortgageType === "ARM5" ||
                this.state.mortgageType === "ARM7" ||
                this.state.mortgageType === "ARM10") && (
                <TextField
                  label={maxYearsString}
                  id="mortgageYears"
                  className={classes.textField}
                  onChange={this.handleChange("mortgageYears")}
                  margin="normal"
                  fullWidth
                  type="number"
                  value={this.state.mortgageYears}
                />
              )}
            </div>

            <div className={classes.column}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name="mortgageType"
                  aria-label="mortgageType"
                  value={this.state.mortgageType}
                  onChange={this.handleChange("mortgageType")}
                >
                  {mortgageCondition.ARM3 && (
                    <FormControlLabel
                      value="ARM3"
                      control={<Radio />}
                      label="ARM 1/3"
                    />
                  )}
                  {mortgageCondition.ARM5 && (
                    <FormControlLabel
                      value="ARM5"
                      control={<Radio />}
                      label="ARM 1/5"
                    />
                  )}
                  {mortgageCondition.ARM7 && (
                    <FormControlLabel
                      value="ARM7"
                      control={<Radio />}
                      label="ARM 1/7"
                    />
                  )}
                  {mortgageCondition.ARM10 && (
                    <FormControlLabel
                      value="ARM10"
                      control={<Radio />}
                      label="ARM 1/10"
                    />
                  )}
                  {mortgageCondition.FIXED10 && (
                    <FormControlLabel
                      value="FIXED10"
                      control={<Radio />}
                      label="Fixed 10 years"
                    />
                  )}
                  {mortgageCondition.FIXED15 && (
                    <FormControlLabel
                      value="FIXED15"
                      control={<Radio />}
                      label="Fixed 15 years"
                    />
                  )}
                </RadioGroup>
              </FormControl>
            </div>
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant="caption">
                Interest Rate ARM:{" "}
                <strong>{mortgageCondition.interestRateArm}%</strong>
                <br />
                Interest Rate Fixed:{" "}
                <strong>{mortgageCondition.interestRateFixed}%</strong>
                <br />
                Minimum down payment:{" "}
                <strong>{mortgageCondition.downPayment}%</strong>
              </Typography>
            </div>
          </ExpansionPanelDetails>
          <Divider />
          <ExpansionPanelActions>
            {showBid && (
              <TextField
                label="Limit"
                id="downPayment"
                className={classes.textField}
                onChange={this.handleChange("limit")}
                margin="normal"
                fullWidth
                type="number"
                value={this.state.limit}
              />
            )}
            <TextField
              label="Down Payment"
              id="downPayment"
              className={classes.textField}
              onChange={this.handleChange("downPayment")}
              margin="normal"
              fullWidth
              type="number"
              value={this.state.downPayment}
            />
            <TextField
              label="Mortgage Amount"
              id="amount"
              className={classes.textField}
              onChange={this.handleChange("amount")}
              margin="normal"
              fullWidth
              type="number"
              value={this.state.amount}
            />
            {showBid ? (
              <Button
                onClick={this.investWithMortgage.bind(this)}
                size="small"
                color="primary"
              >
                Bid with mortgage
              </Button>
            ) : (
              <Button
                onClick={this.investWithMortgage.bind(this)}
                size="small"
                color="primary"
              >
                Invest With mortgage
              </Button>
            )}
          </ExpansionPanelActions>
        </ExpansionPanel>
      </div>
    );
  }
}

MortgagePreview.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount
});

const mapDispatchToProps = {
  tradeBidWithMortgage
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MortgagePreview)
);
