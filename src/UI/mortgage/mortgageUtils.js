import React, { useEffect, useReducer, useState } from "react";
import { useListVals, useList } from "react-firebase-hooks/database";
import firebase from "firebase";
export function listenForMortgages(setRows, props) {
  const [values, loading, error] = useListVals(
    firebase.database().ref("server/mortgages")
  );
  const [snapshots, loadingMortgage, errorLoading] = useList(
    firebase.database().ref("server/mortgages")
  );
  useEffect(() => {
    setRows(getRequests(values, props));
  }, [snapshots, loading]);
}

export function listenForOrders(setOrders, props) {
  if (!props.user) {
    return;
  }
  const [values, loading, error] = useListVals(
    firebase
      .database()
      .ref(`server/projects/pendingOrders/${props.project.address}`)
      .orderByChild("userId")
      .equalTo(props.user.uid)
  );
  const [snapshots, loadingMortgage, errorLoading] = useList(
    firebase
      .database()
      .ref(`server/projects/pendingOrders/${props.project.address}`)
      .orderByChild("userId")
      .equalTo(props.user.uid)
  );
  useEffect(() => {
    setOrders(getActiveOrders(values));
  }, [snapshots, loading]);
}

function getActiveOrders(orders) {
  if (orders) {
    return orders.filter(order => order.active);
  }

  return [];
}

function getRequests(mortgages, props) {
  if (!props.user) {
    return [];
  }
  if (!mortgages || mortgages.length === 0) {
    return [];
  }
  let requestsArrays = [];
  mortgages.map(mortgage => {
    if (mortgage.mortgagesRequests) {
      requestsArrays.push(
        Object.keys(mortgage.mortgagesRequests).map(key => {
          let request = mortgage.mortgagesRequests[key];
          if (request.user === props.user.uid) {
            let project = props.projects
              ? props.projects.filter(
                  project => request.project === project.address
                )
              : [];
            request.project = project.length > 0 ? project[0] : request.project;
            return request;
          }
          return [];
        })
      );
    }
  });
  return [].concat.apply([], requestsArrays);
}
