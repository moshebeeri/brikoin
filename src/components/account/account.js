/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { connect } from "react-redux";
import Popup from "reactjs-popup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { addAccount, setActiveAccount } from "../../redux/actions/accounts";

/*
 * Create component.
 */

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

class Account extends Component {
  constructor(props, context) {
    super(props);

    // Get the contract ABI
    this.state = { showPopup: false };
  }
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  addAccount() {
    this.props.addAccount(
      this.state.accountId,
      this.props.user,
      this.state.accountName,
      this.state.accountPrivate
    );
    this.props.closePopup();
  }
  render() {
    const { classes, showPopup } = this.props;
    return (
      <Popup open={showPopup} position="right center">
        <form className={classes.container} noValidate autoComplete="off" />

        <div style={{ flex: 1 }}>
          <TextField
            label="Account Name"
            id="accountName"
            className={classes.textField}
            value={this.state.estimatorSecondName}
            onChange={this.handleChange("accountName")}
            margin="normal"
            fullWidth
            type="string"
          />
          <TextField
            label="Account Id"
            id="accountId"
            className={classes.textField}
            value={this.state.estimatorSecondName}
            onChange={this.handleChange("accountId")}
            margin="normal"
            fullWidth
            type="string"
          />
          <TextField
            label="Account Private key "
            id="accountPrivate"
            className={classes.textField}
            value={this.state.estimatorSecondName}
            onChange={this.handleChange("accountPrivate")}
            margin="normal"
            fullWidth
            type="password"
          />
        </div>
        <Button color={"primary"} onClick={this.addAccount.bind(this)}>
          Add Account
        </Button>
      </Popup>
    );
  }
}

/*
 * Export connected component.
 */
Account.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    contracts: state.contracts,
    user: state.login.user,
    userAccounts: state.userAccounts.accounts,
    activeAccount: state.userAccounts.activeAccount
  };
};

const mapDispatchToProps = {
  addAccount,
  setActiveAccount
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Account)
);
