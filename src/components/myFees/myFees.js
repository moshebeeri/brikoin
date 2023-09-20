import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { getUserFees } from "../../redux/selectors/feeSelector";
import {
  listenForProjects,
  initProjectStats,
  initUserProjectStats
} from "../../redux/actions/trade";
import { NavLink } from "react-router-dom";
import FeesSummary from "./feesSummary";
import numberUtils from "../../utils/numberUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
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
const DateFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14
    }}
  >
    {new Date(value).toDateString()}
  </div>
);

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

const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);
const NumberProvider = props => (
  <DataTypeProvider formatterComponent={numberFormater} {...props} />
);
const ProjectNameProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNameFormater} {...props} />
);

const DateProvider = props => (
  <DataTypeProvider formatterComponent={DateFormater} {...props} />
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
      minWidth: 500,
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
class Fees extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "project", width: 220 },
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "fee", width: 120 },
        { columnName: "amount", width: 100 },
        // { columnName: 'mortgage', width: 70 },
        { columnName: "price", width: 100 },
        { columnName: "date", width: 100 },
        { columnName: "user", width: 400 }
      ],
      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  render() {
    const { columnWidths } = this.state;
    const { init, projects, classes, userFees } = this.props;
    const columns = this.columnsDefinition();

    if (!init) {
      return (
        <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
          <LoadingCircular open />
        </div>
      );
    }
    if (projects && projects.length > 0) {
      const projectMaps = projects.reduce(function(map, obj) {
        map[obj.address] = obj;
        return map;
      }, {});
      const rows = this.createRows(projectMaps, userFees);

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
          <FeesSummary t={this.props.t} />
          {this.createTable(rows, columns, columnWidths)}
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
                {this.props.t("MyFees")}
              </Typography>
              <Typography align="left" variant="h6" color="textSecondary">
                {this.props.t("MyFeesMsg")}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
              {this.props.t("MyFees")}
            </Typography>
            <Typography align="left" variant="h6" color="textSecondary">
              {this.props.t("MyFeesMsg")}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  createRows(projectMaps, userFees) {
    const { lang } = this.props;

    return userFees.map(fee => {
      const project = projectMaps[fee.projectAddress];
      const projectName =
        lang !== "En" &&
        project.lang &&
        project.lang[lang] &&
        project.lang[lang].name
          ? project.lang[lang].name
          : project.name;
      fee.project = `/projectsView/${fee.projectAddress}` + "##" + projectName;
      return fee;
    });
  }
  columnsDefinition() {
    return [
      { name: "project", title: " " },
      { name: "fee", title: this.props.t("fee") },
      { name: "amount", title: this.props.t("amount") },
      { name: "price", title: this.props.t("price") },
      { name: "date", title: this.props.t("date") },
      { name: "user", title: this.props.t("userId") }
    ];
  }

  createTable(rows, columns, columnWidths) {
    return (
      <Paper style={{ marginTop: 40, width: "80%" }}>
        <Grid rows={rows} columns={columns}>
          <ProjectTypeProvider for={["user"]} />
          <NumberProvider for={["fee", "amount", "price"]} />
          <ProjectNameProvider for={["project"]} />s
          <DateProvider for={["date"]} />
          <Table />
          <TableColumnResizing columnWidths={columnWidths} />
          <TableHeaderRow contentComponent={ColumFormater} />
        </Grid>
      </Paper>
    );
  }

  componentDidUpdate() {
    const { user, init } = this.props;
    if (user && !init) {
      this.props.initUserProjectStats(user.uid);
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
  activeAccount: state.userAccounts.activeAccount,
  projects: getPopulatedProjects(state, props),
  userFees: getUserFees(state, props),
  lang: state.userProfileReducer.lang,
  init: state.trades.init
});
const mapDispatchToProps = {
  listenForProjects,
  initUserProjectStats,
  initProjectStats
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Fees)
);
