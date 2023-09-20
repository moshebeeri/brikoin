import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SignInGoogle from "../../components/signup/signInGoogle";
import { login, signup } from "../../redux/actions/login";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import UserTerms from "./userTerms";

function LoginDialog(props) {
  const [open, setOpen] = useState(false);
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [laoding, setLoading] = useState(false);
  const {
    classes,
    errorMessage,
    title,
    variant,
    buttonString,
    className,
    direction
  } = props;
  const button = buttonString || props.t("login");
  const buttonClass = className || classes.button;
  return (
    <div>
      {variant ? (
        <Button
          variant="outlined"
          fullWidth
          className={buttonClass}
          onClick={setOpen.bind(this, true)}
        >
          {button}
        </Button>
      ) : (
        <Button
          fullWidth
          className={buttonClass}
          onClick={setOpen.bind(this, true)}
        >
          {button}
        </Button>
      )}
      <Dialog
        open={open}
        onClose={setOpen.bind(this, false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.t("login")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{title}</DialogContentText>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              dir={direction}
              style={{
                display: "flex",
                alignItems: "center",
                width: 350,
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <div dir={"ltr"} style={{ flex: 1 }}>
                <TextField
                  id="email"
                  label={props.t("email")}
                  className={classes.textFieldLogin}
                  value={email}
                  onChange={handleChange(setMail)}
                  margin="normal"
                  fullWidth
                />
              </div>
              <div dir={direction} style={{ flex: 1 }}>
                <TextField
                  id="password-input"
                  fullWidth
                  label={props.t("password")}
                  value={password}
                  onChange={handleChange(setPassword)}
                  className={classes.textFieldLogin}
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                />
              </div>
              <Button
                fullWidth
                variant="outlined"
                onClick={userLogin.bind(this, props, email, password)}
                className={props.classes.buttonContinue}
              >
                {props.t("continue")}
              </Button>

              {errorMessage && (
                <div style={{ marginTop: 2 }}> {errorMessage}</div>
              )}
              <div style={{ fontSize: 14 }}>{props.t("or")}</div>
              <div style={{ marginTop: 5, marginBottom: 10 }}>
                <SignInGoogle cookies={props.cookies}disabled={false} t={props.t} />
              </div>
              <UserTerms
                setLoading={setLoading}
                t={props.t}
                checked={checked}
                setChecked={setChecked}
              />

              <Button
                fullWidth
                variant="outlined"
                onClick={redirectToSignup.bind(this, props, setOpen)}
                className={props.classes.buttonSignUp}
              >
                {props.t("signUp")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function userLogin(props, email, password) {
  props.login(email, password);
}

function handleChange(setFunction) {
  return event => {
    setFunction(event.target.value);
  };
}

function redirectToSignup(props, setOpen) {
  setOpen(false);
  props.history.push("signup");
}

function handleChangeCheckBox(setFunction) {
  return event => {
    setFunction(event.target.checked);
  };
}

const mapStateToProps = state => {
  return {
    accountInit: state.userAccounts.accountInit,
    drizzleStatus: state.drizzleStatus,
    user: state.login.user,
    errorMessage: state.login.errorMessage,
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {
  login,
  signup
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(LoginDialog)
);
