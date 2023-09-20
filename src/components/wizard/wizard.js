import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import start from "../../formGen/start";
import privateInvest from "../../formGen/private";
import business from "../../formGen/busines";
import apartment from "../../formGen/appartment";
import office from "../../formGen/office";
import logistics from "../../formGen/logistics";
import Close from "@material-ui/icons/Close";
import Grade from "@material-ui/icons/Grade";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import green from "@material-ui/core/colors/green";
import { saveWizardForm } from "../../redux/actions/inputForms";
import classNames from "classnames";
import LoadingCircular from "../../UI/loading/LoadingCircular";
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
      width: 280
    },
    fileUpload: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 190
    },
    fileUploadError: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 190,
      color: "red"
    },
    menu: {
      width: 200
    },
    margin: {
      margin: theme.spacing.unit
    },
    card: {
      display: "flex",
      boxShadow: "none",
      width: "100%",
      minWidth: 1000,
      maxWidth: 1000,
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    cardSmall: {
      width: 380,
      height: 300,
      marginRight: "10%",
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
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
    formTitle: {
      width: 1000,
      backgroundColor: "yellow"
    },
    pos: {
      marginBottom: 12
    },
    button: {
      width: 150,
      height: 20
    },
    button2: {
      width: 100,
      height: 20
    },
    root: {
      display: "flex",
      alignItems: "center"
    },
    wrapper: {
      margin: theme.spacing.unit,
      position: "relative"
    },
    buttonSuccess: {
      backgroundColor: green[500],
      "&:hover": {
        backgroundColor: green[700]
      }
    },
    fabProgress: {
      color: green[500],
      position: "absolute",
      top: -6,
      left: -6,
      zIndex: 1
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  };
};

class WizardGen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: [], open: false };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  confirmRequest = () => {
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true
        },
        () => {
          this.timer = setTimeout(() => {
            this.props.saveWizardForm(this.state, this.props.user);
            this.setState({
              loading: false,
              success: true
            });
          }, 2000);
          this.timer = setTimeout(() => {
            this.setState({
              open: false
            });
          }, 3000);
          this.timer = setTimeout(() => {
            this.props.history.push("/projects/");
          }, 4000);
        }
      );
    }
  };

  handleChangeFile(name) {
    let file = name + "_file";
    return event => {
      this.setState({
        [name]: event.target.value,
        [file]: event.target.files
      });
    };
  }

  addForm(form) {
    let forms = this.state.forms ? this.state.forms : [];
    forms = this.removeForm(forms);
    forms.push(form);
    this.setState({ forms: forms });
  }

  removeForm(form) {
    let forms = this.state.forms ? this.state.forms : [];
    forms = forms.filter(current => form !== current);
    this.setState({ forms: forms });
    return forms;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { classes } = this.props;
    const fromName = this.parseFormName();
    if (fromName === "done") {
      return this.renderSummary();
    }
    const form = this.getForm(fromName);

    if (!form) {
      return <div />;
    }

    // const locale = lang === 'En' ? 'en' : 'he-il'
    return this.renderForm(classes, form);
  }

  parseFormName() {
    const params = this.props.location.pathname.substring(8)
      ? this.props.location.pathname.substring(8)
      : "";
    if (params.indexOf("-") <= 0) {
    } else {
      let length = params.split("-").length;
      return params.split("-")[length - 1];
    }
    return params;
  }
  parseFormNames() {
    const params = this.props.location.pathname.substring(8)
      ? this.props.location.pathname.substring(8)
      : "";
    return params.split("-");
  }

  renderSummary() {
    const { classes } = this.props;
    const forms = this.state.forms.filter((x, i, a) => a.indexOf(x) === i);
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div
          style={{
            display: "flex",
            margin: 5,
            maxWidth: 1140,
            flexDirection: "column",
            marginTop: 90
          }}
        >
          {this.summary(classes)}
          {forms.map(fromName =>
            this.generateForm(classes, this.getForm(fromName), true)
          )}
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {this.createApprovePanel(classes)}
        </div>
        {this.renderApproveDialog(classes)}
      </div>
    );
  }

  renderForm(classes, form, isSummary) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            margin: 5,
            maxWidth: 1140,
            flexDirection: "column",
            marginTop: 90
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.mainPanel(classes, form, isSummary)}
          </div>
        </div>
      </div>
    );
  }

  getForm(formName) {
    if (formName === "start") {
      return start;
    }
    if (formName === "business") {
      return business;
    }
    if (formName === "private") {
      return privateInvest;
    }
    if (formName === "apartment") {
      return apartment;
    }
    if (formName === "office") {
      return office;
    }
    if (formName === "logistics") {
      return logistics;
    }
    return null;
  }

  mainPanel(classes, form, isSummary) {
    return (
      <div style={{ marginTop: 20 }}>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          justify="center"
          spacing={16}
        >
          <Grid key="1" item>
            {!isSummary && this.pageTitle(classes, form, isSummary)}
            {form.fields.length > 0 &&
              this.generateForm(classes, form, isSummary)}
          </Grid>
          <Grid key="2" item>
            {!isSummary && this.conditionPanel(classes, form)}
          </Grid>
        </Grid>
      </div>
    );
  }

  title(classes) {
    return (
      <div style={{}}>
        <Typography
          className={classes.textFieldClass}
          align="left"
          variant="h5"
        >
          {this.props.t("FundingProcess")}
        </Typography>
      </div>
    );
  }

  pageTitle(classes, form) {
    let forms = this.parseFormNames();
    const title = forms.map(formName =>
      this.props.t(this.getForm(formName).title)
    );
    return (
      <Card className={classes.card}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <Typography
                classes={classes.formTitle}
                noWrap
                align="left"
                variant="h5"
              >
                {title.join(" -> ")}
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
  summary(classes) {
    return (
      <Card className={classes.card}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <Typography align="left" variant="h5">
                {this.props.t("summary")}
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  generateForm(classes, form, isSummary) {
    if (isSummary && !form.summary) {
      return <div />;
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off" />
          <FormLabel component="legend">{this.props.t(form.label)}</FormLabel>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }}
          >
            {form.fields.map(field => {
              if (field.type === "text") {
                return this.createTestField(classes, field, isSummary);
              }
              if (field.type === "fileUpload") {
                return this.createFileUpload(classes, field, isSummary);
              }
              if (field.type === "selector") {
                return this.createSelector(classes, field, isSummary);
              }
              return <div />;
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  createSelector(classes, field, isSummary) {
    return (
      <div className={classes.margin}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: 280,
                height: 62,
                alignItems: "flex-end",
                justifyContent: "flex-start"
              }}
            >
              <div style={{ width: 120 }}>{this.props.t(field.label)}:</div>
              <div
                style={{
                  width: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Select
                  value={
                    this.state[field.dataType]
                      ? this.state[field.dataType]
                      : "none"
                  }
                  style={{ marginRight: 10, marginLeft: 10 }}
                  error={this.state.errors.indexOf(field.dataType) >= 0}
                  onChange={this.handleChange(field.dataType)}
                  disabled={isSummary}
                  inputProps={{
                    name: "age",
                    id: "age-simple"
                  }}
                >
                  <MenuItem value="none">
                    <em>{this.props.t("None")}</em>
                  </MenuItem>
                  {field.selections.map(select => (
                    <MenuItem value={select.value}>
                      {this.props.t(select.label)}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          </Grid>
          <Grid>
            <div
              style={{
                display: "flex",
                width: 10,
                height: 20,
                alignItems: "flex-start",
                justifyContent: "flex-start"
              }}
            >
              {field.mandatory && !isSummary && (
                <Grade style={{ fontSize: 10, color: "red" }} />
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
  createTestField(classes, field, isSummary) {
    return (
      <div className={classes.margin}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid>
            <TextField
              label={this.props.t(field.label)}
              id={field.dataType}
              className={classes.textField}
              onChange={this.handleChange(field.dataType)}
              margin="normal"
              fullWidth
              error={this.state.errors.indexOf(field.dataType) >= 0}
              type="text"
              disabled={isSummary}
              value={
                this.state[field.dataType] ? this.state[field.dataType] : ""
              }
            />
          </Grid>
          <Grid>
            <div
              style={{
                display: "flex",
                width: 10,
                height: 20,
                alignItems: "flex-start",
                justifyContent: "flex-start"
              }}
            >
              {field.mandatory && !isSummary && (
                <Grade style={{ fontSize: 10, color: "red" }} />
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
  uploadFile() {}
  clearUpload(fileName) {
    this.setState({
      [fileName]: "",
      [fileName + "_file"]: ""
    });
  }
  createFileUpload(classes, field, isSummary) {
    const error = this.state.errors.indexOf(field.dataType) >= 0;
    let link = this.state[field.dataType + "_file"]
      ? window.URL.createObjectURL(this.state[field.dataType + "_file"][0])
      : "";
    return (
      <form className={classes.container} noValidate autoComplete="off">
        <div
          style={{
            border: 1,
            borderColor: "red",
            marginLeft: 15,
            marginRight: 15,
            height: 60,
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.props.t(field.label)}
            {this.state[field.dataType] ? (
              <div
                style={{
                  marginRight: 5,
                  marginLeft: 5,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 300,
                  height: 20
                }}
              >
                {
                  <a title={"click to download"} href={link} target="_blank">
                    {this.state[field.dataType + "_file"][0].name}
                  </a>
                }
                {!isSummary && (
                  <Button onClick={this.clearUpload.bind(this, field.dataType)}>
                    <Close style={{ fontSize: 20 }} />
                  </Button>
                )}
              </div>
            ) : (
              <div className={classes.margin}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid>
                    <input
                      id="jpg"
                      placeholder={this.props.t("file")}
                      value={this.state[field.dataType]}
                      className={
                        error ? classes.fileUploadError : classes.fileUpload
                      }
                      type="file"
                      accept="jpg"
                      onChange={this.handleChangeFile(field.dataType)}
                    />{" "}
                  </Grid>
                  <Grid>
                    <div
                      style={{
                        display: "flex",
                        width: 10,
                        height: 20,
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                      }}
                    >
                      {field.mandatory && !isSummary && (
                        <Grade style={{ fontSize: 10, color: "red" }} />
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
            )}
          </div>
        </div>
      </form>
    );
  }

  conditionPanel(classes, form) {
    return (
      <Card className={classes.card}>
        <CardContent>
          <FormControl component="fieldset" className={classes.formControl}>
            {form.condition.type === "radio" &&
              this.createRadioSelection(classes, form.condition)}
          </FormControl>
          {form.condition.type === "done"
            ? this.createDoneButton(classes, form.condition)
            : this.createNextButton(classes, form.condition)}
        </CardContent>
      </Card>
    );
  }

  nextPage(condition) {
    const nextPage = condition.results.filter(
      result => result.key === this.state[condition.key]
    )[0];
    const forms = this.props.location.pathname.substring(8)
      ? this.props.location.pathname.substring(8)
      : "";
    const fromName = this.parseFormName();
    let form = this.getForm(fromName);
    if (this.validateForm(form)) {
      this.addForm(fromName);
      this.props.history.push("/wizard/" + forms + "-" + nextPage.value);
    }
  }

  validateForm(form) {
    let errors = form.fields.filter(
      field => field.mandatory && !this.state[field.dataType]
    );
    if (errors.length > 0) {
      this.setState({
        errors: errors.map(field => field.dataType)
      });
      return false;
    }
    this.setState({
      errors: []
    });
    return true;
  }
  done() {
    const fromName = this.parseFormName();

    let form = this.getForm(fromName);
    if (this.validateForm(form)) {
      this.addForm(fromName);
      this.props.history.push("/wizard/done");
    }
  }

  back() {
    const fromName = this.parseFormName();
    this.removeForm(fromName);
    this.props.history.goBack();
  }
  createNextButton(classes, condition) {
    const fromName = this.parseFormName();

    return (
      <div
        style={{
          width: 950,
          display: "flex",
          alignItems: fromName !== "start" ? "space-between" : "flex-end",
          justifyContent: fromName !== "start" ? "space-between" : "flex-end"
        }}
      >
        {fromName !== "start" && (
          <Button
            fullWidth
            onClick={this.back.bind(this, condition)}
            variant="outlined"
            className={classes.button2}
          >
            {this.props.t("back")}
          </Button>
        )}

        {this.state[condition.key] && (
          <Button
            fullWidth
            onClick={this.nextPage.bind(this, condition)}
            variant="outlined"
            className={classes.button2}
          >
            {this.props.t("next")}
          </Button>
        )}
      </div>
    );
  }

  approve() {
    this.setState({ open: true });
  }
  createApprovePanel(classes) {
    const fromName = this.parseFormName();

    return (
      <Card className={classes.card}>
        <CardContent>
          <div
            style={{
              width: 950,
              display: "flex",
              alignItems: fromName !== "start" ? "space-between" : "flex-end",
              justifyContent:
                fromName !== "start" ? "space-between" : "flex-end"
            }}
          >
            {fromName !== "start" && (
              <Button
                fullWidth
                onClick={this.back.bind(this)}
                variant="outlined"
                className={classes.button2}
              >
                {this.props.t("back")}
              </Button>
            )}

            <Button
              fullWidth
              onClick={this.approve.bind(this)}
              variant="outlined"
              className={classes.button2}
            >
              {this.props.t("approve")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  createDoneButton(classes, condition) {
    return (
      <div
        style={{
          width: 950,
          display: "flex",
          alignItems: "space-between",
          justifyContent: "space-between"
        }}
      >
        <Button
          fullWidth
          onClick={this.back.bind(this, condition)}
          variant="outlined"
          className={classes.button2}
        >
          {this.props.t("back")}
        </Button>
        <Button
          fullWidth
          onClick={this.done.bind(this, condition)}
          variant="outlined"
          className={classes.button2}
        >
          {this.props.t("summary")}
        </Button>
      </div>
    );
  }

  createRadioSelection(classes, conditions) {
    return (
      <div
        style={{
          width: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start"
        }}
      >
        <FormLabel component="legend">
          {this.props.t(conditions.label)}
        </FormLabel>
        <RadioGroup
          aria-label={conditions.label}
          name={conditions.label}
          className={classes.group}
          value={this.state[conditions.key]}
          onChange={this.handleChange(conditions.key)}
        >
          {conditions.values.map(condition => (
            <FormControlLabel
              value={condition.key}
              control={<Radio />}
              label={this.props.t(condition.label)}
            />
          ))}
        </RadioGroup>
      </div>
    );
  }
  renderApproveDialog(classes) {
    const { loading, success } = this.state;

    const buttonClassname = classNames({
      [classes.buttonSuccess]: success
    });
    return (
      <div>
        <Dialog
          open={this.state.open}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {this.props.t("signRequest")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.props.t("confirmRequest")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              <div style={{ color: "gray" }}> {this.props.t("cancel")}</div>
            </Button>
            <Button
              className={buttonClassname}
              disabled={loading}
              onClick={this.confirmRequest}
              color="primary"
            >
              <div style={{ color: success ? "white" : "gray" }}>
                {this.props.t("signRequest")}
              </div>
            </Button>
            {loading && (
              <LoadingCircular
                size={24}
                className={classes.buttonProgress}
                open
              />
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

WizardGen.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user
});
const mapDispatchToProps = {
  saveWizardForm
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(WizardGen)
);
