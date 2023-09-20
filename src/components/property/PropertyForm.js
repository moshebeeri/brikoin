import React from "react";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import PropTypes from "prop-types";
import { property, saveNewProperty } from "../../redux/actions/properties";
import CardContent from "@material-ui/core/CardContent";
import { SubmitEntity } from "../../UI/index";
import { connect } from "react-redux";
import { saveEntity } from "../../redux/actions/inputForms";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
      backgroundColor: "white"
    },
    filePicker: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 220,
      backgroundColor: "white"
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

class PropertyForm extends React.Component {
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

  handleChangeFile() {
    let file = "pictures";
    return event => {
      this.setState({
        files: event.target.value,
        [file]: event.target.files
      });
    };
  }

  property(entity) {
    this.props.saveNewProperty(entity);
    this.resetForm();
  }

  convertToBlockChainEntity(entity, toBlockChainString) {
    const result = {
      _name: toBlockChainString(entity.name),
      _manager: entity.manager,
      _trustee: entity.trustee,
      _registrar: entity.registrar,
      _estimation: entity.estimation,
      _country: toBlockChainString(entity.country),
      _address1: toBlockChainString(entity.address1),
      _address2: toBlockChainString(""),
      _state: toBlockChainString(entity.state),
      _lat: toBlockChainString(entity.lat.toString()),
      _lon: toBlockChainString(entity.lng.toString())
    };
    return result;
  }

  resetForm() {
    this.setState({
      name: "",
      manager: "",
      trustee: "",
      registrar: "",
      estimation: "",
      country: "",
      address1: "",
      address2: "",
      state: "",
      pictures: [],
      description: "",
      files: ""
    });
  }

  saveProperties() {
    this.props.saveEntity(this.state, "properties");
    this.resetForm();
  }
  render() {
    const { classes, registrars, trustees, managers, estimations } = this.props;
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
          <h3>Property</h3>
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
                    label="Description"
                    id="description"
                    className={classes.textField}
                    onChange={this.handleChange("description")}
                    margin="normal"
                    fullWidth
                    placeholder="Describe your property"
                    multiline
                    rowsMax={50}
                    value={this.state.description}
                  />
                </div>

                {managers && (
                  <div style={{ flex: 1 }}>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="manager">Manager</InputLabel>
                      <Select
                        value={this.state.manager}
                        onChange={this.handleChange("manager")}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {managers.map(manager => (
                          <MenuItem value={manager.address}>
                            {manager.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
                {trustees && (
                  <div style={{ flex: 1 }}>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="age-simple">Trustee</InputLabel>
                      <Select
                        value={this.state.trustee}
                        onChange={this.handleChange("trustee")}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {trustees.map(trustee => (
                          <MenuItem value={trustee.address}>
                            {trustee.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                {registrars && (
                  <div style={{ flex: 1 }}>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="age-simple">Registrar</InputLabel>
                      <Select
                        value={this.state.registrar}
                        onChange={this.handleChange("registrar")}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {registrars.map(registrar => (
                          <MenuItem value={registrar.address}>
                            {registrar.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                {estimations && (
                  <div style={{ flex: 1 }}>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="age-simple">Estimation</InputLabel>
                      <Select
                        value={this.state.estimation}
                        onChange={this.handleChange("estimation")}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {estimations.map(estimation => (
                          <MenuItem value={estimation.address}>
                            {estimation.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <TextField
                    label="country"
                    id="country"
                    value={this.state.country}
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
                    className={classes.textField}
                    value={this.state.state}
                    onChange={this.handleChange("state")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="address"
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
                  Add property pictures:
                  <input
                    value={this.state.files}
                    id="file"
                    type="file"
                    onChange={this.handleChangeFile()}
                    required
                    multiple
                  />
                </div>

                {/* <SubmitEntity checkAddress contract={'PropertyFactory'} method={'createProperty'} convertToBlockChainEntity={this.convertToBlockChainEntity.bind(this)} setEntity={this.property.bind(this)} event={'PropertyCreated'} label={'Add Property'} formName={'realProperties'} entity={this.state} /> */}
                <Button
                  color={"primary"}
                  onClick={this.saveProperties.bind(this)}
                >
                  save new Property
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

PropertyForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  registrars: state.registrars.list,
  trustees: state.trustees.list,
  managers: state.managers.list,
  estimations: state.estimations.list
});

const mapDispatchToProps = {
  property,
  saveNewProperty,
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PropertyForm)
);
