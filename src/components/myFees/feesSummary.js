import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { getUserFeesTotal } from "../../redux/selectors/feeSelector";
import numberUtils from "../../utils/numberUtils";
const styles = theme => {
  return {
    root: {
      width: "80%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginTop: 70,
      flexGrow: 1
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
      width: "70%",
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
class FeesSummary extends React.PureComponent {
  render() {
    const { classes, activeAccount, totalFees } = this.props;
    if (activeAccount) {
      return (
        <div style={{ width: "80%", marginTop: 20 }}>
          <Grid container spacing={12} direction="row" justify="space-between">
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <div>{this.props.t("totalFees")}</div>
                  <div
                    style={{ fontSize: 16, color: "black", fontWeight: "bold" }}
                  >
                    {numberUtils.formatNumber(totalFees, 2)}
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <div>{this.props.t("totalFeesPayed")}</div>
                  <div
                    style={{ fontSize: 16, color: "black", fontWeight: "bold" }}
                  >
                    {activeAccount.payedFees
                      ? numberUtils.formatNumber(activeAccount.payedFees, 2)
                      : 0}
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      );
    }
    return <div />;
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  totalFees: getUserFeesTotal(state, props)
});

export default withStyles(styles)(connect(mapStateToProps)(FeesSummary));
