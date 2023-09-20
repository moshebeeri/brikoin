import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Cases from "./lawyerCases";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
const styles = theme => {
  return {};
};

class LawyerManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.activeAccount ? props.activeAccount.name : "",
      email: props.user ? props.user.email : "",
      password: "",
      verifyPassword: "",
      userSelected: "",
      useExternal: false
    };
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            margin: 5,
            maxWidth: 1140,
            flexDirection: "column",
            marginTop: 90
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
              <Cases t={this.props.t} />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

LawyerManagement.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  errorMessage: state.login.errorMessage,
  passwordErrorMessage: state.login.passwordErrorMessage
});
const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(LawyerManagement)
);
