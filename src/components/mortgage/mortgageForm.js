import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import { saveEntity } from "../../redux/actions/inputForms";

const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
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
const initialState = {
  holdingYears: "",
  name: "",
  Country: "",
  sellPercentage: "",
  rental: ""

  /* etc */
};

class MortgageForm extends React.Component {
  state = {
    name: ""
  };

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  handleChangeFile(name) {
    let file = name + "_file";
    return event => {
      this.setState({
        [name]: event.target.value,
        [file]: event.target.files
      });
    };
  }

  terms(entity) {
    this.props.saveNewTerms(entity);
    this.setState({
      holdingYears: "",
      name: "",
      Country: "",
      sellPercentage: "",
      rental: ""
    });
  }

  render() {
    const { classes } = this.props;
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
          <h3>Mortgage</h3>
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
                    label="Mortgage amount"
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
                    label="Term in years"
                    id="years"
                    className={classes.textField}
                    onChange={this.handleChange("years")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Interest rate"
                    id="interestRate"
                    className={classes.textField}
                    onChange={this.handleChange("interestRate")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Months before first adjustment"
                    id="firstAdjustment"
                    className={classes.textField}
                    onChange={this.handleChange("firstAdjustment")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Months between adjustments"
                    id="betweenAdjustments"
                    className={classes.textField}
                    onChange={this.handleChange("betweenAdjustments")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Expected adjustment"
                    id="expectedAdjustment"
                    className={classes.textField}
                    onChange={this.handleChange("expectedAdjustment")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Interest rate cap"
                    id="interestRateCap"
                    className={classes.textField}
                    onChange={this.handleChange("interestRateCap")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

MortgageForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user
});

const mapDispatchToProps = {
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MortgageForm)
);
