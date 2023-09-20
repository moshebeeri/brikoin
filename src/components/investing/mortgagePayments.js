import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { resetMortgageCalculation } from "../../redux/actions/mortgage";
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
class Payments extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "month", width: 80 },
        { columnName: "interest", width: 100 },
        { columnName: "principal", width: 100 },
        { columnName: "monthlyPayment", width: 100 }
      ],

      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  handleClose() {
    this.props.resetMortgageCalculation();
  }
  render() {
    const { columnWidths } = this.state;
    const { payments } = this.props;
    const columns = [
      // { name: 'generalStatus', title: ' ' },
      { name: "month", title: this.props.t("month") },
      { name: "interest", title: this.props.t("interest") },
      { name: "principal", title: this.props.t("principal") },
      { name: "monthlyPayment", title: this.props.t("monthlyPayment") }
      // { name: 'mortgage', title: 'Mortgage' }
    ];
    if (
      Object.keys(payments).length > 0 &&
      payments.paymentSchedule &&
      payments.paymentSchedule.length > 0
    ) {
      const rows = payments.paymentSchedule
        .map((pay, index) => {
          return {
            month: index + 1,
            interest: pay.interest,
            principal: pay.principal,
            monthlyPayment: pay.scheduledMonthlyPayment
          };
        })
        .filter(row => row);
      if (rows.length === 0) {
        return <div />;
      }
      return (
        <Dialog
          open
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
          />
          <DialogTitle id="form-dialog-title">
            {this.props.t("ScheduledPayments")}
          </DialogTitle>
          <DialogContent>
            <div
              style={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ fontWeight: "bold", fontSize: 14 }}>
                  {this.props.t("loanAmount")} : {payments.loanAmount}{" "}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                    marginRight: 5,
                    marginLeft: 5
                  }}
                >
                  {this.props.t("principalCost")} : {payments.totalLoanCost}{" "}
                </div>
                <div style={{ fontWeight: "bold", fontSize: 14 }}>
                  {this.props.t("totalLoanReturned")} :{" "}
                  {parseFloat(payments.totalLoanCost) +
                    parseFloat(payments.loanAmount)}{" "}
                </div>
              </div>

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
                  for={["month", "interest", "principal", "monthlyPayment"]}
                />

                <Table />
                <TableColumnResizing columnWidths={columnWidths} />
                <TableHeaderRow />
              </Grid>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    return <div />;
  }
}

const mapStateToProps = (state, props) => ({
  payments: state.mortgage.payments
});

const mapDispatchToProps = {
  resetMortgageCalculation
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Payments)
);
