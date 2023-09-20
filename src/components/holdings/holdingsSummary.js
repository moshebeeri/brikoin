import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import {
  getProjectsMarketPrice,
  getUserProjectsTrades
} from "../../redux/selectors/tradesSelector";
import { config } from "../../conf/config";
import numberUtils from "../../utils/numberUtils";
import { withUserLedger } from "../../UI/warappers/withUserLedger";
const styles = theme => {
  return {
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: "center",
      color: theme.palette.text.secondary,
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    }
  };
};
class HoldingsSummary extends React.PureComponent {
  render() {
    const {
      projects,
      classes,
      holdings,
      projectsMarketPrice,
      projectsTradesAmount,
      totalInvested
    } = this.props;

    if (projects && projects.length > 0 && holdings && holdings.length > 0) {
      const projectMaps = projects.reduce(function(map, obj) {
        map[obj.address] = obj;
        return map;
      }, {});
      const rows = this.createRows(
        holdings,
        projectsMarketPrice,
        projectMaps,
        projectsTradesAmount
      );
      let totalInvestments = totalInvested
        ? totalInvested
            .map(projectInvestment => projectInvestment.totalBalance)
            .reduce((a, b) => a + b, 0)
        : 0;
      let totalIncome = rows
        .map(row =>
          row.income === "-" ? 0 : parseFloat(row.income.split(",").join(""))
        )
        .reduce((a, b) => a + b, 0);
      let totalEstimate = rows
        .map(row =>
          row.est === "-" ? 0 : parseFloat(row.est.split(",").join(""))
        )
        .reduce((a, b) => a + b, 0);

      return (
        <div style={{ width: "80%", marginTop: 20 }}>
          <Grid container spacing={16} direction="row" justify="space-between">
            <Grid item>
              <Paper className={classes.paper}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <div>{this.props.t("totalIncome")}</div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 16,
                      width: 200,
                      color: "black",
                      fontWeight: "bold",
                      alignItems: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    {numberUtils.formatNumber(totalIncome, 0)}
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <div
                  style={{
                    display: "flex",
                    width: 200,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <div>{this.props.t("totalInvestment")}</div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 16,
                      width: 200,
                      color: "black",
                      fontWeight: "bold",
                      alignItems: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    {numberUtils.formatNumber(totalInvestments, 0)}
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <div
                  style={{
                    display: "flex",
                    width: 200,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <div>{this.props.t("totalEstimation")}</div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 16,
                      width: 200,
                      color: "black",
                      fontWeight: "bold",
                      alignItems: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    {numberUtils.formatNumber(totalEstimate, 0)}
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

  createRows(holdings, projectsMarketPrice, projectMaps, projectsTradesAmount) {
    return holdings
      .filter(holding => projectMaps[holding.projectAddress])
      .map(holding => {
        let income = 0;
        if (holding.yields) {
          Object.keys(holding.yields).map(key => {
            income = income + holding.yields[key].amount;
          });
        }
        const est =
          holding.holdings * projectsMarketPrice[holding.projectAddress];
        return {
          project: projectMaps[holding.projectAddress].name,
          income:
            income > 0 && !projectMaps[holding.projectAddress].fundingProject
              ? (income / config.stoneRatio)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")
              : "-",
          volume: parseInt(holding.holdings)
            .toFixed(1)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,"),
          investment:
            projectsTradesAmount[holding.projectAddress] &&
            !projectMaps[holding.projectAddress].fundingProject
              ? projectsTradesAmount[holding.projectAddress]
                  .toFixed(1)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")
              : "-",
          est:
            projectsTradesAmount[holding.projectAddress] &&
            !projectMaps[holding.projectAddress].fundingProject
              ? parseInt(est)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")
              : "-",
          yieldPercent: projectsTradesAmount[holding.projectAddress]
            ? ((est - projectsTradesAmount[holding.projectAddress]) /
                projectsTradesAmount[holding.projectAddress]) *
              100
            : "-",
          yieldTotalPercent: projectsTradesAmount[holding.projectAddress]
            ? ((est +
                income / config.stoneRatio -
                projectsTradesAmount[holding.projectAddress]) /
                projectsTradesAmount[holding.projectAddress]) *
              100
            : "-"
        };
      });
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  holdings: state.userAccounts.holdings,
  update: state.userAccounts.update,
  activeAccount: state.userAccounts.activeAccount,
  projects: getPopulatedProjects(state, props),
  projectsMarketPrice: getProjectsMarketPrice(state, props),
  projectsTradesAmount: getUserProjectsTrades(state, props)
});

export default withUserLedger(
  withStyles(styles)(connect(mapStateToProps)(HoldingsSummary))
);
