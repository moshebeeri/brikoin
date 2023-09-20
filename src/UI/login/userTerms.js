import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { useObject } from "react-firebase-hooks/database";
import { login, signup } from "../../redux/actions/login";
import firebase from "firebase";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import LoadingCircular from "../../UI/loading/LoadingCircular";

function UserTerms(props) {
  const [privatePolicy, loadingPolicy, error] = useObject(
    firebase.database().ref("server/documents/privatePolicy")
  );
  const [userTerms, loadingTerms, errorTerms] = useObject(
    firebase.database().ref("server/documents/userTerms")
  );
  if (loadingPolicy || loadingTerms) {
    return (
      <div style={{ display: "flex", flexDirection: "row", height: 30 }}></div>
    );
  }
  if (!privatePolicy || !privatePolicy.node_ || !privatePolicy.node_.value_) {
    return (
      <div style={{ display: "flex", flexDirection: "row", height: 30 }}></div>
    );
  }
  if (!userTerms || !userTerms.node_ || !userTerms.node_.value_) {
    return (
      <div style={{ display: "flex", flexDirection: "row", height: 30 }}></div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "row", height: 30 }}>
      <span>{props.t("I accept the")} </span>
      <a href={userTerms.node_.value_}> {props.t("terms of use")} </a>
      <div style={{ margin: 1 }}></div>
      <span> {props.t("and")} </span>
      <div style={{ margin: 1 }}></div>
      <a href={privatePolicy.node_.value_}>{props.t("privacy policy")} </a>
    </div>
  );
}

function handleChangeCheckBox(setFunction) {
  return event => {
    setFunction(event.target.checked);
  };
}

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = {};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(UserTerms)
);
