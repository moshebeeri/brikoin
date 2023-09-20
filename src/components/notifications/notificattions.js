import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { listenForNotification } from "../../UI/notifications/notificationUtils";
import { GenericList } from "../../UI/index";
import { withUser } from "../../UI/warappers/withUser";
import {
  saveNotification,
  listenNotification
} from "../../redux/actions/notifications";
import Grid from "@material-ui/core/Grid";
const LIST_DESCRIPTOR = {
  subject: { type: "text", width: 200 },
  message: { type: "text", width: 500 },
  read: { type: "checkBox", width: 30 }
};

function Notifications(props) {
  const [notifications, setNotification] = useState([]);
  listenForNotification(setNotification, props);
  return (
    <div
      style={{
        display: "flex",
        minHeight: 300,
        marginTop: "5%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
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
            <GenericList
              title={"notifications"}
              t={props.t}
              columnDescription={LIST_DESCRIPTOR}
              rows={notifications}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  notifications: state.notifications.list,
  loaded: state.notifications.loaded
});
const mapDispatchToProps = {
  saveNotification,
  listenNotification
};

export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(Notifications)
);
