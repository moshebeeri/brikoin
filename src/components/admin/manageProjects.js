import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericList } from "../../UI/index";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
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
  name: { type: "text-translate", width: 200 },
  address: { type: "text-translate", width: 200 },
  sellerLawyer: { type: "user", width: 200 },
  trustee: { type: "user", width: 200 },
  id: {
    type: "redirectLink",
    width: 80,
    redirectLink: `/manageProject/`,
    edit: true
  }
};

class AdminManageProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = { listen: false };
  }

  render() {
    const { projects, publicUsers } = this.props;
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
          title={"manageProjects"}
          t={this.props.t}
          columnDescription={LIST_DESCRIPTOR}
          rows={projects}
        />
      </div>
    );
  }

  componentDidUpdate() {
    const { user, listenRolesAdmin, listenForPublicAccount } = this.props;
    if (user && !this.state.listen) {
      listenRolesAdmin(user);
      listenForPublicAccount(user);
      this.setState({ listen: true });
    }
  }
}

AdminManageProjects.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  projects: getPopulatedProjects(state, props),
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
  connect(mapStateToProps, mapDispatchToProps)(AdminManageProjects)
);
