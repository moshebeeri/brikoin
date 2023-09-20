import React from "react";
import { connect } from "react-redux";
import { listenForPublicAccount } from "../../redux/actions/accounts";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import UserEntity from "./UserEntity";
import { withCusomeStyle } from "../warappers/withCusomeStyle";

class UserSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userSelected: "none" };
  }

  handleChange = name => event => {
    this.props.setState({
      [name]: event.target.value
    });
    this.setState({
      selectedUser: true
    });
  };

  filterUser() {
    const { publicUsers, roles, filter } = this.props;
    if (filter === "LAWYER") {
      const lawyers = roles.filter(
        role => role.role === "LAWYER" && role.approved
      );
      const lawyersIds =
        lawyers && lawyers.length > 0
          ? lawyers.map(lawyer => lawyer.userId)
          : [];
      return publicUsers.filter(user => lawyersIds.includes(user.userId));
    }
    if (filter === "TRUSTEE") {
      const lawyers = roles.filter(
        role => role.role === "TRUSTEE" && role.approved
      );
      const lawyersIds =
        lawyers && lawyers.length > 0
          ? lawyers.map(lawyer => lawyer.userId)
          : [];
      return publicUsers.filter(user => lawyersIds.includes(user.userId));
    }

    return publicUsers;
  }

  render() {
    const {
      classes,
      publicUsers,
      fieldKey,
      fieldValue,
      filter,
      minWidth
    } = this.props;
    const value = this.state.selectedUser
      ? this.props.state[fieldKey]
      : fieldValue;
    const filteredUseres = filter ? this.filterUser(filter) : publicUsers;
    return publicUsers && publicUsers.length > 0 ? (
      <div
        style={{
          minWidth: minWidth || 300,
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.selectorMargin}>
            <InputLabel
              htmlFor="age-customized-select"
              className={classes.bootstrapFormLabel}
            >
              {fieldKey ? this.props.t(fieldKey) : this.props.t("selectUser")}
            </InputLabel>
            <Select
              value={value || "none"}
              onChange={this.handleChange(fieldKey)}
            >
              <MenuItem value="none">
                <em>{this.props.t("None")}</em>
              </MenuItem>
              {filteredUseres.map(user => (
                <MenuItem classes={classes.menuItem} value={user.userId}>
                  {" "}
                  <UserEntity small user={user} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </div>
    ) : (
      <div />
    );
  }

  componentWillUpdate() {
    const { user, listenForPublicAccount, publicUserLoaded } = this.props;
    if (user && !publicUserLoaded) {
      listenForPublicAccount();
    }
  }

  componentDidMount() {
    const { user, listenForPublicAccount, publicUserLoaded } = this.props;
    if (user && !publicUserLoaded) {
      listenForPublicAccount();
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user,
    publicUsers: state.userAccounts.publicUUsers,
    publicUserLoaded: state.userAccounts.publicUserLoaded,
    roles: state.userRoles.rolesRequests,
    update: state.userAccounts.update
  };
};

const mapDispatchToProps = {
  listenForPublicAccount
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(UserSelector)
);
