export const types = {
  SAVE_NOTIFICATION: "SAVE_NOTIFICATION",
  SET_NOTIFICATION_READ: "SET_NOTIFICATION_READ",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  LISTEN_NOTIFICATIONS: "LISTEN_NOTIFICATIONS"
};
export const saveNotification = (user, entity) => {
  return {
    type: types.SAVE_NOTIFICATION,
    user,
    entity
  };
};
export const notificationRead = (user, notificationId) => {
  return {
    type: types.SET_NOTIFICATION_READ,
    user,
    notificationId
  };
};
export const listenNotification = user => {
  return {
    type: types.LISTEN_NOTIFICATIONS,
    user
  };
};
