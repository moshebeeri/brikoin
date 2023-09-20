import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ProjecHeadline from "./projectHeadline";
import MortgageView from "./mortgageView";
import CardContent from "@material-ui/core/CardContent";
import {
  getTopBidsAsks,
  getTopHistory
} from "../../redux/selectors/tradesSelector";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import AccountBalance from "@material-ui/icons/AccountBalance";
import { connect } from "react-redux";
import { ReCaptcha } from "react-recaptcha-google";
import Grid from "@material-ui/core/Grid";
import { calculateMortgage } from "../../redux/actions/mortgage";
const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 280,
      direction: "rtl"
    },
    menu: {
      width: 200
    },
    card: {
      marginTop: 20,
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    cardDescription: {
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid",
      width: "100%"
    },
    cardSmall: {
      width: 380,
      height: 300,
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
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
    },
    button: {
      width: 100,
      height: 20
    },
    button2: {
      marginRight: "12%",
      width: 100,
      height: 20
    },
    button3: {
      marginRight: "12%",
      marginLeft: "12%",
      width: 100,
      height: 20
    }
  };
};

class ProjectMortgages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      verifyPassword: "",
      showCaptcha: false,
      useExternal: false
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const {
      classes,
      lang,
      projects,
      projectsMortgages,
      calculateMortgage,
      userKyc
    } = this.props;
    const projectAddress = this.props.location.pathname.substring(18)
      ? this.props.location.pathname.substring(18)
      : "";
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    if (projects && projects.length > 0 && userKyc) {
      const mortgages = projectsMortgages[projectAddress];
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              margin: 5,
              maxWidth: 1140,
              flexDirection: "column",
              marginTop: 90
            }}
          >
            {this.title(classes)}
            <ProjecHeadline project={project} lang={lang} />
            <div
              style={{
                marginTop: 10,
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div style={{ display: "flex" }}>
                <Grid
                  container
                  direction="row"
                  alignItems="flex-start"
                  justify="center"
                  spacing={16}
                >
                  <Grid key="1" item>
                    {this.mortgageDescription(classes)}

                    {mortgages.map(mortgage =>
                      this.mortgageView(
                        classes,
                        projectAddress,
                        calculateMortgage,
                        mortgage
                      )
                    )}
                  </Grid>
                  <Grid key="2" item>
                    <div style={{ backgroundColor: "pink" }}>
                      {this.sidePanel(classes)}
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  sidePanel(classes) {
    return (
      <Card className={classes.cardSmall}>
        <CardContent>
          <Typography align="left" variant="h5">
            {" "}
            {this.props.t("InvestingProcess")}
          </Typography>
          <Typography align="left" variant="h6" color="textSecondary">
            {this.props.t("InvestingProcessMsg")}
          </Typography>
          <div style={{ marginTop: 30 }}>
            <Typography align="left" variant="h5">
              {this.props.t("GettingMortgage")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("GettingMortgageDesc")}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  mortgageView(classes, projectAddress, calculateMortgage, mortgage) {
    return (
      <div style={{ display: "flex", maxWidth: 600 }}>
        <Card className={classes.card}>
          <CardContent>
            <MortgageView
              projectAddress={projectAddress}
              history={this.props.history}
              calculateMortgage={calculateMortgage}
              t={this.props.t}
              mortgage={mortgage}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  mortgageDescription(classes) {
    return (
      <div style={{ display: "flex", maxWidth: 600 }}>
        <Card className={classes.cardDescription}>
          <CardContent>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  justifyContent: "flex-start"
                }}
              >
                <AccountBalance
                  style={{
                    width: 50,
                    height: 50,
                    marginLeft: 5,
                    marginRight: 5
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "flex-start",
                        fontSize: 15,
                        marginBottom: 10
                      }}
                    >
                      {this.props.t("mortgageOffering")}
                    </div>
                    <Typography align="left" variant="h6" color="textSecondary">
                      {this.props.t("gettingMortgageMsg")}
                    </Typography>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  title(classes) {
    return (
      <div style={{}}>
        <Typography
          className={classes.textFieldClass}
          align="left"
          variant="h5"
        >
          {this.props.t("InvestingProcessMortgage")}
        </Typography>
      </div>
    );
  }

  componentDidMount() {
    const { userKyc } = this.props;
    const projectAddress = this.props.location.pathname.substring(18)
      ? this.props.location.pathname.substring(18)
      : "";

    if (!userKyc) {
      this.props.history.push("/userKyc/" + projectAddress);
    }
    window.scrollTo(0, 0);
  }
}

ProjectMortgages.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  errorMessage: state.login.errorMessage,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang,
  projects: getPopulatedProjects(state, props),
  topHistory: getTopHistory(state, props),
  topBidsAsks: getTopBidsAsks(state, props),
  changed: state.trades.change,
  topAsks: state.trades.topAsks,
  activeAccount: state.userAccounts.activeAccount,
  userKyc: state.userAccounts.kyc,
  projectsMortgages: state.projects.projectsMortgages
});
const mapDispatchToProps = {
  calculateMortgage
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ProjectMortgages)
);
