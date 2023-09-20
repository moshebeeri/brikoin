import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import {
  addMortgage,
  addMortgageeExternal
} from "../../redux/actions/mortgage";
import Button from "@material-ui/core/Button";
import { config } from "../../conf/config";
import { SubmitOperation } from "../../UI/index";
const styles = theme => {
  return {
    button: {
      margin: theme.spacing.unit
    },
    input: {
      display: "none"
    },
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    formControl: {
      margin: theme.spacing.unit * 3
    },
    group: {
      margin: `${theme.spacing.unit}px 0`
    },
    menu: {
      width: 200
    },
    card: {
      maxWidth: 275,
      marginTop: "10%"
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
    }
  };
};

class MortgageeForm extends React.Component {
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

  saveMortgagee() {
    let mortgagee = {
      country: this.state.country,
      city: this.state.city,
      address: this.state.address,
      type: this.state.type,
      businessIndentifier: this.state.businessIndentifier,
      name: this.state.name
    };
    this.props.addMortgage(mortgagee, this.props.user, this.state.amount);
  }
  addMortgaeeFounds() {
    this.props.addMortgage("", this.props.user, this.state.amount);
  }

  saveMortgageeExternal(request, stackId) {
    let mortgage = {
      description: this.state.description,
      amount: this.state.amount
    };
    this.props.addMortgageeExternal(mortgage, this.props.user, stackId);
  }

  render() {
    const { classes, activeAccount, mortgagee } = this.props;
    if (mortgagee.amount) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItem: "center",
            justifyContent: "center"
          }}
        >
          <Card className={classes.card}>
            <h3>Add Mortgagee funds</h3>
            <CardContent>
              <form className={classes.container} noValidate autoComplete="off">
                <div
                  style={{
                    alignItems: "center",
                    flexDirection: "col",
                    justifyContent: "center"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="amount"
                      id="amount"
                      className={classes.textField}
                      onChange={this.handleChange("amount")}
                      margin="normal"
                      fullWidth
                      type="number"
                    />
                  </div>

                  <label htmlFor="outlined-button-file">
                    {activeAccount.type === "EXTERNAL" ? (
                      <SubmitOperation
                        onSuccess={this.saveMortgageeExternal.bind(this)}
                        request={{
                          amount: this.state.amount * config.stoneRatio,
                          maxAmount: this.state.amount * config.stoneRatio
                        }}
                        label={"Transfer For Mortgages"}
                        contract={"CornerStone"}
                        event={"MortgageeAdded"}
                        method={"addMortgegee"}
                      />
                    ) : (
                      <Button
                        color={"outlined"}
                        onClick={this.addMortgaeeFounds.bind(this)}
                      >
                        Transfer For Mortgages
                      </Button>
                    )}
                  </label>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "center"
        }}
      >
        <Card className={classes.card}>
          <h3>Become Mortgagee</h3>
          <CardContent>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                style={{
                  alignItems: "center",
                  flexDirection: "col",
                  justifyContent: "center"
                }}
              >
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Name"
                    id="name"
                    className={classes.textField}
                    onChange={this.handleChange("name")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="amount"
                    id="amount"
                    className={classes.textField}
                    onChange={this.handleChange("amount")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="type"
                    id="type"
                    className={classes.textField}
                    onChange={this.handleChange("type")}
                    margin="normal"
                    fullWidth
                    type="type"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="City"
                    id="city"
                    className={classes.textField}
                    onChange={this.handleChange("city")}
                    margin="normal"
                    fullWidth
                    type="type"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Country"
                    id="city"
                    className={classes.textField}
                    onChange={this.handleChange("country")}
                    margin="normal"
                    fullWidth
                    type="type"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Address"
                    id="address"
                    className={classes.textField}
                    onChange={this.handleChange("address")}
                    margin="normal"
                    fullWidth
                    type="type"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Business Identifier"
                    id="businessIndentifier"
                    className={classes.textField}
                    onChange={this.handleChange("businessIndentifier")}
                    margin="normal"
                    fullWidth
                    type="type"
                  />
                </div>

                <label htmlFor="outlined-button-file">
                  {activeAccount.type === "EXTERNAL" ? (
                    <SubmitOperation
                      onSuccess={this.saveMortgageeExternal.bind(this)}
                      request={{
                        amount: this.state.amount * config.stoneRatio,
                        maxAmount: this.state.amount * config.stoneRatio
                      }}
                      label={"Transfer For Mortgages"}
                      contract={"CornerStone"}
                      event={"MortgageeAdded"}
                      method={"addMortgegee"}
                    />
                  ) : (
                    <Button
                      color={"outlined"}
                      onClick={this.saveMortgagee.bind(this)}
                    >
                      Transfer For Mortgages
                    </Button>
                  )}
                </label>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

MortgageeForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  mortgagee: state.userAccounts.mortgagee
});

const mapDispatchToProps = {
  addMortgage,
  addMortgageeExternal
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MortgageeForm)
);
