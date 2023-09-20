import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { listenForNotification } from "../../UI/notifications/notificationUtils";
import { withUser } from "../../UI/warappers/withUser";
import {
  listenNotification,
  saveNotification
} from "../../redux/actions/notifications";
import { NavLink } from "react-router-dom";
import Notifications from "@material-ui/icons/NotificationsNone";
import { notificationRead } from "../../redux/actions/notifications";
import Lens from "@material-ui/icons/Lens";

function NotificationsHeader(props) {
  const [notifications, setNotification] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(
    window.location.pathname
  );
  const [lastLocation, setLastLocation] = useState("");
  useEffect(() => {
    if (lastLocation === "/notifications") {
      notifiactionsRead(notifications, props);
    }
  }, [lastLocation]);

  useEffect(() => {
    setLastLocation(currentLocation);
    setCurrentLocation(window.location.pathname);
  }, [props]);
  listenForNotification(setNotification, props);
  let notificationExist =
    notifications &&
    notifications.length > 0 &&
    notifications.filter(notification => !notification.read).length > 0;
  return (
    <div style={{ marginTop: 5 }}>
      <NavLink
        style={{
          textDecoration: "none",
          color: "black"
        }}
        to="/notifications"
      >
        <Notifications />{" "}
        {notificationExist && (
          <Lens
            style={{
              position: "absolute",
              bottom: 30,
              marginLeft: props.direction === "ltr" ? -16 : 0,
              marginRight: props.direction !== "ltr" ? -16 : 0,
              fontSize: 12,
              color: "red"
            }}
          />
        )}{" "}
      </NavLink>
    </div>
  );
}

function notifiactionsRead(notifications, props) {
  let unreadNotifications = notifications.filter(
    notification => !notification.read
  );
  if (unreadNotifications.length > 0) {
    unreadNotifications.forEach(notification =>
      props.notificationRead(props.user, notification.id)
    );
  }
}

const mapStateToProps = state => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  notificationRead
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(NotificationsHeader)
);
