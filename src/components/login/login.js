import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { login } from "../../redux/actions/login";
import { showHome, showSignup } from "../../redux/actions/main";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    menu: {
      width: 200
    },
    card: {
      maxWidth: 275,
      marginTop: "10%"
    },
    grid: {
      flex: 1
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
    },
    title: {
      marginBottom: 16,
      fontSize: 14
    },
    pos: {
      marginBottom: 12
    }
  };
};

class Login extends React.Component {
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }
  state = {
    email: "",
    password: ""
  };

  login() {
    const { email, password } = this.state;
    this.props.login(email, password);
    this.state = {
      email: "",
      password: ""
    };
  }

  signup() {
    // this.props.login()
    this.props.showSignup();
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.loggedIn) {
      this.props.showHome();
    }
  }

  render() {
    const { classes, errorMessage } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "center"
        }}
      >
        <Card className={classes.card}>
          <CardContent>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                style={{
                  alignItems: "center",
                  flexDirection: "col",
                  justifyContent: "center"
                }}
              >
                <div style={{ flex: 1 }}>
                  <TextField
                    id="email"
                    label="Email"
                    className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange("email")}
                    margin="normal"
                    fullWidth
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    id="password-input"
                    fullWidth
                    label="Password"
                    value={this.state.password}
                    onChange={this.handleChange("password")}
                    className={classes.textField}
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                  />
                </div>

                <NavLink
                  style={{
                    textDecoration: "none",
                    marginLeft: 10,
                    marginRight: 10
                  }}
                  to="/"
                >
                  <div onClick={this.login.bind(this)}>login</div>
                </NavLink>

                {errorMessage && (
                  <div style={{ marginTop: 2 }}> {errorMessage}</div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItem: "center",
                    justifyContent: "center"
                  }}
                >
                  <div> Not registered yet?</div>
                  <NavLink
                    style={{
                      textDecoration: "none",
                      marginLeft: 10,
                      marginRight: 10
                    }}
                    to="/signUp"
                  >
                    signUp
                  </NavLink>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  errorMessage: state.login.errorMessage
});
const mapDispatchToProps = {
  login,
  showHome,
  showSignup
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
