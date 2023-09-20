import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import deepPurple from "@material-ui/core/colors/deepPurple";
import IconButton from "@material-ui/core/IconButton";
const styles = theme => {
  return {
    avatar: {
      margin: 10
    },
    purpleAvatar: {
      margin: 5,
      width: 100,
      height: 100,
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

  render() {
    const { activeAccount } = this.props;
    return activeAccount ? this.createAvat() : <div />;
  }

  handleClick() {
    this.refs.fileUploader.click();
  }

  onChangeFile(event) {
    this.props.setState({
      image: event.target.value,
      image_file: event.target.files[0]
    });
  }
  createAvat() {
    const { classes, activeAccount, avatar } = this.props;
    let link = this.props.state.image_file
      ? window.URL.createObjectURL(this.props.state.image_file)
      : "";

    return (
      <div>
        <IconButton
          size="small"
          color="secondary"
          aria-label="Add"
          className={classes.icon}
          onClick={this.handleClick.bind(this)}
        >
          <Avatar src={link || avatar} className={classes.purpleAvatar}>
            {activeAccount.name.substring(0, 1)}
          </Avatar>
          <input
            type="file"
            id="file"
            ref="fileUploader"
            accept="image/gif, image/jpeg, image/png"
            onChange={this.onChangeFile.bind(this)}
            style={{ display: "none" }}
          />
        </IconButton>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user,
    activeAccount: state.userAccounts.activeAccount,
    avatar: state.userAccounts.avatar,
    direction: state.userProfileReducer.direction
  };
};

const mapDispatchToProps = {};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(UserAvatar)
);
