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
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import Close from "@material-ui/icons/Close";
import {
  getProjectsMarketPrice,
  getUserProjectsTrades
} from "../../redux/selectors/tradesSelector";
import { config } from "../../conf/config";
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
class Incomes extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        // { name: 'generalStatus', title: ' ' },
        { name: "date", title: "date" },
        { name: "income", title: "Income" }
        // { name: 'mortgage', title: 'Mortgage' },
      ],
      open: true,
      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  handleClose() {
    this.props.closeDialog();
  }

  render() {
    const { columns } = this.state;
    const { projects, holdings, location, openDialog } = this.props;
    const holdingsParams = location.pathname.split("/");

    if (projects && projects.length > 0 && holdings && holdings.length > 0) {
      const rows = this.createRows(projects, holdings, holdingsParams);
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
            {this.props.t("projectYields")}
          </DialogTitle>
          <DialogContent>{this.createTable(rows, columns)}</DialogContent>
        </Dialog>
      );
    }
    return <div />;
  }

  createRows(holdings, projects, holdingsParams) {
    const projectMaps = projects.reduce(function(map, obj) {
      map[obj.address] = obj;
      return map;
    }, {});

    let projectHoldings = holdings.filter(
      holding => holding.projectAddress === holdingsParams[2]
    );

    let rows = projectHoldings.map(holding => {
      let income = 0;
      if (holding.yields) {
        return Object.keys(holding.yields).map(key => {
          income = holding.yields[key].amount;
          let row = {
            project: projectMaps[holding.projectAddress].name,
            date: new Date(holding.yields[key].time).toDateString(),
            income:
              income > 0
                ? (income / config.stoneRatio)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                : "-"
          };
          return row;
        });
      }
      return "";
    });

    if (rows.length === 0) {
      return [];
    }

    return rows.filter(row => row).flat();
  }

  createTable(filterRows, columns) {
    return (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Grid rows={filterRows} columns={columns}>
          <ProjectTypeProvider for={["income", "date"]} />

          <Table />
          <TableHeaderRow />
        </Grid>
      </div>
    );
  }

  closeButton() {
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
          to={"/holdings"}
        >
          <Close />
        </NavLink>
      </div>
    );
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
  topAsks: state.trades.topAsks
});

export default withStyles(styles)(connect(mapStateToProps)(Incomes));
