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
import { getMortgageProjectClearances } from "../../redux/selectors/mortgaegsSelector";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { NavLink } from "react-router-dom";
import numberUtils from "../../utils/numberUtils";
const NumberFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14
    }}
  >
    {numberUtils.formatNumber(value, 2)}
  </div>
);
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

const ProjectTitleFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);

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
const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);
const NumberProvider = props => (
  <DataTypeProvider formatterComponent={NumberFormater} {...props} />
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
class MortgagesDetails extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "amount", width: 140 },
        { columnName: "normalizedClearance", width: 120 },
        { columnName: "cleared", width: 110 },
        { columnName: "price", width: 110 },
        { columnName: "time", width: 110 },
        { columnName: "initialLoan", width: 110 },
        { columnName: "currentLoan", width: 110 }
      ],
      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  handleClose() {}
  render() {
    const { columnWidths } = this.state;
    const { openDialog, projectClearances } = this.props;
    const columns = this.columnsDefinitons();
    const projectAddress = this.props.location.pathname.substring(10)
      ? this.props.location.pathname
          .substring(10)
          .substring(0, this.props.location.pathname.substring(10).indexOf("/"))
      : "";

    if (
      projectClearances &&
      projectClearances[projectAddress] &&
      projectClearances[projectAddress].length > 0
    ) {
      const rows = projectClearances[projectAddress];
      if (rows.length === 0) {
        return <div />;
      }
      return (
        <Dialog
          fullWidth
          maxWidth={"md"}
          open={openDialog}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          {this.closeButton()}
          <DialogTitle id="form-dialog-title">
            {this.props.t("MortgageClearances")}
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

  createTable(rows, columns, columnWidths) {
    return (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minWidth: 900
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
        />
        <Grid rows={rows} columns={columns}>
          <ProjectTypeProvider for={["cleared", "time"]} />

          <DateProvider for={["time"]} />
          <NumberProvider
            for={[
              "amount",
              "normalizedClearance",
              "price",
              "initialLoan",
              "currentLoan"
            ]}
          />

          <Table columnExtensions={columnWidths} />

          <TableHeaderRow contentComponent={ColumFormater} />
        </Grid>
      </div>
    );
  }

  columnsDefinitons() {
    return [
      { name: "amount", title: this.props.t("originalAmount") },
      { name: "price", title: this.props.t("price") },
      { name: "normalizedClearance", title: this.props.t("clearance") },
      { name: "cleared", title: this.props.t("cleared") },
      { name: "time", title: this.props.t("date") },
      { name: "initialLoan", title: this.props.t("initialMortgage") },
      { name: "currentLoan", title: this.props.t("currentMortgage") }
    ];
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  holdings: state.userAccounts.holdings,
  update: state.userAccounts.update,
  activeAccount: state.userAccounts.activeAccount,
  projects: getPopulatedProjects(state, props),
  projectClearances: getMortgageProjectClearances(state, props),
  userTrades: state.trades.usersProjectTrades,
  topAsks: state.trades.topAsks
});

export default withStyles(styles)(connect(mapStateToProps)(MortgagesDetails));
