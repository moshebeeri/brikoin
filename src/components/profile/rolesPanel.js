import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericForm } from "../../UI/index";
import { listenRoles, askRole } from "../../redux/actions/userRoles";
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
  role: "selector",
  documentOne: "fileUpload",
  documentTwo: "fileUpload"
};
const ROLE_DESCRIPTOR_EDIT = {
  role: "textView-translate",
  documentOne: "fileUpload",
  documentTwo: "fileUpload"
};

const SELECTORS = {
  role: [
    { label: "lawyer", value: "LAWYER" },
    { label: "broker", value: "BROKER" },
    { label: "construction", value: "CONSTRUCTION" },
    { label: "trustee", value: "TRUSTEE" }
  ]
};

class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = { listLoaded: false };
  }

  saveRole(entity) {
    const { user } = this.props;
    this.props.askRole(user, entity);
    this.props.history.goBack();
  }

  render() {
    const { roles, classes } = this.props;

    const roleId = this.props.location.pathname.substring(10)
      ? this.props.location.pathname.substring(10)
      : "";

    const userRole = roles ? roles.filter(role => role.id === roleId) : "";
    return (
      <div
        style={{
          marginTop: "10%",
          display: "flex",
          width:"80%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            marginTop: 3,
            display: "flex",
            width:"80%",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <Typography
            className={classes.textFieldClass}
            align="left"
            variant="h5"
          >
            {this.props.t("UserRole")}
          </Typography>
          <GenericForm
            buttonTitle={userRole && userRole.length > 0 ? "update" : "addRole"}
            entity={userRole && userRole.length > 0 ? userRole[0] : {}}
            t={this.props.t}
            selectorValues={SELECTORS}
            entityDescriptor={
              userRole && userRole.length > 0
                ? ROLE_DESCRIPTOR_EDIT
                : ROLE_DESCRIPTOR
            }
            save={this.saveRole.bind(this)}
          />
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    const { user, listenRoles } = this.props;
    if (user && !this.state.listLoaded) {
      listenRoles(user);
      this.setState({ listLoaded: true });
    }
  }

  componentDidMount() {
    const { user, listenRoles } = this.props;
    if (user && !this.state.listLoaded) {
      this.setState({ listLoaded: true });
      listenRoles(user);
    }
    window.scrollTo(0, 0);
  }
}

Roles.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  roles: state.userRoles.list,
  loaded: state.userRoles.loaded
});
const mapDispatchToProps = {
  listenRoles,
  askRole
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Roles)
);
