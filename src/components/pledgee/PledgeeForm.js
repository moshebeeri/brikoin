import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { pledgee, saveNewPledgee } from "../../redux/actions/pledgees";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";

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
  /* etc */
};

class PledgeeForm extends React.Component {
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
    let file = name + "_File";
    return event => {
      this.setState({
        [name]: event.target.value,
        [file]: event.target.files
      });
    };
  }

  pledgee() {
    this.props.saveNewPledgee(this.state);
    this.setState(initialState);
  }

  render() {
    const { classes, errorMessage } = this.props;
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
          <h3>Pledgee</h3>
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
                    label="name"
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
                    label="Pledgee Type"
                    id="pledgeeType"
                    className={classes.textField}
                    onChange={this.handleChange("pledgeeType")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="License Number"
                    id="licenseNumber"
                    className={classes.textField}
                    onChange={this.handleChange("licenseNumber")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Country"
                    id="country"
                    className={classes.textField}
                    onChange={this.handleChange("country")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="state"
                    id="state"
                    value={this.state.state}
                    className={classes.textField}
                    onChange={this.handleChange("state")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Address"
                    id="address1"
                    className={classes.textField}
                    onChange={this.handleChange("address1")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    id="address2"
                    className={classes.textField}
                    onChange={this.handleChange("address2")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Contact First Name"
                    id="contactFirstName"
                    className={classes.textField}
                    onChange={this.handleChange("contactFirstName")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Contact Second Name"
                    id="contactSecondName"
                    className={classes.textField}
                    onChange={this.handleChange("contactSecondName")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Phone Number"
                    id="phoneNumber"
                    className={classes.textField}
                    onChange={this.handleChange("phoneNumber")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="email"
                    id="email"
                    className={classes.textField}
                    onChange={this.handleChange("email")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  Attach PDF:
                  <input
                    id="pdf"
                    className={classes.textField}
                    type="file"
                    accept="*.pdf"
                    onChange={this.handleChangeFile("pdf")}
                  />
                </div>

                <Button color={"primary"} onClick={this.pledgee.bind(this)}>
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

PledgeeForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user
});

const mapDispatchToProps = {
  pledgee,
  saveNewPledgee
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PledgeeForm)
);
