import React from "react";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import deepPurple from "@material-ui/core/colors/deepPurple";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import Fade from "@material-ui/core/Fade";
import { logout } from "../../redux/actions/login";
import { withCusomeStyle } from "../warappers/withCusomeStyle";

const styles = theme => {
  return {
    avatar: {
      margin: 10
    },
    purpleAvatar: {
      margin: 5,
      width: 30,
      height: 30,
      color: "#fff",
      backgroundColor: deepPurple[500]
    },
    menuItem: {
      // '&:focus': {
      //   backgroundColor: theme.palette.primary.main,
      //   '& $primary, & $icon': {
      //     color: theme.palette.common.white
      //   }
      // }
    },
    primary: {},
    icon: {}
  };
};

class UserAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { anchorEl: null };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const { activeAccount } = this.props;
    return activeAccount ? this.createAvatar() : <div />;
  }

  createAvatar() {
    const { classes, activeAccount, avatar, small } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton
          size="small"
          color="secondary"
          aria-label="Add"
          className={classes.icon}
          onClick={this.handleClick}
        >
          <Avatar src={avatar} className={classes.purpleAvatar}>
            {activeAccount.name.substring(0, 1)}
          </Avatar>
        </IconButton>
        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem
            onClick={this.redirectProfile.bind(this)}
            className={classes.menuItem}
          >
            <ListItemText
              classes={{ primary: classes.primary }}
              primary={this.props.t("ProfileSettings")}
            />
          </MenuItem>

          <MenuItem
            onClick={this.logOut.bind(this)}
            className={classes.menuItem}
          >
            <ListItemText
              classes={{ primary: classes.primary }}
              primary={this.props.t("Signout")}
            />
          </MenuItem>
        </Menu>
      </div>
    );
  }

  redirectProfile() {
    this.props.history.push("/profile");
    this.setState({ anchorEl: null });
  }

  logOut() {
    const { logout } = this.props;
    logout();
    this.setState({ anchorEl: null });
    this.props.history.push("/projects");
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user,
    avatar: state.userAccounts.avatar,
    activeAccount: state.userAccounts.activeAccount,
    direction: state.userProfileReducer.direction
  };
};

const mapDispatchToProps = {
  logout
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(UserAvatar)
);
