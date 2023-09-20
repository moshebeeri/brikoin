import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { saveNewTrustee, trustee } from "../../redux/actions/trustees";
import CardContent from "@material-ui/core/CardContent";
import { saveEntity } from "../../redux/actions/inputForms";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { SubmitEntity } from "../../UI/index";
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

const trustee_types = [
  {
    label: "lawyer",
    value: "LAWYER"
  },
  {
    label: "Account Manager",
    value: "ACCOUNT_MANAGER"
  }
];

class TrusteeForm extends React.Component {
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

  trustee() {
    this.props.saveNewTrustee(this.state);
    this.resetForm();
  }

  resetForm() {
    this.setState({
      name: "",
      country: "",
      address1: "",
      address2: "",
      trusteeType: "",
      licenseNumber: "",
      contactFirstName: "",
      contactSecondName: "",
      phoneNumber: "",
      email: "",
      pdf: "",
      pdf_file: ""
    });
  }

  convertToBlockChainEntity(entity, toBlockChainString) {
    const trusteeTypeIndex = trustee_types.findIndex(
      element => element.value === entity.trusteeType
    );
    const result = {
      _name: toBlockChainString(entity.name),
      _trusteeType: trusteeTypeIndex,
      _licenseNumber: toBlockChainString(entity.licenseNumber),
      _country: toBlockChainString(entity.country),
      _address1: toBlockChainString(entity.address1),
      _address2: toBlockChainString(entity.address2),
      _contactFirstName: toBlockChainString(entity.contactFirstName),
      _contactSecondName: toBlockChainString(entity.contactSecondName),
      _phoneNumber: toBlockChainString(entity.phoneNumber),
      _email: toBlockChainString(entity.email),
      _url: toBlockChainString(entity.urlCode),
      _urlMD5: toBlockChainString(entity.urlMD5)
    };

    return result;
  }

  saveTrustee() {
    this.props.saveEntity(this.state, "trustees");
    this.resetForm();
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
          <h3>Trustee</h3>
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
                  <FormControl className={classes.textField}>
                    {!this.state.trusteeType ? (
                      <InputLabel htmlFor="trusteeType">
                        Trustee Type
                      </InputLabel>
                    ) : (
                      <InputLabel htmlFor="trusteeType" />
                    )}
                    <Select
                      value={this.state.trusteeType}
                      onChange={this.handleChange("trusteeType")}
                      inputProps={{
                        name: "trusteeType",
                        id: "trusteeType"
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {trustee_types.map(type => (
                        <MenuItem value={type.value}>{type.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    accept="pdf"
                    onChange={this.handleChangeFile("pdf")}
                  />
                </div>
                {/* <SubmitEntity contract={'TrusteeFactory'} method={'createTrustee'} convertToBlockChainEntity={this.convertToBlockChainEntity.bind(this)} setEntity={this.trustee.bind(this)} event={'TrusteeCreated'} label={'Add Trustee'} formName={'trustees' } entity={this.state}/> */}
                <Button color={"primary"} onClick={this.saveTrustee.bind(this)}>
                  save new trustee
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

TrusteeForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user
});

const mapDispatchToProps = {
  trustee,
  saveNewTrustee,
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(TrusteeForm)
);
