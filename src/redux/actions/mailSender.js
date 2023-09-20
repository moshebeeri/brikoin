export const types = {
  SEND_MAIL: "SEND_MAIL"
};

export const sendMail = (to, subject, message) => ({
  type: types.SEND_MAIL,
  to,
  subject,
  message
});
