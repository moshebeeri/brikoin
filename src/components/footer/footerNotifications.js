import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { listenForNotification } from "../../UI/notifications/notificationUtils";
import { withUser } from "../../UI/warappers/withUser";
import { notificationRead } from "../../redux/actions/notifications";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { format } from "../../utils/stringUtils";
import Done from "@material-ui/icons/Done";

function MySnackbarContentWrapper(props) {
  // const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  // const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      style={{ backgroundColor: "#70A1EE" }}
      // className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span
          id="client-snackbar"
          style={{
            display: "flex",
            alignItems: "flex-start"
          }}
        >
          <InfoIcon style={{ marginRight: 5, marginLeft: 5, fontSize: 30 }} />
          <div style={{ margin: 5, fontSize: 16 }}>{message}</div>
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <Done style={{ fontSize: 20 }} />
          </IconButton>
        </span>
      }
      action={[]}
    />
  );
}

function NotificationsHeader(props) {
  const [notifications, setNotification] = useState([]);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    let notificationExist =
      notifications &&
      notifications.length > 0 &&
      notifications.filter(notification => !notification.read).length > 0;
    if (notificationExist) {
      setOpen(true);
    }
  }, [notifications]);
  listenForNotification(setNotification, props);
  let notification = getLastNotification(notifications);
  return (
    <div style={{ marginTop: 5 }}>
      {notification && (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: props.direction === "ltr" ? "left" : "right"
          }}
          open={open}
          // autoHideDuration={6000}
          onClose={handleClose.bind(this, setOpen, notification, props)}
        >
          <MySnackbarContentWrapper
            onClose={handleClose.bind(this, setOpen, notification, props)}
            message={getNotificationMessage(notification, props)}
          />
        </Snackbar>
      )}
    </div>
  );
}

function getLastNotification(notifications) {
  if (notifications && notifications.length > 0) {
    let unReadNotification = notifications.filter(
      notification => !notification.read
    );
    if (unReadNotification.length > 0) {
      return unReadNotification[0];
    }
  }
  return "";
}

function getNotificationMessage(notification, props) {
  switch (notification.subject) {
    case props.t("operation"):
      return format(props.t("NewOperationMsg"), [notification.message]);
    case props.t("orderRequest"):
      let message = props.t(notification.message);
      return format(props.t("OrderMsg"), [message]);
    case props.t("groups"):
      return format(props.t("GroupsMeg"), [notification.message]);
    case props.t("trusteeCase"):
      return format(props.t("TrusteeMsg"), [notification.message]);
    case props.t("trusteeApproved"):
      return format(props.t("trusteeApproved"), [notification.message]);
    default:
      return notification.message;
  }
}

function redirectNotification(notification, props) {
  switch (notification.subject) {
    case props.t("groups"):
      return props.history.push(`/myGroups`);
    case props.t("negotiation"):
    case props.t("operation"):
    case props.t("orderRequest"):
      return notification.flowId ? props.history.push(`/operationHubV2/${notification.flowId}`) : props.history.push(`/operationHubList`);
    case props.t("trusteeCase"):
      if (notification.caseId) {
        return props.history.push(
          "/manageProjectBuyers/" + notification.caseId
        );
      }
    default:
      if (notification.project) {
        return props.history.push("/projectsView/" + notification.project);
      }
  }
}

function handleClose(setOpen, notification, props) {
  props.notificationRead(props.user, notification.id);
  setOpen(false);
  redirectNotification(notification, props);
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
