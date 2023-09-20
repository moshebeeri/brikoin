import React, { useEffect, useReducer, useState } from "react";
import { useObjectVal, useListVals } from "react-firebase-hooks/database";
import firebase from "firebase";

export function listenForProjects(setProjects) {
  const [value, loading, error] = useObjectVal(
    firebase.database().ref(`server/projectsCollections/projects/`)
  );
  useEffect(() => {
    if (value) {
      setProjects(Object.keys(value).map(key => value[key]));
    }
  }, [loading]);
}
