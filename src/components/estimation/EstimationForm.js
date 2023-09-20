import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import { estimation, saveNewEstimation } from "../../redux/actions/estimations";
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

class EstimationForm extends React.Component {
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

  convertToBlockChainEntity(entity, toBlockChainString) {
    const result = {
      _price: parseInt(entity.price),
      _currency: toBlockChainString(entity.currency),
      _timestamp: Date.parse(entity.timestamp),
      _rental: toBlockChainString(entity.rental),
      _expectedYield: parseInt(entity.expectedYield),
      _estimatorName: toBlockChainString(entity.estimatorName),
      _estimatorFirstName: toBlockChainString(entity.estimatorFirstName),
      _estimatorSecondName: toBlockChainString(entity.estimatorSecondName),
      _phoneNumber: toBlockChainString(entity.phoneNumber),
      _email: toBlockChainString(entity.email),
      _url: toBlockChainString(entity.urlCode),
      _urlMD5: toBlockChainString(entity.urlMD5)
    };

    return result;
  }

  estimation(entity) {
    this.props.saveNewEstimation(entity);
    this.resetForm();
  }

  saveEstimation() {
    this.props.saveEntity(this.state, "estimations");
    this.resetForm();
  }

  componentWillReceiveProps() {
    const { selectedProject } = this.props;
    if (selectedProject) {
      this.setState({
        name: "",
        price: "",
        currency: "",
        timestamp: "",
        rental: "",
        expectedYield: "",
        estimatorName: "",
        estimatorFirstName: "",
        estimatorSecondName: "",
        phoneNumber: "",
        email: "",
        pdf: ""
      });
    }
  }

  resetForm() {
    this.setState({
      name: "",
      price: "",
      currency: "",
      timestamp: "",
      rental: "",
      expectedYield: "",
      estimatorName: "",
      estimatorFirstName: "",
      estimatorSecondName: "",
      phoneNumber: "",
      email: "",
      pdf: ""
    });
  }
  render() {
    const { classes, selectedProject, estimation } = this.props;
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
          <h3>Estimation</h3>
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
                    value={
                      selectedProject && !this.state.name
                        ? selectedProject.property.estimation.name
                        : this.state.name
                    }
                    onChange={this.handleChange("name")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="price ($)"
                    id="price$"
                    value={
                      selectedProject && !this.state.price
                        ? selectedProject.property.estimation.price
                        : this.state.price
                    }
                    className={classes.textField}
                    onChange={this.handleChange("price")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="currency"
                    id="currency"
                    className={classes.textField}
                    value={
                      selectedProject && !this.state.currency
                        ? selectedProject.property.estimation.currency
                        : this.state.currency
                    }
                    onChange={this.handleChange("currency")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="current time"
                    id="timestamp"
                    value={
                      selectedProject && !this.state.timestamp
                        ? selectedProject.property.estimation.timestamp
                        : this.state.timestamp
                    }
                    className={classes.textField}
                    onChange={this.handleChange("timestamp")}
                    margin="normal"
                    fullWidth
                    type="date"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="expected rental"
                    id="rental"
                    value={this.state.rental}
                    className={classes.textField}
                    onChange={this.handleChange("rental")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="expected yield"
                    id="expectedYield"
                    className={classes.textField}
                    value={this.state.expectedYield}
                    onChange={this.handleChange("expectedYield")}
                    margin="normal"
                    fullWidth
                    type="number"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="estimator name"
                    id="estimatorName"
                    className={classes.textField}
                    value={this.state.estimatorName}
                    onChange={this.handleChange("estimatorName")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="estimator first name"
                    id="estimatorFirstName"
                    className={classes.textField}
                    value={this.state.estimatorFirstName}
                    onChange={this.handleChange("estimatorFirstName")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="estimator second name"
                    id="estimatorSecondName"
                    className={classes.textField}
                    value={this.state.estimatorSecondName}
                    onChange={this.handleChange("estimatorSecondName")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="estimator phone number"
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
                    label="estimator email address"
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
                {/*<SubmitEntity contract={'EstimationFactory'} method={'createEstimation'} convertToBlockChainEntity={this.convertToBlockChainEntity.bind(this)} setEntity={this.estimation.bind(this)} event={'EstimationCreated'} label={'Add Estimation'} formName={'estimations'} entity={this.state} />*/}
                <Button
                  color={"primary"}
                  onClick={this.saveEstimation.bind(this)}
                >
                  save new estimation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

EstimationForm.propTypes = {
  drizzle: PropTypes.object,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  selectedProject: state.admin.selectedProject
});

const mapDispatchToProps = {
  estimation,
  saveNewEstimation,
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(EstimationForm)
);
