import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { signup, signUpErrorMessage } from "../../redux/actions/login";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import { ReCaptcha } from "react-recaptcha-google";
import { withCookies } from "react-cookie";
import Grid from "@material-ui/core/Grid";
import UserTerms from "../../UI/login/userTerms";

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
    menu: {
      width: 200
    },
    card: {
      display: "flex",
      width: 400,
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    cardSmall: {
      height: 150,
      width: 450,
      marginRight: "10%",
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    cardSmall2: {
      height: 150,
      width: 450,
      marginRight: "10%",
      marginTop: "5%",
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
    pos: {
      marginBottom: 12
    },
    button: {
      width: 100,
      height: 30
    }
  };
};

class Signup extends React.Component {
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
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  componentDidMount() {
    if (this.captchaDemo) {
      console.log("started, just a second...");
      this.captchaDemo.reset();
      // this.captchaDemo.execute()
      this.setState({ showCaptcha: true });
    }
  }
  onLoadRecaptcha() {
    if (this.captchaDemo) {
      this.captchaDemo.reset();
    }
  }
  verifyCallback(recaptchaToken) {
    // Here you will get the final recaptchaToken!!!
    console.log(recaptchaToken, "<= your recaptcha token");
    this.setState({ token: recaptchaToken });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  onCheckbox(event) {
    this.setState({ useExternal: event.target.checked });
  }

  userTerms(result) {
    this.setState({ userTerms: result });
  }

  signup() {
    const { signUpErrorMessage, cookies } = this.props;
    const {
      name,
      email,
      password,
      verifyPassword,
      useExternal,
      accountId
    } = this.state;
    if (password !== verifyPassword) {
      signUpErrorMessage(this.props.t("passwordNotMatchMsg"));
      return;
    }

    if (!this.state.token) {
      signUpErrorMessage(this.props.t("captchaMsg"));
      return;
    }

    if (useExternal && !accountId) {
      signUpErrorMessage(this.props.t("blockchainAccountSignUp"));
      return;
    }
    let brokerCookie = cookies.get("brokerId");
    this.props.signup(
      name,
      email,
      password,
      !useExternal,
      accountId,
      brokerCookie
    );
  }

  render() {
    const { classes, errorMessage, direction, lang } = this.props;
    const { errorMessageState } = this.state;
    const locale = lang === "En" ? "en" : "he-il";

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
          <Grid
            container
            direction="row"
            alignItems="flex-start"
            justify="center"
            spacing={16}
          >
            <Grid key="1" item>
              {this.signupPanel(
                classes,
                locale,
                direction,
                errorMessage,
                errorMessageState
              )}
            </Grid>
            {/*<Grid key='2' item>*/}

            {/*{this.informationPanel(classes)}*/}
            {/*</Grid>*/}
          </Grid>
        </div>
      </div>
    );
  }

  signupPanel(classes, locale, direction, errorMessage, errorMessageState) {
    return (
      <Card className={classes.card}>
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "flex-start"
              }}
            >
              <Typography
                className={classes.textFieldClass}
                align="left"
                variant="h5"
              >
                {this.props.t("signUp")}
              </Typography>
              {this.signupForm(classes)}
              {this.captcha(locale)}
              {this.userTermsForm(classes, direction)}
              {/*{this.externalWallet(classes, direction)}*/}
              {/*{this.state.useExternal && this.externalWalletForm(classes)}*/}
              {this.signupButton(classes)}
              {errorMessage && (
                <div style={{ color: "red", marginTop: 2 }}>
                  {" "}
                  {errorMessage}
                </div>
              )}
              {errorMessageState && (
                <div style={{ color: "red", marginTop: 2 }}>
                  {" "}
                  {errorMessageState}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  externalWalletForm(classes) {
    return (
      <div style={{ width: 280, flex: 1 }}>
        <TextField
          id="password-input"
          fullWidth
          label={this.props.t("accountId")}
          value={this.state.accountId}
          onChange={this.handleChange("accountId")}
          className={classes.textField}
          margin="normal"
        />
      </div>
    );
  }

  informationPanel(classes) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Card className={classes.cardSmall}>
          <CardContent>
            <Typography align="left" variant="h5">
              {" "}
              {this.props.t("Registration")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("RegistrationMsg")}
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.cardSmall2}>
          <CardContent>
            <Typography align="left" variant="h5">
              {this.props.t("externalVsInternal")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("regWDescription")}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  signupButton(classes) {
    return (
      <div
        style={{
          flex: 1,
          marginTop: 10,
          width: 280,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start"
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          className={classes.button}
          onClick={this.signup.bind(this)}
        >
          {this.props.t("submit")}
        </Button>
      </div>
    );
  }

  externalWallet(classes, direction) {
    return (
      <div
        style={{
          flex: 1,
          width: 280,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div
          style={{
            width: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Checkbox
            id="internal"
            fullWidth
            label={this.props.t("UseInternalWallet")}
            checked={this.state.useExternal}
            value={this.state.useExternal}
            onChange={this.onCheckbox.bind(this)}
            className={classes.textField}
            margin="normal"
          />
        </div>

        <div
          style={{
            marginRight: direction === "rtl" ? 20 : 0,
            marginLeft: direction === "rtl" ? 0 : 20
          }}
        >
          {this.props.t("cryptoMsg")}
        </div>
        <ErrorOutline style={{ marginLeft: 5, fontSize: 14 }} />
      </div>
    );
  }

  userTermsForm(classes, direction) {
    return (
      <div
        style={{
          flex: 1,
          width: 280,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <UserTerms
          t={this.props.t}
          checked={this.state.userTerms}
          setChecked={this.userTerms.bind(this)}
        />
      </div>
    );
  }

  captcha(locale) {
    return (
      <div>
        {/* You can replace captchaDemo with any ref word */}
        <ReCaptcha
          ref={el => {
            this.captchaDemo = el;
          }}
          size="normal"
          hl={locale}
          data-theme="dark"
          render="explicit"
          sitekey="6LcoP3cUAAAAAEd68d7PAuDg0h6OGO-dwRfdqk7S"
          onloadCallback={this.onLoadRecaptcha}
          verifyCallback={this.verifyCallback}
        />
        {/* <code> */}
        {/* 1. Add <strong>your site key</strong> in the ReCaptcha component. <br /> */}
        {/* 2. Check <strong>console</strong> to see the token. */}
        {/* </code> */}
      </div>
    );
  }

  signupForm(classes) {
    return (
      <div>
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
            id="email"
            label={this.props.t("email")}
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange("email")}
            margin="normal"
            fullWidth
          />
        </div>
        <div style={{ width: 280, flex: 1 }}>
          <TextField
            id="password"
            fullWidth
            label={this.props.t("password")}
            value={this.state.password}
            onChange={this.handleChange("password")}
            className={classes.textField}
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
        </div>
        <div style={{ width: 280, flex: 1 }}>
          <TextField
            id="password-input"
            fullWidth
            label={this.props.t("verifyPassword")}
            value={this.state.verifyPassword}
            onChange={this.handleChange("verifyPassword")}
            className={classes.textField}
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    if (this.props.loggedIn) {
      this.props.history.push("/");
    }
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  errorMessage: state.login.errorMessage,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {
  signup,
  signUpErrorMessage
};

export default withCookies(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Signup))
);
