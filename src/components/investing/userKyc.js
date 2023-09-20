import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ProjecHeadline from "./projectHeadline";
import CardContent from "@material-ui/core/CardContent";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import AccountBox from "@material-ui/icons/AccountBox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { connect } from 'react-redux';
import { sendKyc } from "../../redux/actions/mortgage";
const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 280,
      direction: "rtl"
    },
    menu: {
      width: 200
    },
    card: {
      marginTop: 20
    },
    cardSmall: {
      width: 380,
      height: 300,
      marginRight: "10%"
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
    },
    button: {
      width: 100,
      height: 20
    },
    button2: {
      marginRight: "12%",
      width: 100,
      height: 20
    },
    button3: {
      marginRight: "12%",
      marginLeft: "12%",
      width: 100,
      height: 20
    }
  };
};

class ProjectMortgages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      verifyPassword: "",
      showCaptcha: false,
      useExternal: false
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
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

  submitForm() {
    const projectAddress = this.props.location.pathname.substring(9)
      ? this.props.location.pathname.substring(9)
      : "";

    if (this.state.name) {
      const request = {
        name: this.state.name,
        file: this.state.pdf_file,
        phone: this.state.phone,
        address: this.state.address,
        identifier: this.state.identifier
      };
      this.props.sendKyc(request, this.props.user);
    }
  }

  render() {
    const { classes, lang, projects } = this.props;
    const { errorMessageState } = this.state;
    const locale = lang === "En" ? "en" : "he-il";
    const projectAddress = this.props.location.pathname.substring(9)
      ? this.props.location.pathname.substring(9)
      : "";
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    if (projects && projects.length > 0) {
      return (
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 90 }}
        >
          <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            <Typography
              className={classes.textFieldClass}
              align="left"
              variant="h5"
            >
              {this.props.t("InvestingProcessKyc")}
            </Typography>
          </div>
          <ProjecHeadline project={project} lang={lang} />
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              alignItem: "space-between",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                marginLeft: "10%"
              }}
            >
              <Card>
                <CardContent>
                  <form
                    className={classes.container}
                    noValidate
                    autoComplete="off"
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: "flex-start"
                      }}
                    >
                      <AccountBox
                        style={{ width: 50, height: 50, marginRight: 5 }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>
                          <div
                            style={{
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "flex-start",
                              fontSize: 15,
                              marginBottom: 10
                            }}
                          >
                            {this.props.t("kycProcess")}
                          </div>
                          <Typography
                            align="left"
                            variant="h6"
                            color="textSecondary"
                          >
                            {this.props.t("kycProcessMsg")}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <form
                    className={classes.container}
                    noValidate
                    autoComplete="off"
                  >
                    <div style={{ width: 280, flex: 1 }}>
                      <TextField
                        id="name"
                        label={this.props.t("name")}
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange("name")}
                        margin="normal"
                        fullWidth
                      />
                    </div>
                    <div style={{ width: 280, flex: 1 }}>
                      <TextField
                        id="phone"
                        label={this.props.t("phone")}
                        className={classes.textField}
                        value={this.state.phoneNumber}
                        onChange={this.handleChange("phone")}
                        margin="normal"
                        fullWidth
                      />
                    </div>
                    <div style={{ width: 280, flex: 1 }}>
                      <TextField
                        id="address"
                        fullWidth
                        label={this.props.t("address")}
                        value={this.state.address}
                        onChange={this.handleChange("address")}
                        className={classes.textField}
                        type="string"
                        margin="normal"
                      />
                    </div>
                    <div style={{ width: 280, flex: 1 }}>
                      <TextField
                        fullWidth
                        label={this.props.t("identifierNumber")}
                        value={this.state.identifier}
                        onChange={this.handleChange("identifier")}
                        className={classes.textField}
                        type="number"
                        margin="normal"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      Upload id document:
                      <input
                        id="pdf"
                        value={this.state.pdf}
                        className={classes.textField}
                        type="file"
                        accept="pdf"
                        onChange={this.handleChangeFile("pdf")}
                      />
                    </div>
                  </form>
                </CardContent>
                <div
                  style={{
                    display: "flex",
                    marginBottom: 5,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    width: "100%"
                  }}
                >
                  <Button
                    onClick={this.submitForm.bind(this)}
                    fullWidth
                    variant="outlined"
                    className={classes.button3}
                  >
                    {this.props.t("Next")}
                  </Button>
                </div>
              </Card>
            </div>
            <div
              style={{
                marginRight: "10%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Card className={classes.cardSmall}>
                <CardContent>
                  <Typography align="left" variant="h5">
                    {" "}
                    {this.props.t("InvestingProcess")}
                  </Typography>
                  <Typography align="left" variant="h6" color="textSecondary">
                    {this.props.t("InvestingProcessMsg")}
                  </Typography>
                  <div style={{ marginTop: 30 }}>
                    <Typography align="left" variant="h5">
                      {this.props.t("GettingMortgage")}
                    </Typography>
                    <Typography align="left" variant="h6" color="textSecondary">
                      {this.props.t("GettingMortgageDesc")}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  componentDidUpdate() {
    const { userKyc } = this.props;
    const projectAddress = this.props.location.pathname.substring(9)
      ? this.props.location.pathname.substring(9)
      : "";

    if (userKyc) {
      this.props.history.push("/projectMortgages/" + projectAddress);
    }
  }
}

ProjectMortgages.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  errorMessage: state.login.errorMessage,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang,
  projects: getPopulatedProjects(state, props),
  changed: state.trades.change,
  userKyc: state.userAccounts.kyc,
  activeAccount: state.userAccounts.activeAccount
});
const mapDispatchToProps = {
  sendKyc
};

export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(ProjectMortgages))