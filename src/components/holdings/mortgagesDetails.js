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
import { getMortgagesNextPayment } from "../../redux/selectors/mortgaegsSelector";
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
class MortgagesDetails extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "mortgageType", width: 100 },
        { columnName: "interest", width: 80 },
        { columnName: "loan", width: 80 },
        { columnName: "totalPayed", width: 95 },
        { columnName: "totalRemain", width: 95 },
        { columnName: "nextPayment", width: 95 }
      ],

      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  handleClose() {}
  render() {
    const { columnWidths } = this.state;
    const { nextPayments, mortgageRequests, openDialog } = this.props;
    const columns = this.columnsDefinitons();
    const projectAddress = this.props.location.pathname.substring(10)
      ? this.props.location.pathname
          .substring(10)
          .substring(0, this.props.location.pathname.substring(10).indexOf("/"))
      : "";

    if (
      mortgageRequests &&
      mortgageRequests[projectAddress] &&
      mortgageRequests[projectAddress].length > 0
    ) {
      const mortgages =
        mortgageRequests && mortgageRequests[projectAddress]
          ? mortgageRequests[projectAddress].filter(request => request.trade)
          : [];

      const rows = this.createRows(mortgages, nextPayments);
      if (rows.length === 0) {
        return <div />;
      }
      return (
        <Dialog
          open={openDialog}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
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
          <DialogTitle id="form-dialog-title">
            {this.props.t("ProjectMortgages")}
          </DialogTitle>
          <DialogContent>
            {this.createTable(rows, columns, columnWidths)}
          </DialogContent>
        </Dialog>
      );
    }
    return <div />;
  }

  createRows(mortgages, nextPayments) {
    return mortgages
      .map(request => {
        let interest = request.mortgageType.includes("FIXED")
          ? request.interestRateFixed
          : request.armInterestRate;
        let nextPayment = nextPayments[request.key];
        return {
          mortgageType: request.mortgageType,
          interest: interest,
          loan: request.amount,
          totalPayed: nextPayment
            ? parseFloat(nextPayment.paymentTotalToDate) -
              parseFloat(nextPayment.scheduledMonthlyPayment)
            : 0,
          totalRemain: nextPayment
            ? parseFloat(nextPayment.remainingLoanBalnce) +
              parseFloat(nextPayment.scheduledMonthlyPayment)
            : 0,
          nextPayment: nextPayment
            ? parseFloat(nextPayment.scheduledMonthlyPayment)
            : 0
        };
      })
      .filter(row => row);
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
          <ProjectTypeProvider
            for={["volume", "price", "date", "type", "payment"]}
          />

          <Table columnExtensions={columnWidths} />

          <TableHeaderRow />
        </Grid>
      </div>
    );
  }

  columnsDefinitons() {
    return [
      { name: "mortgageType", title: this.props.t("MortgageType") },
      { name: "interest", title: this.props.t("Interest") },
      { name: "loan", title: this.props.t("Loan") },
      { name: "totalPayed", title: this.props.t("TotalPayed") },
      { name: "totalRemain", title: this.props.t("TotalRemain") },
      { name: "nextPayment", title: this.props.t("NextPayment") }
    ];
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  holdings: state.userAccounts.holdings,
  update: state.userAccounts.update,
  activeAccount: state.userAccounts.activeAccount,
  projects: getPopulatedProjects(state, props),
  nextPayments: getMortgagesNextPayment(state, props),
  mortgageRequests: state.mortgage.mortgageRequests,
  userTrades: state.trades.usersProjectTrades,
  topAsks: state.trades.topAsks
});

export default withStyles(styles)(connect(mapStateToProps)(MortgagesDetails));
