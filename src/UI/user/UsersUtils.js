/**
 * Created by roi on 12/08/2019.
 */
import React, { useEffect, useReducer, useState } from "react";
import {
  useList,
  useObject,
  useObjectVal
} from "react-firebase-hooks/database";
import firebase from "firebase";

export function listenForPublicUsers(setPublicUsers, setReduxPulbicUsers) {
  const [values, loading, error] = useObjectVal(
    firebase.database().ref(`server/usersPublic`)
  );
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/usersPublic`)
  );
  useEffect(() => {
    let users = getUsers(values);
    setPublicUsers(users);
    if (users.length > 0) {
      setReduxPulbicUsers(users);
    }
  }, [snapshots, loading]);
}

function getUsers(users) {
  if (!users || Object.keys(users).length === 0) {
    return [];
  }
  return Object.keys(users).map(key => {
    let user = users[key];
    user.userId = key;
    return user;
  });
}
