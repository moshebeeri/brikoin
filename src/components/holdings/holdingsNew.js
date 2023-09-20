import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  DataTypeProvider,
  RowDetailState,
  SummaryState
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableRowDetail
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import {
  getProjectsMarketPrice,
  getUserProjectsTrades
} from "../../redux/selectors/tradesSelector";
import {
  getMortgageClearances,
  getMortgagesNextPayment
} from "../../redux/selectors/mortgaegsSelector";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import { config } from "../../conf/config";
import {
  initProjectStats,
  initUserProjectStats,
  listenForProjects
} from "../../redux/actions/trade";
import HoldingsSummary from "./holdingsSummary";
import ProjectsYields from "./incomes";
import PendingOrders from "./pendingOrders";
import ProjectsTrades from "./trades";
import MortgagePendingRows from "./mortgagePendingRow";
import MortgagePendingRow from "./mortgagePendingRow";
import MortgageDetails from "./mortgagesDetails";
import ClearanceDetails from "./clearanceDetails";
import HoldingPendingRow from "./holdingPendingRow";
import { NavLink } from "react-router-dom";
import numberUtils from "../../utils/numberUtils";
import { withUserLedger } from "../../UI/warappers/withUserLedger";
import LoadingCircular from "../../UI/loading/LoadingCircular";
const ProjectNameFormater = ({ value }) => {
  const link = value.substring(0, value.indexOf("##"));
  const name = value.substring(value.indexOf("##") + 2);
  return (
    <NavLink
      style={{
        textDecoration: "none",
        fontSize: 14
      }}
      to={link}
    >
      {name}
    </NavLink>
  );
};
const ColumFormater = col => {
  return (
    <div
      style={{
        display: "flex",
        fontWeight: "bold",
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14
      }}
    >
      {col.column.title}
    </div>
  );
};
const ProjectTitleFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);
const StatusTitleFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start"
    }}
  >
    <ErrorOutline />
    <div style={{ marginRight: 5, marginLeft: 5 }}>
      <Typography align="left" variant="h6" color="textPrimary">
        {value}
      </Typography>
    </div>
  </div>
);
const PrecentFormater = ({ value }) => {
  if (value === "-") {
    return value;
  }
  if (value === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div style={{ marginRight: 5, marginLeft: 5 }}>
          <div style={{ fontSize: 14 }}>{value}%</div>
        </div>
      </div>
    );
  }
  if (!value) {
    return "-";
  }
  if (value > 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div style={{ marginRight: 5, marginLeft: 5 }}>
          <div style={{ fontSize: 14, color: "#4AA24E" }}>
            {value.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <div style={{ marginRight: 5, marginLeft: 5 }}>
        <div style={{ fontSize: 14, color: "#DF3D2D" }}>
          {value.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};
const RowDetail = ({ row }) => (
  <div>
    {row.position ? <HoldingPendingRow row={row.position} /> : ""}
    {row.pendingMortgages && row.pendingMortgages.length > 0 ? (
      <MortgagePendingRow rows={row.pendingMortgages} />
    ) : (
      ""
    )}
  </div>
);
const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);
const ProjectNameProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNameFormater} {...props} />
);
const StatusTypeProvider = props => (
  <DataTypeProvider formatterComponent={StatusTitleFormater} {...props} />
);
const PrecentTypeProvider = props => (
  <DataTypeProvider formatterComponent={PrecentFormater} {...props} />
);
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
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
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
      marginTop: 30,
      flexDirection: "column"
    },
    cardRow: {
      display: "flex",
      marginLeft: "10%",
      marginRight: "10%",
      width: "100%",
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
    },
    progress: {
      margin: theme.spacing.unit * 2
    }
  };
};

class HoldingsNew extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columnWidths: [
        { columnName: "project", width: 170 },
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "status", width: 120 },
        // { columnName: 'mortgage', width: 100 },
        // { columnName: 'mortgageClearance', width: 150 },
        { columnName: "income", width: 80 },
        // { columnName: 'mortgage', width: 70 },
        { columnName: "volume", width: 100 },
        { columnName: "investment", width: 100 },
        { columnName: "est", width: 100 },
        { columnName: "yieldPercent", width: 80 },
        { columnName: "yieldTotalPercent", width: 80 }
      ],
      totalSummaryItems: [
        { columnName: "investment", type: "totalInvestment" },
        { columnName: "est", type: "totalInvestmentEst" },
        { columnName: "income", type: "incomeTotal" }
      ],
      expandedRowIds: []
    };
    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  render() {
    const { expandedRowIds, columnWidths, totalSummaryItems } = this.state;
    const {
      init,
      projects,
      classes,
      holdings,
      projectsMarketPrice,
      projectsTradesAmount,
      topAsks,
      userProjectPosition,
      mortgageRequests,
      lang,
      nextPayments,
      user,
      mortgageClearance,
      mortgagePayments
    } = this.props;
    const columns = this.columnsDefinitions();
     
    if (projects && projects.length > 0 && holdings && holdings.length > 0) {
      const projectMaps = projects.reduce(function(map, obj) {
        map[obj.address] = obj;
        return map;
      }, {});
      const filteredHoldings = holdings.filter(
        holding =>
          projectMaps[holding.projectAddress] &&
          !projectMaps[holding.projectAddress].fundingProject
      );
      const rows = filteredHoldings.map(holding => {
        return this.holdingToRow(
          holding,
          userProjectPosition,
          topAsks,
          projectMaps,
          lang,
          projectsMarketPrice,
          mortgageRequests,
          user,
          nextPayments,
          projectsTradesAmount,
          mortgageClearance
        );
      }).filter(row => row);
      return (
        <div
          style={{
            marginTop: 65,
            backgroundColor: "white",
            display: "flex",
            minHeight: 400,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          {this.createTableHeader(classes)}

          <HoldingsSummary t={this.props.t} />
          {rows.length > 0 &&
            this.createTable(
              rows,
              columns,
              totalSummaryItems,
              expandedRowIds,
              columnWidths
            )}
          <MortgagePendingRows t={this.props.t} />
          {/*<PendingOrders t={this.props.t} location={this.props.location} />*/}
          <ProjectsYields
            t={this.props.t}
            location={this.props.location}
            openDialog={this.state.yieldsOpen}
            closeDialog={this.closeYieldDialeg.bind(this)}
            value={500}
          />
          <ProjectsTrades
            t={this.props.t}
            location={this.props.location}
            openDialog={this.state.investmentsOpen}
          />
          <MortgageDetails
            t={this.props.t}
            location={this.props.location}
            openDialog={this.state.mortgagesOpen}
            closeDialog={this.closeMortgagesdDialeg.bind(this)}
          />
          <ClearanceDetails
            t={this.props.t}
            location={this.props.location}
            openDialog={this.state.clearancedDialog}
            closeDialog={this.closeClearancedDialeg.bind(this)}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          marginTop: 65,
          backgroundColor: "white",
          display: "flex",
          minHeight: 400,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItem: "center",
            width: "100%",
            justifyContent: "center"
          }}
        >
          {this.createTableHeader(classes)}
        </div>

        <PendingOrders t={this.props.t} location={this.props.location} />
        <MortgagePendingRows
          mortgagePayments={mortgagePayments}
          projects={projects}
          t={this.props.t}
        />
      </div>
    );
  }

  holdingToRow(
    holding,
    userProjectPosition,
    topAsks,
    projectMaps,
    lang,
    projectsMarketPrice,
    mortgageRequests,
    user,
    nextPayments,
    projectsTradesAmount,
    mortgageClearance
  ) {
    let income = 0;
    if (holding.yields) {
      Object.keys(holding.yields).map(key => {
        income = income + holding.yields[key].amount;
      });
    }
    const link = `/projectsView/${holding.projectAddress}`;
    const holdingsLink = `/holdings/${holding.projectAddress}/yield`;
    const investmentsLink = `/holdings/${holding.projectAddress}/investments`;
    const mortgageLink = `/holdings/${holding.projectAddress}/mortgage`;
    const clearancesLink = `/holdings/${holding.projectAddress}/clearances`;
    const userPosition = userProjectPosition
      ? userProjectPosition[holding.projectAddress]
      : "";
    const projectAsks = topAsks[holding.projectAddress];
    const filteredAsks =
      projectAsks && Object.keys(projectAsks).length > 0
        ? projectAsks.filter(ask => ask.state === "initial" && ask.active)
        : [];
    const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";
    const project = projectMaps[holding.projectAddress];
    const projectName =
      lang !== "En" &&
      project.lang &&
      project.lang[lang] &&
      project.lang[lang].name
        ? project.lang[lang].name
        : project.name;
    const est = holding.holdings * projectsMarketPrice[holding.projectAddress];
    const mortgages =
      mortgageRequests && mortgageRequests[holding.projectAddress]
        ? mortgageRequests[holding.projectAddress].filter(
            request => request.trade && request.user === user.uid
          )
        : [];
    const clerances = mortgages
      .map(mortgage => mortgageClearance[mortgage.mortgageAddress])
      .filter(obj => obj);
    const pendingMortgages =
      mortgageRequests && mortgageRequests[holding.projectAddress]
        ? mortgageRequests[holding.projectAddress].filter(
            request => !request.trade && request.user === user.uid
          )
        : [];
    const payments =
      mortgages.length > 0
        ? mortgages.map(request => nextPayments[request.key])
        : [];
    const mortgageTotal =
      payments.length > 0
        ? payments.reduce(
            (sum, request) =>
              sum +
              request.remainingLoanBalnce +
              request.scheduledMonthlyPayment,
            0
          )
        : 0;
    let row = this.createRow(
      link,
      projectName,
      projectMaps,
      holding,
      projectsTradesAmount,
      projectInitialAsk,
      income,
      holdingsLink,
      mortgageTotal,
      mortgageLink,
      investmentsLink,
      est,
      userPosition,
      pendingMortgages,
      clerances,
      clearancesLink
    );
    return row;
  }

  createTableHeader(classes) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "center"
        }}
      >
        <div>
          <CardContent className={classes.details}>
            <Typography align="left" variant="h5">
              {this.props.t("Holdings")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("HoldingsMsg")}
            </Typography>
          </CardContent>
        </div>
      </div>
    );
  }

  createTable(rows, columns, totalSummaryItems, expandedRowIds, columnWidths) {
    return (
      <Paper
        style={{
          marginTop: 40,
          width: "80%",
          boxShadow: "none",
          borderWidth: 1,
          borderColor: "#e5e5e5",
          borderStyle: "solid"
        }}
      >
        <Grid rows={rows} columns={columns}>
          <ProjectTypeProvider for={["volume", "est"]} />
          <StatusTypeProvider for={["status"]} />

          <ProjectNameProvider
            for={[
              "project",
              "income",
              "investment",
              "mortgage",
              "mortgageClearance"
            ]}
          />

          <SummaryState totalItems={totalSummaryItems} />

          <PrecentTypeProvider for={["yieldPercent", "yieldTotalPercent"]} />
          <RowDetailState
            expandedRowIds={expandedRowIds}
            onExpandedRowIdsChange={this.changeExpandedDetails}
          />
          <Table columnExtensions={columnWidths} />

          <TableHeaderRow contentComponent={ColumFormater} />

          <TableRowDetail contentComponent={RowDetail} />
        </Grid>
      </Paper>
    );
  }

  createRow(
    link,
    projectName,
    projectMaps,
    holding,
    projectsTradesAmount,
    projectInitialAsk,
    income,
    holdingsLink,
    mortgageTotal,
    mortgageLink,
    investmentsLink,
    est,
    userPosition,
    pendingMortgages,
    clearances,
    clearancesLink
  ) {
    const { totalInvested } = this.props;
    let projectInvestment =
      totalInvested && totalInvested.length > 0
        && totalInvested.filter(
            investment => investment.projectAddress === holding.projectAddress
          ).lenght > 0 ? totalInvested.filter(
            investment => investment.projectAddress === holding.projectAddress
          )[0].totalBalance
        : 0;
    return {
      project: link + "##" + projectName,
      description: projectMaps[holding.projectAddress].description,
      generalStatus: projectsTradesAmount[holding.projectAddress]
        ? projectInitialAsk
          ? "Initial Offering"
          : ""
        : "-",
      status: projectsTradesAmount[holding.projectAddress]
        ? projectInitialAsk
          ? this.props.t("HOLD")
          : this.props.t("TRADEABLE")
        : "-",
      income:
        income > 0
          ? holdingsLink +
            "##" +
            (income / config.stoneRatio)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")
          : "-",
      mortgage:
        mortgageTotal > 0
          ? mortgageLink + "##" + numberUtils.formatNumber(mortgageTotal, 0)
          : "-",
      volume: numberUtils.formatNumber(holding.holdings, 0),
      investment:
        totalInvested && totalInvested.length > 0
          ? investmentsLink +
            "##" +
            numberUtils.formatNumber(projectInvestment, 0)
          : "-",
      est: projectsTradesAmount[holding.projectAddress]
        ? numberUtils.formatNumber(est, 0)
        : "-",
      yieldPercent:
        totalInvested && totalInvested.length  > 0 && projectInvestment > 0
          ? ((est - projectInvestment) / projectInvestment) * 100
          : "-",
      yieldTotalPercent:
        totalInvested && totalInvested.length > 0 && projectInvestment > 0
          ? ((est + income / config.stoneRatio - projectInvestment) /
              projectInvestment) *
            100
          : "-",
      position: userPosition,
      mortgageClearance:
        clearances && clearances.length > 0
          ? clearancesLink +
            "##" +
            numberUtils.formatNumber(
              clearances.reduce(function(accumulator, value) {
                return accumulator + parseFloat(value.normalizedClearance);
              }, 0),
              2
            )
          : "",
      pendingMortgages: pendingMortgages
    };
  }

  columnsDefinitions() {
    return [
      { name: "project", title: " " },
      // { name: 'generalStatus', title: ' ' },
      { name: "status", title: this.props.t("status") },
      // {name: 'mortgage', title: this.props.t('Mortgage')},
      // {name: 'mortgageClearance', title: this.props.t('mortgageClearance')},
      { name: "income", title: this.props.t("Income") },
      // { name: 'mortgage', title: 'Mortgage' },
      { name: "volume", title: this.props.t("Volume") },
      { name: "investment", title: this.props.t("Investment") },
      { name: "est", title: this.props.t("Est") },
      { name: "yieldPercent", title: this.props.t("EstP") },
      { name: "yieldTotalPercent", title: this.props.t("TotalP") }
    ];
  }

  closeYieldDialeg() {
    this.setState({ yieldsOpen: false });
  }

  closeMortgagesdDialeg() {
    this.setState({ yieldsOpen: false });
  }

  closeClearancedDialeg() {
    this.setState({ clearancedDialog: false });
  }

  componentDidUpdate() {
    const { user, init } = this.props;
    const holdingsParams = this.props.location.pathname.split("/");
    if (holdingsParams.length > 2 && holdingsParams[3] === "yield") {
      this.setState({ yieldsOpen: true });
    } else {
      this.setState({ yieldsOpen: false });
    }
    if (holdingsParams.length > 2 && holdingsParams[3] === "investments") {
      this.setState({ investmentsOpen: true });
    } else {
      this.setState({ investmentsOpen: false });
    }
    if (holdingsParams.length > 2 && holdingsParams[3] === "mortgage") {
      this.setState({ mortgagesOpen: true });
    } else {
      this.setState({ mortgagesOpen: false });
    }
    if (holdingsParams.length > 2 && holdingsParams[3] === "clearances") {
      this.setState({ clearancedDialog: true });
    } else {
      this.setState({ clearancedDialog: false });
    }
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.initUserProjectStats(user.uid);
    }
    this.props.initProjectStats();
    window.scrollTo(0, 0);
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  holdings: state.userAccounts.holdings,
  update: state.userAccounts.update,
  activeAccount: state.userAccounts.activeAccount,
  projects: getAllProject(state, props),
  projectsMarketPrice: getProjectsMarketPrice(state, props),
  projectsTradesAmount: getUserProjectsTrades(state, props),
  nextPayments: getMortgagesNextPayment(state, props),
  userProjectPosition: state.trades.userProjectPosition,
  mortgageRequests: state.mortgage.mortgageRequests,
  mortgagePayments: state.mortgage.mortgagePayments,
  projectTradesStats: state.projectTradesStats,
  mortgageClearance: getMortgageClearances(state, props),
  lang: state.userProfileReducer.lang,
  topAsks: state.trades.topAsks
});
const mapDispatchToProps = {
  listenForProjects,
  initUserProjectStats,
  initProjectStats
};
export default withUserLedger(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(HoldingsNew))
);
