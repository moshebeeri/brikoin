import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { SubmitEntity } from "../../UI/index";
import Card from "@material-ui/core/Card";
import { manager, saveNewManager } from "../../redux/actions/managers";
import { saveEntity } from "../../redux/actions/inputForms";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
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

class ManagerForm extends React.Component {
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

  manager(entity) {
    this.props.saveNewManager(entity);
    this.resetForm();
  }

  resetForm() {
    this.setState({
      name: "",
      country: "",
      address1: "",
      address2: "",
      contactFirstName: "",
      contactSecondName: "",
      phoneNumber: "",
      email: "",
      pdf: ""
    });
  }

  saveManager() {
    this.props.saveEntity(this.state, "managers");
    this.resetForm();
  }

  convertToBlockChainEntity(entity, toBlockChainString) {
    const result = {
      _name: toBlockChainString(entity.name),
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
          <h3>Manager</h3>
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
                    value={this.state.name}
                    className={classes.textField}
                    onChange={this.handleChange("name")}
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
                    label="Contact First Name"
                    id="contactFirstName"
                    className={classes.textField}
                    value={this.state.contactFirstName}
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
                    value={this.state.contactSecondName}
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
                    value={this.state.phoneNumber}
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
                    value={this.state.email}
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
                    value={this.state.pdf}
                    className={classes.textField}
                    type="file"
                    accept="pdf"
                    onChange={this.handleChangeFile("pdf")}
                  />
                </div>
                {/* <SubmitEntity contract={'ManagerFactory'} method={'createManager'} convertToBlockChainEntity={this.convertToBlockChainEntity.bind(this)} setEntity={this.manager.bind(this)} event={'ManagerCreated'} label={'Add Manager'} formName={'managers' } entity={this.state}/> */}

                <Button color={"primary"} onClick={this.saveManager.bind(this)}>
                  save new manager
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

ManagerForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user
});

const mapDispatchToProps = {
  manager,
  saveNewManager,
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ManagerForm)
);
