import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericList } from "../../UI/index";
import { askRole, listenRolesAdmin } from "../../redux/actions/userRoles";
import { listenForPublicAccount } from "../../redux/actions/accounts";
const styles = theme => {
  return {
    button2: {
      width: 200,
      height: 20
    }
  };
};

const LIST_DESCRIPTOR = {
  role: { type: "text-translate", width: 100 },
  userId: { type: "user", width: 159 },
  approved: { type: "checkBox", width: 100 },
  documentOne: { type: "fileDownload", width: 240 },
  documentTwo: { type: "fileDownload", width: 240 },
  requestId: {
    type: "redirectLink",
    width: 80,
    redirectLink: `/adminRolesApprove/`,
    edit: true
  }
};

class AdminOperations extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loadList: false };
  }

  render() {
    const { roles, publicUsers } = this.props;
    return (
      <div
        style={{
          display: "flex",
          marginTop: "10%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <GenericList
          users={publicUsers}
          title={"UserRoles"}
          t={this.props.t}
          columnDescription={LIST_DESCRIPTOR}
          rows={roles}
        />
      </div>
    );
  }

  componentDidUpdate() {
    const { user, listenRolesAdmin, listenForPublicAccount } = this.props;
    if (user && !this.state.loadList) {
      listenRolesAdmin(user);
      listenForPublicAccount(user);
      this.setState({ loadList: true });
    }
  }

  componentDidMount() {
    const { user, listenRolesAdmin, listenForPublicAccount } = this.props;
    if (user && !this.state.loadList) {
      listenRolesAdmin(user);
      listenForPublicAccount(user);
      this.setState({ loadList: true });
    }
  }
}

AdminOperations.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  roles: state.userRoles.rolesRequests,
  publicUsers: state.userAccounts.publicUUsers,
  publicUserLoaded: state.userAccounts.publicUserLoaded,
  loaded: state.userRoles.rolesLoaded
});
const mapDispatchToProps = {
  askRole,
  listenRolesAdmin,
  listenForPublicAccount
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(AdminOperations)
);
