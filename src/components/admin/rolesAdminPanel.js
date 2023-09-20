import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericForm } from "../../UI/index";
import UserEntity from "../../UI/user/UserEntity";

import { approveRole } from "../../redux/actions/userRoles";
import { assignBroker } from "../../redux/actions/admin";
import Typography from "@material-ui/core/Typography";
const styles = theme => {
  return {
    textFieldClass: {
      width: 280,
      flex: 1
    }
  };
};

const ROLE_DESCRIPTOR = {
  role: "textView-translate",
  approve: "checkBox",
  documentOne: "fileUpload-View",
  documentTwo: "fileUpload-View"
};

class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  aaproveRole(entity) {
    const role = this.getRole();
    this.props.approveRole(role, entity);
    if(role.role === 'BROKER'){
      this.props.assignBroker(role.userId)
    }
    this.props.history.goBack();
  }

  getRole() {
    const { roles } = this.props;

    const roleId = this.props.location.pathname.substring(19)
      ? this.props.location.pathname.substring(19)
      : "";

    const userRole = roles
      ? roles.filter(role => role.requestId === roleId)
      : "";
    if (userRole.length > 0) {
      return userRole[0];
    }
    return "";
  }
  render() {
    const { classes, publicUsers, direction } = this.props;
    const userRole = this.getRole();
    const user =
      publicUsers && userRole
        ? publicUsers.filter(user => user.userId === userRole.userId)
        : [];
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
        <div
          style={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <Typography
            className={classes.textFieldClass}
            align={direction === "ltr" ? "left" : "right"}
            variant="h5"
          >
            {this.props.t("UserRole")}
          </Typography>
          {user && user.length > 0 && <UserEntity user={user[0]} />}
          <GenericForm
            buttonTitle={"approve"}
            entity={userRole || {}}
            t={this.props.t}
            entityDescriptor={ROLE_DESCRIPTOR}
            save={this.aaproveRole.bind(this)}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
}

Roles.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.login.user,
  publicUsers: state.userAccounts.publicUUsers,
  direction: state.userProfileReducer.direction,
  roles: state.userRoles.rolesRequests
});
const mapDispatchToProps = {
  approveRole, assignBroker
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Roles)
);
