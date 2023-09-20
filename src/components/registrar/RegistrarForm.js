import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import { registrar, saveNewRegistrar } from "../../redux/actions/registrars";
import { SubmitEntity } from "../../UI/index";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import { saveEntity } from "../../redux/actions/inputForms";
import Button from "@material-ui/core/Button";
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

class RegistrarForm extends React.Component {
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

  registrar(entity) {
    this.props.saveNewRegistrar(entity);
    this.resetForm();
  }

  resetForm() {
    this.setState({
      name: "",
      licenseNumber: "",
      country: "",
      address1: "",
      address2: "",
      phoneNumber: "",
      faxNumber: "",
      email: "",
      url: ""
    });
  }

  convertToBlockChainEntity(entity, toBlockChainString) {
    const result = {
      _name: toBlockChainString(entity.name),
      _licenseNumber: toBlockChainString(entity.licenseNumber),
      _country: toBlockChainString(entity.country),
      _address1: toBlockChainString(entity.address1),
      _address2: toBlockChainString(entity.address2),
      _phoneNumber: toBlockChainString(entity.phoneNumber),
      _faxNumber: toBlockChainString(entity.faxNumber),
      _email: toBlockChainString(entity.email),
      _url: toBlockChainString(entity.url)
    };

    return result;
  }

  saveRegistrar() {
    this.props.saveEntity(this.state, "registrars");
    this.resetForm();
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
          <h3>Recorder office</h3>
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
                    value={this.state.name}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="License/ID"
                    id="licenseNumber"
                    className={classes.textField}
                    onChange={this.handleChange("licenseNumber")}
                    margin="normal"
                    value={this.state.licenseNumber}
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Country"
                    id="country"
                    className={classes.textField}
                    value={this.state.country}
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
                    value={this.state.address1}
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
                    value={this.state.address2}
                    onChange={this.handleChange("address2")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="office phone number"
                    id="phoneNumber"
                    className={classes.textField}
                    value={this.state.phoneNumber}
                    onChange={this.handleChange("phoneNumber")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="office fax number"
                    id="phoneNumber"
                    className={classes.textField}
                    value={this.state.faxNumber}
                    onChange={this.handleChange("faxNumber")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="office email address"
                    id="email"
                    className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange("email")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="URL"
                    id="url"
                    value={this.state.url}
                    className={classes.textField}
                    onChange={this.handleChange("url")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>
                {/* <SubmitEntity contract={'RegistrarFactory'} method={'createRegistrar'} convertToBlockChainEntity={this.convertToBlockChainEntity.bind(this)} setEntity={this.registrar.bind(this)} event={'RegistrarCreated'} label={'Add Registrar'} formName={'registrars' } entity={this.state}/> */}
                <Button
                  color={"primary"}
                  onClick={this.saveRegistrar.bind(this)}
                >
                  save new Registrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

RegistrarForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user
});

const mapDispatchToProps = {
  registrar,
  saveNewRegistrar,
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(RegistrarForm)
);
