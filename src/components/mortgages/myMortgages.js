import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { DataTypeProvider, RowDetailState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableColumnResizing,
  TableHeaderRow,
  TableRowDetail
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { getMyMortgagesPayment } from "../../redux/selectors/mortgaegsSelector";
import {
  initProjectStats,
  initUserProjectStats,
  listenForProjects
} from "../../redux/actions/trade";
import { getMyMortgages } from "../../redux/actions/mortgage";
import MortgageePendingRow from "./mortgageePendingRow";
import MyMortgagesDetails from "./MyMortgagesDetails";
import KycDetails from "./KycDetails";
import MyMortgagesSummary from "./mortgageeSummary";
import { NavLink } from "react-router-dom";
import numberUtils from "../../utils/numberUtils";
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
const ProjectTitleFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);
const numberFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {numberUtils.formatNumber(value, 2)}
  </Typography>
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
          <div style={{ fontSize: 14 }}>{value.toFixed(2)}%</div>
        </div>
      </div>
    );
  }
};
const RowDetail = ({ row }) => (
  <div>
    {row.mortgagesRequests ? (
      <MortgageePendingRow
        t={row.t}
        myMortgagePayment={row.myMortgagePayment}
        openKycPopup={row.openKycPopup}
        openDetailsPopup={row.openDetailsPopup}
        rows={row.mortgagesRequests}
      />
    ) : (
      ""
    )}
  </div>
);
const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);
const NumberProvider = props => (
  <DataTypeProvider formatterComponent={numberFormater} {...props} />
);
const ProjectNameProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNameFormater} {...props} />
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
    },
    progress: {
      margin: theme.spacing.unit * 2
    }
  };
};

class Mortgages extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columnWidths: [
        { columnName: "project", width: 150 },
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "maxFunding", width: 120 },
        { columnName: "maxYears", width: 100 },
        // { columnName: 'mortgage', width: 70 },
        { columnName: "downPayment", width: 100 },
        { columnName: "intersRateArm", width: 100 },
        { columnName: "intersRateFixed", width: 100 },
        { columnName: "mortgagesTypes", width: 300 }
      ],
      expandedRowIds: []
    };
    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  openDetailsPopup(project, mortgageId, mortgageRequestKey) {
    this.setState({
      dialogProject: project,
      mortgageId: mortgageId,
      mortgageRequestKey: mortgageRequestKey,
      openDialog: true
    });
  }

  openKycPopup(user) {
    this.setState({
      kycUser: user,
      openKycDialog: true
    });
  }

  closeKycDialog() {
    this.setState({
      kycUser: "",
      openKycDialog: false
    });
  }

  closeDialog() {
    this.setState({
      dialogProject: "",
      mortgageId: "",
      mortgageRequestKey: "",
      openDialog: false
    });
  }

  render() {
    const { columnWidths } = this.state;
    const {
      init,
      projects,
      classes,
      mortgages,
      lang,
      expandedRowIds,
      myMortgagePayment
    } = this.props;
    const columns = this.columnsDefinition();
    if (!init) {
      return (
        <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
          <LoadingCircular open className={classes.progress} />
        </div>
      );
    }
    if (projects && projects.length > 0 && mortgages && mortgages.length > 0) {
      const projectMaps = projects.reduce(function(map, obj) {
        map[obj.address] = obj;
        return map;
      }, {});
      const rows = mortgages
        .map(mortgage => {
          const link = `/projectsView/${mortgage.project}`;
          const arm10 = mortgage.ARM10 ? this.props.t("ARM10") + ", " : "";
          const arm3 = mortgage.ARM3 ? this.props.t("ARM3") + ", " : "";
          const arm5 = mortgage.ARM5 ? this.props.t("ARM5") + ", " : "";
          const arm7 = mortgage.ARM7 ? this.props.t("ARM7") + ", " : "";
          const fixed10 = mortgage.FIXED10
            ? this.props.t("FIXED10") + ", "
            : "";
          const fixed15 = mortgage.FIXED15 ? this.props.t("FIXED15") : "";
          const mortgageTypes = arm10 + arm3 + arm5 + arm7 + fixed10 + fixed15;
          let mortgagesRequests = [];
          if (
            mortgage.mortgagesRequests &&
            Object.keys(mortgage.mortgagesRequests).length > 0
          ) {
            mortgagesRequests = this.getMortgagesReqeust(mortgage);
          }
          if (!projectMaps[mortgage.project]) {
            return "";
          }
          const projectName =
            lang === "En"
              ? projectMaps[mortgage.project].name
              : projectMaps[mortgage.project].lang[lang].name;
          let row = this.getRowObject(
            link,
            projectName,
            mortgage,
            mortgageTypes,
            mortgagesRequests,
            myMortgagePayment
          );
          return row;
        })
        .filter(row => row);
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
          {this.tableHeaderDecription(classes)}
          <MyMortgagesSummary t={this.props.t} />
          {this.createTable(rows, columns, expandedRowIds, columnWidths)}
          <MyMortgagesDetails
            t={this.props.t}
            dialogProject={this.state.project}
            mortgageId={this.state.mortgageId}
            mortgageRequestKey={this.state.mortgageRequestKey}
            openDialog={this.state.openDialog}
            closeDialog={this.closeDialog.bind(this)}
          />
          <KycDetails
            t={this.props.t}
            row={this.state.kycUser}
            openDialog={this.state.openKycDialog}
            closeDialog={this.closeKycDialog.bind(this)}
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
                {this.props.t("Holdings")}
              </Typography>
              <Typography align="left" variant="h6" color="textSecondary">
                {this.props.t("HoldingsMsg")}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  getMortgagesReqeust(mortgage) {
    return Object.keys(mortgage.mortgagesRequests).map(key => {
      let mortgageRequest = mortgage.mortgagesRequests[key];
      mortgageRequest.key = key;
      return mortgageRequest;
    });
  }

  tableHeaderDecription(classes) {
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
              {this.props.t("Mortgages")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("MortgagesMsg")}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  getRowObject(
    link,
    projectName,
    mortgage,
    mortgageTypes,
    mortgagesRequests,
    myMortgagePayment
  ) {
    return {
      project: link + "##" + projectName,
      maxFunding: mortgage.maxMortgage,
      maxYears: mortgage.maxYears,
      downPayment: parseFloat(mortgage.downPayment),
      intersRateArm: parseFloat(mortgage.interestRateArm),
      intersRateFixed: parseFloat(mortgage.interestRateFixed),
      mortgagesTypes: mortgageTypes,
      mortgagesRequests: mortgagesRequests,
      openDetailsPopup: this.openDetailsPopup.bind(this),
      openKycPopup: this.openKycPopup.bind(this),
      myMortgagePayment: myMortgagePayment,
      t: this.props.t
    };
  }

  columnsDefinition() {
    return [
      { name: "project", title: " " },
      // { name: 'generalStatus', title: ' ' },
      { name: "maxFunding", title: this.props.t("maxFunding") },
      { name: "maxYears", title: this.props.t("maxYears") },
      // { name: 'mortgage', title: 'Mortgage' },
      { name: "downPayment", title: this.props.t("downPayment") },
      { name: "intersRateArm", title: this.props.t("intersRateArm") },
      { name: "intersRateFixed", title: this.props.t("intersRateFixed") },
      { name: "mortgagesTypes", title: this.props.t("mortgagesTypes") }
    ];
  }

  createTable(rows, columns, expandedRowIds, columnWidths) {
    return (
      <Paper style={{ marginTop: 40, width: "80%" }}>
        <Grid rows={rows} columns={columns}>
          <ProjectTypeProvider
            for={["maxFunding", "maxYears", "mortgageTypes"]}
          />
          <NumberProvider for={["maxFunding"]} />
          <ProjectNameProvider for={["project"]} />

          <PrecentTypeProvider
            for={["intersRateArm", "intersRateFixed", "downPayment"]}
          />
          <RowDetailState
            expandedRowIds={expandedRowIds}
            onExpandedRowIdsChange={this.changeExpandedDetails}
          />
          <Table />
          <TableColumnResizing columnWidths={columnWidths} />

          <TableHeaderRow />
          <TableRowDetail contentComponent={RowDetail} />
        </Grid>
      </Paper>
    );
  }

  componentDidUpdate() {
    const { user, init } = this.props;
    if (user && !init) {
      this.props.initUserProjectStats(user.uid);
      this.props.getMyMortgages(user);
    }
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.initUserProjectStats(user.uid);
      this.props.getMyMortgages(user);
    }
    this.props.initProjectStats();
    window.scrollTo(0, 0);
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  init: state.mortgage.init,
  activeAccount: state.userAccounts.activeAccount,
  mortgages: state.mortgage.myMortgages,
  projects: getPopulatedProjects(state, props),
  myMortgagePayment: getMyMortgagesPayment(state, props),
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {
  listenForProjects,
  initUserProjectStats,
  initProjectStats,
  getMyMortgages
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Mortgages)
);
