import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {
  changePassword,
  updateDetails,
  resetErrorProfiles
} from "../../redux/actions/login";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import BrokerPanel from "./brokerPanel";
import Grid from "@material-ui/core/Grid";
import Roles from "./roles";
import { UserAvatarEdit } from "../../UI/index";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { connect } from "react-redux";
import { ProjectSelector } from "../../UI/index";
import { ApproveDialog } from "../../UI/index";
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.activeAccount ? props.activeAccount.name : "",
      email: props.user ? props.user.email : "",
      password: "",
      description: "",
      website: "",
      verifyPassword: "",
      useExternal: false,
      showUpdateDialog: false
    };
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  closeDialog(){
    this.setState({showUpdateDialog: false})
  }

  updateDetails() {
    const { name, website, description } = this.state;
    this.setState({showUpdateDialog: true})
    this.props.resetErrorProfiles();
    if (this.props.user) {
      this.props.updateDetails(
        this.props.user.uid,
        this.props.activeAccount.id,
        name,
        this.state.image_file,
        website,
        description
      );
    }
  }

  changePassword() {
    this.setState({ errorMessageState: "" });
    const { password, verifyPassword } = this.state;
    if (password !== verifyPassword) {
      this.setState({
        errorMessageState: "verified password does not match password"
      });
    }
    this.props.changePassword(password);
  }

  render() {
    const {
      classes,
      errorMessage,
      activeAccount,
      passwordErrorMessage,
      user
    } = this.props;
    const { errorMessageState } = this.state;
   
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ marginTop: 60 }}>
          {this.userDetails(classes, errorMessage)}
        </div>
        {user.broker && <div style={{ marginTop: 10 }} >
          <BrokerPanel t={this.props.t} history={this.props.history}/>
        </div>}
        <div
          style={{
            display: "flex",
            margin: 5,
            maxWidth: 1140,
            flexDirection: "column",
            marginTop: 10
          }}
        >
          <Grid
            container
            direction="row"
            alignItems="flex-start"
            justify="center"
            spacing={16}
          >
            <Grid key="1" item>
              {this.passwordPanel(
                classes,
                passwordErrorMessage,
                errorMessageState
              )}
            </Grid>
            <Grid key="2" item>
              {this.walletDescription(classes, activeAccount)}
            </Grid>
            
          </Grid>
        </div>
       
        <div style={{ width: '80%',display:'flex',alignItems:'center',justifyContent:'center',marginTop: 10 }}>
          <Roles t={this.props.t} history={this.props.history} /> 
        </div>
      </div>
    );
  }

  walletDescription(classes, activeAccount) {
    const { direction } = this.props;
    return (
      <Card className={classes.formCardSmall}>
        <CardContent>
          <Typography
            align={direction === "ltr" ? "left" : "right"}
            variant="h5"
          >
            {" "}
            {this.props.t("Wallet")}
          </Typography>
          <Typography
            align={direction === "ltr" ? "left" : "right"}
            variant="h6"
            color="textSecondary"
          >
            {this.props.t("securityMsg")}
          </Typography>
          <div style={{ marginTop: 30 }}>
            <Typography
              align={direction === "ltr" ? "left" : "right"}
              variant="h6"
            >
              {this.props.t("blockchainAddress")}{" "}
            </Typography>
            <Card className={classes.formCardSmall2}>
              <CardContent>
                <div>{activeAccount.accountId}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  componentDidUpdate() {
    const { publicUsers, user, activeAccount } = this.props;
    const closeDialogAction = this.closeDialog.bind(this)
    if(this.state.showUpdateDialog){
      setTimeout(() => {
        closeDialogAction()
      }, 3000);
    }
    if (!user) {
      return;
    }
    if (!activeAccount) {
      return;
    }
    if (!this.state.name) {
      this.setState({ name: activeAccount.name });
    }
    if (!this.state.email && user.email) {
      this.setState({ email: user.email });
    }

    if (!publicUsers) {
      return;
    }

    const myPublic = publicUsers.filter(
      publicUser => publicUser.userId === user.uid
    );
    if (!myPublic || myPublic.length === 0) {
      return;
    }

    const publicUser = myPublic[0];
    if (!this.state.website && publicUser.website) {
      this.setState({ website: publicUser.website });
    }
    if (!this.state.description && publicUser.description) {
      this.setState({ description: publicUser.description });
    }
  }

  passwordPanel(classes, passwordErrorMessage, errorMessageState) {
    return (
      <Card className={classes.formCard}>
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "flex-start"
              }}
            >
              <div style={{ width: 280, flex: 1 }}>
                <TextField
                  id="password"
                  fullWidth
                  label={this.props.t("newPassword")}
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  className={classes.textField}
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                />
              </div>
              <div style={{ width: 280, flex: 1 }}>
                <TextField
                  id="password-input"
                  fullWidth
                  label={this.props.t("verifyPassword")}
                  value={this.state.verifyPassword}
                  onChange={this.handleChange("verifyPassword")}
                  className={classes.textField}
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                />
              </div>

              <div
                style={{
                  flex: 1,
                  marginTop: 10,
                  width: 280,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  className={classes.button}
                  onClick={this.changePassword.bind(this)}
                >
                  {this.props.t("changePassword")}
                </Button>
              </div>
              {passwordErrorMessage && (
                <div style={{ color: "red", marginTop: 2 }}>
                  {" "}
                  {passwordErrorMessage}
                </div>
              )}
              {errorMessageState && (
                <div style={{ color: "red", marginTop: 2 }}>
                  {" "}
                  {errorMessageState}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  userDetails(classes, errorMessage) {
    const {direction} = this.props
    return (
      <div dir={direction}>
      <Card className={classes.userDetailsCard}>
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off">
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              justify="flex-start"
              spacing={16}
            >
              <Grid key="1" item>
                <Grid
                  container
                  direction="column"
                  alignItems="flex-start"
                  justify="flex-start"
                  spacing={16}
                >
                  <Grid key="116" item>
                    <Typography
                      className={classes.textFieldClass}
                      align={this.props.direction === "ltr" ? "left" : "right"}
                      variant="h5"
                    >
                      {this.props.t("Profile")}
                    </Typography>
                  </Grid>
                  <Grid key="6" item>
                    <UserAvatarEdit
                      state={this.state}
                      setState={this.setState.bind(this)}
                      history={this.props.history}
                      t={this.props.t}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid key="11" item>
                <Grid
                  container
                  direction="column"
                  alignItems="flex-start"
                  justify="flex-start"
                  spacing={16}
                >
                  <Grid key="2" item>
                    <div dir={direction} style={{ width: 200, flex: 1 }}>
                      <TextField
                        id="name"
                        label={this.props.t("name")}
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange("name")}
                        margin="normal"
                        fullWidth
                      />
                    </div>
                  </Grid>
                  <Grid key="3" item>
                    <div style={{ width: 200, flex: 1 }}>
                      <TextField
                        id="email"
                        disabled
                        label={this.props.t("email")}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={this.handleChange("email")}
                        margin="normal"
                        fullWidth
                      />
                    </div>
                  </Grid>
                  <Grid key="3" item>
                    <div style={{ width: 200, flex: 1 }}>
                      <TextField
                        id="website"
                        label={this.props.t("website")}
                        className={classes.textField}
                        value={this.state.website}
                        onChange={this.handleChange("website")}
                        margin="normal"
                        fullWidth
                      />
                    </div>
                  </Grid>
                  <Grid key="3" item>
                    <div
                      style={{
                        width: this.props.width === "xs" ? 200 : 700,
                        flex: 1
                      }}
                    >
                      <TextField
                        id="description"
                        label={this.props.t("description")}
                        className={
                          this.props.width === "xs"
                            ? classes.textAreaSmall
                            : classes.textAreaMedium
                        }
                        value={this.state.description}
                        onChange={this.handleChange("description")}
                        margin="normal"
                        multiline={4}
                        fullWidth
                      />
                    </div>
                  </Grid>

                  <Grid key="3" item>
                    <div
                      style={{
                        width: this.props.width === "xs" ? 200 : 700,
                        flex: 1
                      }}
                    >
                      <ProjectSelector t={this.props.t} />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <div
                style={{
                  flex: 1,
                  marginTop: 10,
                  width: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  className={classes.button}
                  onClick={this.updateDetails.bind(this)}
                >
                  {this.props.t("updateDetails")}
                </Button>
                {errorMessage && (
                  <div style={{ color: "red", marginTop: 2 }}>
                    {" "}
                    {errorMessage}
                  </div>
                )}

                <ApproveDialog
                t={this.props.t}
                cancelAction={this.closeDialog.bind(this)}
                processDone={this.closeDialog.bind(this)}
                process={this.state.showUpdateDialog}
                hideAction
                processNow
                openDialog={this.state.showUpdateDialog}
                title={this.props.t("updateUserDetials")}
                approveMessage={this.props.t("updateUserDetialsMsg")}
              />
              </div>
            </Grid>
          </form>
        </CardContent>
      </Card>
      </div>
    );
  }

  componentDidMount() {
    this.props.resetErrorProfiles();
  }
}

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  activeAccount: state.userAccounts.activeAccount,
  errorMessage: state.login.errorMessage,
  publicUsers: state.userAccounts.publicUUsers,
  passwordErrorMessage: state.login.passwordErrorMessage
});
const mapDispatchToProps = {
  changePassword,
  updateDetails,
  resetErrorProfiles
};

export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(UserProfile)
);
