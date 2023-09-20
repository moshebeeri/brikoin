import React, { useEffect, useReducer, useState } from "react";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { registerUser } from "../../redux/actions/login";
import { connect } from "react-redux";
import logo from '../../assets/googleLogo.png';

function SignInGoogle(props) {
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account"
  });
  return (
    <Button
      fullWidth
      disabled={props.disabled}
      variant="outlined"
      className={props.classes.buttonGoogle}
      onClick={signUp.bind(this, provider, props)}
    >
      <img style={{ width: 25, backgroundColor: "white" }} src={logo} />

      <div
        style={{
          width: "95%",
          marginRight: props.direction === "ltr" ? 25 : 0,
          marginLeft: props.direction === "ltr" ? 0 : 25
        }}
      >
        {props.t("SignUpWithGoogle")}
      </div>
    </Button>
  );
}

async function signUp(provider, props) {
  const{cookies} = props
  let result = await firebase.auth().signInWithPopup(provider);
  if (result.user) {
    props.registerUser(result.user, cookies ? cookies.get('brokerToken') : '');
  }
}

const mapStateToProps = state => ({
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  registerUser
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(SignInGoogle)
);
