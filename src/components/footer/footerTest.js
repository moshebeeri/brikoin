import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { connect } from "react-redux";
import { trade, tradeExternalRequest } from "../../redux/actions/trade";
import Grid from "@material-ui/core/Grid";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import NotificationsFooter from "./footerNotifications";
import ProjectsLogs from "../projectsLog/projectsLogsFun";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
const styles = theme => {
  return {
    root: {
      flexGrow: 1,
      marginBottom: 40
    },
    rootGrid: {
      overflowX: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1
    },
    table: {
      minWidth: 700,
      width: "auto",
      tableLayout: "auto"
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    },
    card: {
      marginTop: "1%",
      width: "80%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      borderColor: "white"
    },
    cardDeveloper: {
      maxWidth: 400,
      position: "absolute",
      bottom: 0,
      right: 0
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    actions: {
      display: "flex"
    },
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      }),
      marginLeft: "auto"
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    },
    details: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "100%",
      marginTop: 30,
      flexDirection: "column"
    },
    cardRow: {
      display: "flex",
      marginLeft: "10%",
      marginRight: "10%",
      width: "60%",
      marginTop: "1%"
    },

    cover: {
      marginTop: "1%",
      marginLeft: 10,
      marginRight: 10,
      width: 180,
      height: 120
    },

    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  };
};

class Footer extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    const { classes } = this.props;
    if (!this.props.location) {
      return <div />;
    }
    if (this.props.location.pathname.indexOf("singleProject") > 0) {
      return <div />;
    }

    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: 100,
          marginTop: '20vh',
          flexDirection: "column",
          backgroundColor: "black"
        }}
      >
        <NotificationsFooter history={this.props.history} t={this.props.t} />
        <Grid justify="space-between" container className={classes.root}>
          <Grid item xs>
            <div
              style={{
                marginLeft: 100,
                marginRight: 100,
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                marginTop: 30
              }}
            >
              <NavLink
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: 16,
                  marginBottom: 20
                }}
                to="/projects"
              >
                {this.props.t("projects")}
              </NavLink>
              <div atyle={{ display: "flex", alignItems: "flex-start" }}>
                {/*<a style={{display: 'flex', alignItems: 'flex-start', fontSize: 12, color: 'white'}}*/}
                {/*href='https://moshebeeri.wixsite.com/brikoin/home'>{this.props.t('aboutUs')}</a>*/}

                {/*<a style={{display: 'flex', alignItems: 'flex-start', fontSize: 12, color: 'white'}}*/}
                {/*href='https://moshebeeri.wixsite.com/brikoin/contactUs'>{this.props.t('contactUs')}</a>*/}
                {/*<a style={{display: 'flex', alignItems: 'flex-start', fontSize: 12, color: 'white'}}*/}
                {/*href='https://moshebeeri.wixsite.com/brikoin/help'>{this.props.t('helpAndSupport')}</a>*/}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    fontSize: 12,
                    color: "white"
                  }}
                >
                  {this.props.t("privatePolicy")}
                </div>
              </div>
            </div>
          </Grid>
          {/*<Grid item xs >*/}
          {/*<div style={{display: 'flex', alignItems: 'flex-start', marginTop: 30, flexDirection: 'column'}}>*/}
          {/*<a style={{display: 'flex', alignItems: 'flex-start', fontSize: 16, color: 'white', marginBottom: 20}}*/}
          {/*href='https://moshebeeri.wixsite.com/brikoin/partners'>{this.props.t('partners')}</a>*/}

          {/*<div atyle={{display: 'flex', alignItems: 'flex-start'}}>*/}
          {/*<a style={{display: 'flex', alignItems: 'flex-start', fontSize: 12, color: 'white'}}*/}
          {/*href='https://moshebeeri.wixsite.com/brikoin/blog'>{this.props.t('blog')}</a>*/}
          {/*<a style={{display: 'flex', alignItems: 'flex-start', fontSize: 12, color: 'white'}}*/}
          {/*href='https://moshebeeri.wixsite.com/brikoin/press'>{this.props.t('press')}</a>*/}
          {/*</div>*/}
          {/*</div>*/}
          {/*</Grid>*/}

          <Grid item xs />
        </Grid>
        <div
          style={{
            width: "100%",
            display: "flex",
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 10,
            color: "white"
          }}
        >
          @copyright BriKoin LTD 2018 v1,.0
        </div>
        <ProjectsLogs />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  holdings: state.userAccounts.holdings,
  update: state.userAccounts.update,
  activeAccount: state.userAccounts.activeAccount,
  projects: getPopulatedProjects(state, props)
});
const mapDispatchToProps = {
  trade,
  tradeExternalRequest
};

export default withRouter(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Footer))
);
