import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GenericForm } from "../../UI/index";
import { saveNotification } from "../../redux/actions/notifications";
import Typography from "@material-ui/core/Typography";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase";
import Grid from "@material-ui/core/Grid";
const CASE_DESCRIPTOR = {
  subject: "textView",
  message: "textView",
  read: "checkBox"
};
const SELECTORS = {};

function NotificationPanel(props) {
  const { classes, direction } = props;
  const notificationsId = getNotificationId(props);
  const [notificationsView, loading, error] = useObjectVal(
    firebase
      .database()
      .ref(`server/notifications/${props.user.uid}/${notificationsId}`)
  );
  const [notification, setNotification] = useState({});
  useEffect(() => {
    setNotification(notificationsView);
  }, [loading]);

  return (
    <div
      style={{
        marginTop: "10%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Typography
        className={classes.textFieldClass}
        align={direction === "ltr" ? "left" : "right"}
        variant="h5"
      >
        {props.t("notification")}
      </Typography>

      {!loading && (
        <div
          style={{
            display: "flex",
            margin: 5,
            maxWidth: 1140,
            flexDirection: "column"
          }}
        >
          <Grid
            container
            direction="row"
            alignItems="flex-start"
            justify="center"
            spacing={16}
          >
            <Grid key="1" item>
              <div style={{ marginTop: 3 }}>
                <GenericForm
                  entity={notification}
                  t={props.t}
                  selectorValues={SELECTORS}
                  entityDescriptor={CASE_DESCRIPTOR}
                  save={saveCase.bind(this, props)}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

function getNotificationId(props) {
  return props.location.pathname.substring(21)
    ? props.location.pathname.substring(21)
    : "";
}

function saveCase(props, entity) {
  const { user } = props;
  const notificationsId = getNotificationId(props);
  entity.id = notificationsId;
  props.saveNotification(user, entity);
  props.history.goBack();
}

NotificationPanel.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  direction: state.userProfileReducer.direction,
  loaded: state.notifications.loaded
});
const mapDispatchToProps = {
  saveNotification
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(NotificationPanel)
);
