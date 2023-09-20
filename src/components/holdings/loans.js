import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { getProjectsMarketPrice } from "../../redux/selectors/tradesSelector";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { NavLink } from "react-router-dom";
const ProjectTitleFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);

const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
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
    }
  };
};
class Trades extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "date", width: 120 },
        { columnName: "volume", width: 140 }
      ],

      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  handleClose() {}
  render() {
    const { columnWidths } = this.state;
    const {
      projects,
      userTrades,
      user,
      openDialog,
      location,
      title
    } = this.props;
    const holdingsParams = location.pathname.split("/");
    const columns = this.columnDefinitions();
    if (
      projects &&
      projects.length > 0 &&
      userTrades &&
      Object.keys(userTrades).length > 0
    ) {
      const rows = this.createRows(userTrades, projects, user, holdingsParams);
      if (rows.length === 0) {
        return <div />;
      }
      return (
        <Dialog
          open={openDialog}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          {this.closeButton()}
          <DialogTitle id="form-dialog-title">
            {title || this.props.t("ProjectInvestments")}
          </DialogTitle>
          <DialogContent>
            {this.createTable(rows, columns, columnWidths)}
          </DialogContent>
        </Dialog>
      );
    }
    return <div />;
  }

  closeButton() {
    const { closeLink } = this.props;
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end"
        }}
      >
        <NavLink
          style={{
            textDecoration: "none",
            fontSize: 22,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10
          }}
          to={closeLink || "/holdings"}
        >
          <Close />
        </NavLink>
      </div>
    );
  }

  createRows(userTrades, projects, user, holdingsParams) {
    const projectMaps = projects.reduce(function(map, obj) {
      map[obj.address] = obj;
      return map;
    }, {});

    const trades = Object.keys(userTrades).map(projectAddress => {
      if (userTrades[projectAddress] && userTrades[projectAddress].length > 0) {
        return userTrades[projectAddress].map(row => {
          row.projectAddress = projectAddress;
          return row;
        });
      }
      return "";
    });

    if (trades.length === 0) {
      return [];
    }

    if (!Array.isArray(trades)) {
      return [];
    }

    const filterTrades = trades.filter(row => row).flat();

    if (filterTrades.length === 0) {
      return [];
    }

    const tradesProject = filterTrades.filter(
      trade => trade.projectAddress === holdingsParams[2]
    );
    const filteredTrades = tradesProject.filter(trade => trade.projectAddress);

    if (filteredTrades.length === 0) {
      return [];
    }
    let rows = filteredTrades.map(trade => {
      return this.createRow(projectMaps, trade, user);
    });
    if (rows.length === 0) {
      return [];
    }
    return rows.filter(row => row);
  }

  createTable(rows, columns, columnWidths) {
    return (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
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
            justifyContent: "center",
            minWidth: 700
          }}
        />
        <Grid rows={rows} columns={columns}>
          <ProjectTypeProvider for={["volume", "date"]} />

          <Table columnExtensions={columnWidths} />

          <TableHeaderRow />
        </Grid>
      </div>
    );
  }

  columnDefinitions() {
    return [
      // { name: 'generalStatus', title: ' ' },
      { name: "date", title: this.props.t("Date") },
      { name: "volume", title: this.props.t("Volume") }
      // { name: 'mortgage', title: 'Mortgage' }
    ];
  }

  createRow(projectMaps, trade, user) {
    return {
      project: projectMaps[trade.projectAddress].name,
      date: new Date(trade.timestamp).toDateString(),
      price: trade.price,
      type: trade.seller === user.uid ? "ask" : "bid",
      volume: trade.size.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"),
      payment: (trade.price * trade.size)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    };
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  holdings: state.userAccounts.holdings,
  update: state.userAccounts.update,
  activeAccount: state.userAccounts.activeAccount,
  projects: getPopulatedProjects(state, props),
  projectsMarketPrice: getProjectsMarketPrice(state, props),
  userTrades: state.trades.usersProjectTrades,
  topAsks: state.trades.topAsks
});

export default withStyles(styles)(connect(mapStateToProps)(Trades));
