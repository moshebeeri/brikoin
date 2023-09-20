import React, { useEffect, useReducer, useState } from "react";
import { useList } from "react-firebase-hooks/database";
import firebase from "firebase";

export function listenForCases(
  setLoadingCases,
  saveCases,
  setChanged,
  changed,
  userId
) {
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/cases/${userId}/changed`)
  );
  let getCases = firebase.functions().httpsCallable("caseApi/getMyCases");
  useEffect(() => {
    getCases({}).then(result => {
      setLoadingCases(false);
      saveCases(result.data);
      setChanged(!changed);
    });
  }, [snapshots]);
}
