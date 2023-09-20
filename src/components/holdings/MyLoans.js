import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { DataTypeProvider, SummaryState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import {
  getProjectsMarketPrice,
  getUserProjectsTrades
} from "../../redux/selectors/tradesSelector";
import {
  getMortgagesNextPayment,
  getMortgageClearances
} from "../../redux/selectors/mortgaegsSelector";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import {
  listenForProjects,
  initProjectStats,
  initUserProjectStats
} from "../../redux/actions/trade";
import ProjectsTrades from "./loans";
import HoldingPendingRow from "./holdingPendingRow";
import MortgagePendingRow from "./mortgagePendingRow";
import { NavLink } from "react-router-dom";
import numberUtils from "../../utils/numberUtils";
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
import LoadingCircular from "../../UI/loading/LoadingCircular";
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
      width: "80%",
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
      width: "100%",
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
class MyLoans extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "project", width: 170 },
        // { columnName: 'generalStatus', width: 100 },
        // { columnName: 'mortgage', width: 70 },
        { columnName: "loans", width: 100 },
        { columnName: "LoanMonth", width: 150 },
        { columnName: "yearInterest", width: 100 },
        { columnName: "est", width: 100 },
        { columnName: "yieldPercent", width: 80 }
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
      mortgageClearance
    } = this.props;
    const columns = this.columnsDefinitions();

    if (!init) {
      return (
        <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
          <LoadingCircular open className={classes.progress} />
        </div>
      );
    }
    if (projects && projects.length > 0 && holdings && holdings.length > 0) {
      const projectMaps = projects.reduce(function(map, obj) {
        map[obj.address] = obj;
        return map;
      }, {});
      const filteredHoldings = holdings.filter(
        holding =>
          projectMaps[holding.projectAddress] &&
          projectMaps[holding.projectAddress].fundingProject
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
      });

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
          {this.createTable(
            rows,
            columns,
            totalSummaryItems,
            expandedRowIds,
            columnWidths
          )}

          <ProjectsTrades
            title={this.props.t("MyLoans")}
            closeLink={"/myLoans"}
            t={this.props.t}
            location={this.props.location}
            openDialog={this.state.investmentsOpen}
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
          <Card className={classes.card}>
            <CardContent className={classes.details}>
              <Typography align="left" variant="h5">
                {this.props.t("MyLoans")}
              </Typography>
              <Typography align="left" variant="h6" color="textSecondary">
                {this.props.t("MyLoansMsg")}
              </Typography>
            </CardContent>
          </Card>
        </div>
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
    const investmentsLink = `/myLoans/${holding.projectAddress}/investments`;
    const projectAsks = topAsks[holding.projectAddress];
    const filteredAsks =
      projectAsks && Object.keys(projectAsks).length > 0
        ? projectAsks.filter(ask => ask.state === "initial")
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
    const est = holding.holdings * 1.06 * 1.06;
    let row = this.createRow(
      link,
      projectName,
      projectMaps,
      holding,
      projectsTradesAmount,
      projectInitialAsk,
      investmentsLink,
      est,
      project.loanDuration,
      project.projectInterest / 10
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
          width: "100%",
          justifyContent: "center"
        }}
      >
        <Card className={classes.card}>
          <CardContent className={classes.details}>
            <Typography align="left" variant="h5">
              {this.props.t("MyLoans")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("MyLoansMsg")}
            </Typography>
          </CardContent>
        </Card>
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
          <ProjectTypeProvider for={["loans", "est", "LoanMonth"]} />

          <ProjectNameProvider
            for={[
              "project",
              "income",
              "loans",
              "mortgage",
              "mortgageClearance"
            ]}
          />

          <SummaryState totalItems={totalSummaryItems} />

          <PrecentTypeProvider
            for={["yieldPercent", "yieldTotalPercent", "yearInterest"]}
          />

          <Table columnExtensions={columnWidths} />

          <TableHeaderRow contentComponent={ColumFormater} />
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
    investmentsLink,
    est,
    loanMonth,
    yearInterest
  ) {
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
      loans: projectsTradesAmount[holding.projectAddress]
        ? investmentsLink +
          "##" +
          numberUtils.formatNumber(
            projectsTradesAmount[holding.projectAddress],
            0
          )
        : "-",
      est: projectsTradesAmount[holding.projectAddress]
        ? numberUtils.formatNumber(est, 0)
        : "-",
      yieldPercent: projectsTradesAmount[holding.projectAddress]
        ? ((est - projectsTradesAmount[holding.projectAddress]) /
            projectsTradesAmount[holding.projectAddress]) *
          100
        : "-",
      LoanMonth: loanMonth,
      yearInterest: yearInterest
    };
  }

  columnsDefinitions() {
    return [
      { name: "project", title: " " },
      // { name: 'generalStatus', title: ' ' },
      // { name: 'mortgage', title: 'Mortgage' },
      { name: "loans", title: this.props.t("Loans") },
      { name: "LoanMonth", title: this.props.t("LoanMonth") },
      { name: "yearInterest", title: this.props.t("yearInterest") },
      { name: "est", title: this.props.t("Est") },
      { name: "yieldPercent", title: this.props.t("EstP") }
    ];
  }

  componentDidUpdate() {
    const { user, init } = this.props;
    if (user && !init) {
      this.props.initUserProjectStats(user.uid);
    }
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
  projects: getPopulatedProjects(state, props),
  projectsMarketPrice: getProjectsMarketPrice(state, props),
  projectsTradesAmount: getUserProjectsTrades(state, props),
  nextPayments: getMortgagesNextPayment(state, props),
  userProjectPosition: state.trades.userProjectPosition,
  mortgageRequests: state.mortgage.mortgageRequests,
  mortgageClearance: getMortgageClearances(state, props),
  init: state.trades.init,
  lang: state.userProfileReducer.lang,
  topAsks: state.trades.topAsks
});
const mapDispatchToProps = {
  listenForProjects,
  initUserProjectStats,
  initProjectStats
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MyLoans)
);
