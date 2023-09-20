import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { saveNewProject } from "../../redux/actions/projects";
import CardContent from "@material-ui/core/CardContent";
import { saveEntity } from "../../redux/actions/inputForms";
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

class ProjectForm extends React.Component {
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

  project(entity) {
    const { user } = this.props;
    this.props.saveNewProject(entity, user);
    this.resetForm();
  }

  convertToBlockChainEntity(entity, toBlockChainString) {
    const result = {
      _name: toBlockChainString(entity.name),
      _symbol: toBlockChainString(entity.symbol),
      _target: entity.target,
      _startTimestamp: Date.parse(entity.startTimestamp),
      _durationSeconds: Date.parse(entity.durationSecond),
      _property: entity.property,
      _terms: entity.term,
      _url: toBlockChainString(entity.urlCode),
      _urlMD5: toBlockChainString(entity.urlMD5)
    };

    return result;
  }

  resetForm() {
    this.setState({
      name: "",
      symbol: "",
      target: "",
      startTimestamp: "",
      durationSecond: "",
      property: "",
      description: "",
      term: ""
    });
  }

  saveProject() {
    this.props.saveEntity(this.state, "projects");
    this.resetForm();
  }

  render() {
    const { classes, properties, terms } = this.props;
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
          <h3>Project</h3>
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
                    placeholder="Describe your project"
                    multiline
                    rowsMax={50}
                    value={this.state.description}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Symbol"
                    id="symbol"
                    className={classes.textField}
                    onChange={this.handleChange("symbol")}
                    margin="normal"
                    fullWidth
                    type="string"
                    value={this.state.symbol}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Target in USD"
                    id="target"
                    className={classes.textField}
                    onChange={this.handleChange("target")}
                    value={this.state.target}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="Start Date"
                    id="startTimestamp"
                    className={classes.textField}
                    value={this.state.startTimestamp}
                    onChange={this.handleChange("startTimestamp")}
                    margin="normal"
                    fullWidth
                    type="date"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="End Date"
                    id="durationSecond"
                    value={this.state.durationSecond}
                    className={classes.textField}
                    onChange={this.handleChange("durationSecond")}
                    margin="normal"
                    fullWidth
                    type="date"
                  />
                </div>

                {properties && (
                  <div style={{ flex: 1 }}>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="property">Property</InputLabel>
                      <Select
                        value={this.state.property}
                        onChange={this.handleChange("property")}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {properties.map(property => (
                          <MenuItem value={property.address}>
                            {property.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                {terms && (
                  <div style={{ flex: 1 }}>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="term">Term</InputLabel>
                      <Select
                        value={this.state.term}
                        onChange={this.handleChange("term")}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {terms.map(term => (
                          <MenuItem value={term.address}>{term.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
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

                {/* <SubmitEntity contract={'StoneCoinFactory'} method={'createStoneCoin'} convertToBlockChainEntity={this.convertToBlockChainEntity.bind(this)} setEntity={this.project.bind(this)} event={'StoneCoinCreated'} label={'Add Project'} formName={'projects' } entity={this.state}/> */}
                <Button color={"primary"} onClick={this.saveProject.bind(this)}>
                  save new Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

ProjectForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  properties: state.properties.list,
  terms: state.terms.list
});

const mapDispatchToProps = {
  saveNewProject,
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ProjectForm)
);
