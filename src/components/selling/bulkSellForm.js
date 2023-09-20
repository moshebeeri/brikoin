import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { SubmitOperation } from "../../UI/index";
import { config } from "../../conf/config";
import AccountBalance from "@material-ui/icons/AccountBalance";
import numberUtils from "../../utils/numberUtils";
import { connect } from "react-redux";
const ADDRESS_NULL = "0x0000000000000000000000000000000000000000";
const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 280
    },
    menu: {
      width: 200
    },
    card: {
      marginTop: 20
    },
    cardSmall: {
      width: 380,
      height: 300,
      marginRight: "10%"
    },

    grid: {
      flex: 1
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
    },
    title: {
      marginBottom: 16,
      fontSize: 14
    },
    pos: {
      marginBottom: 12
    },
    button: {
      width: 100,
      height: 20
    },
    button2: {
      marginRight: "12%",
      width: 100,
      height: 20
    }
  };
};

class BulkSellForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      verifyPassword: "",
      showCaptcha: false,
      useExternal: false
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  invest(request) {
    this.props.invest(request);
  }

  render() {
    const {
      classes,
      lang,
      project,
      investExternalAsk,
      transaction,
      activeAccount
    } = this.props;

    return (
      <Card>
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "flex-start"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "flex-start",
                    fontSize: 15
                  }}
                >
                  {" "}
                  {this.createMortgageTitle(transaction)}{" "}
                  {this.props.t("sellBulk")}{" "}
                  {numberUtils.formatNumber(transaction.remainingSize, 0)}
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <TextField
                    label={this.props.t("amount")}
                    id="amount"
                    className={classes.textField}
                    onChange={this.handleChange("amount")}
                    margin="normal"
                    fullWidth
                    type="number"
                    value={this.state.amount}
                  />
                  <div style={{ marginTop: 30, marginLeft: 20 }}>
                    {activeAccount.type === "EXTERNAL" ? (
                      <div style={{ borderColor: "black", border: 1 }}>
                        <SubmitOperation
                          onSuccess={investExternalAsk}
                          request={{
                            projectId: project.address,
                            amount: this.state.amount,
                            limit: this.state.price * config.stoneRatio,
                            signedDocument: ADDRESS_NULL
                          }}
                          label={"Invest"}
                          contract={"CornerStone"}
                          event={"AskCreated"}
                          method={"ask"}
                        />
                      </div>
                    ) : (
                      <Button
                        color="primary"
                        className={classes.button}
                        onClick={this.invest.bind(this, {
                          projectId: project.address,
                          amount: this.state.amount,
                          limit: this.state.price,
                          remainingSize: transaction.remainingSize,
                          mortgageAddress: transaction.mortgageAddress,
                          mortgageRequestAddress: transaction.mortgageRequestAddress
                            ? transaction.mortgageRequestAddress
                            : "",
                          mortgageConditionAddress: transaction.mortgageConditionAddress
                            ? transaction.mortgageConditionAddress
                            : "",
                          mortgageId: transaction.mortgageId
                            ? transaction.mortgageId
                            : "",
                          mortgageeAddress: transaction.mortgageeAddress
                            ? transaction.mortgageeAddress
                            : "",
                          mortgageRequestId: transaction.mortgageRequestId
                            ? transaction.mortgageRequestId
                            : "",
                          type: "ask"
                        })}
                      >
                        {this.props.t("sell")}
                      </Button>
                    )}
                  </div>
                </div>
                <TextField
                  label={this.props.t("price")}
                  id="price"
                  className={classes.textField}
                  onChange={this.handleChange("price")}
                  margin="normal"
                  fullWidth
                  type="number"
                  value={this.state.price}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  createMortgageTitle(transaction) {
    if (transaction.mortgageAddress) {
      return (
        <div style={{ marginRight: 5, marginLeft: 5 }}>
          <AccountBalance />{" "}
        </div>
      );
    }
  }
}

BulkSellForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  activeAccount: state.userAccounts.activeAccount
});
const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(BulkSellForm)
);
