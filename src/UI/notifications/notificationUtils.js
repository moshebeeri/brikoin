import React, { useEffect, useReducer, useState } from "react";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase";

export function listenForNotification(setRows, props) {
  const [values, loading, error] = useObjectVal(
    firebase
      .database()
      .ref(`server/notifications/${props.user.uid}`)
      .orderByChild("read")
  );
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/notifications/${props.user.uid}`)
  );
  useEffect(() => {
    setRows(getRequests(values, props));
  }, [snapshots, loading]);
}

function getRequests(notifications, props) {
  if (!notifications || Object.keys(notifications).length === 0) {
    return [];
  }
  return Object.keys(notifications)
    .map(key => {
      let notification = notifications[key];
      notification.id = key;
      notification.message = props.t(notification.message);
      notification.subject = props.t(notification.subject);
      return notification;
    })
    .sort(function(a, b) {
      if (a.read && b.read) {
        return 1;
      }
      if (a.read || b.read) {
        return -1;
      }
    });
}
