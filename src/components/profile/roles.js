import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericList } from "../../UI/index";
import Button from "@material-ui/core/Button";
import { askRole, listenRoles } from "../../redux/actions/userRoles";
const styles = theme => {
  return {
    button2: {
      width: 200,
      fontSize: 16,
      color: "#3E79D6",
      borderColor: "#3E79D6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  };
};

const LIST_DESCRIPTOR = {
  role: { type: "text-translate", width: 100 },
  approved: { type: "checkBox", width: 100 },
  documentOne: { type: "fileDownload", width: 240 },
  documentTwo: { type: "fileDownload", width: 240 },
  id: {
    type: "redirectLink",
    width: 80,
    redirectLink: `/userRole/`,
    edit: true
  }
};

class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = { listen: false };
  }

  saveCase(entity) {
    const { user } = this.props;
    this.props.askRole(user, entity);
  }
  addRole() {
    this.props.history.push("/addRole");
  }

  render() {
    const { roles, classes } = this.props;
    return (
      <div
        style={{
          display: "flex",
          width:'75%',
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <GenericList
          add
          title={"UserRoles"}
          t={this.props.t}
          columnDescription={LIST_DESCRIPTOR}
          rows={roles}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            marginTop: 10,
            alignItems: "flex-end",
            justifyContent: "flex-end"
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            className={classes.button2}
            onClick={this.addRole.bind(this)}
          >
            {this.props.t("addRole")}
          </Button>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    const { user, listenRoles } = this.props;
    if (user && !this.state.listen) {
      listenRoles(user);
      this.setState({ listen: true });
    }
  }

  componentDidMount() {
    const { user, loaded, listenRoles } = this.props;
    if (user && !loaded) {
      listenRoles(user);
    }
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
  askRole,
  listenRoles
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Roles)
);
