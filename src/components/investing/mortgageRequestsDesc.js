import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";

const ProjectTitleFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14
    }}
  >
    {value}
  </div>
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

class MortgagesRequestDescription extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "amount", width: 100 },
        { columnName: "downPayment", width: 120 },
        { columnName: "type", width: 100 },
        { columnName: "interest", width: 100 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;
    const columns = [
      { name: "amount", title: this.props.t("amount") },
      { name: "downPayment", title: this.props.t("downPayment") },
      { name: "type", title: this.props.t("type") },
      { name: "interest", title: this.props.t("interest") }
    ];
    const { rows } = this.props;

    const pendingRows = rows
      ? rows.map(row => {
          const interest = row.mortgageType.includes("FIXED")
            ? row.interestRateFixed
            : row.armInterestRate;
          return {
            trade: row.trade,
            amount: row.amount,
            downPayment: row.downPayment,
            type: row.mortgageType,
            interest: interest
          };
        })
      : [];

    if (pendingRows.length === 0) {
      return <div />;
    }

    const filteredPendingRows = pendingRows.filter(row => !row.trade);
    if (filteredPendingRows.length === 0) {
      return <div />;
    }
    return (
      <div
        style={{
          width: 500,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Paper style={{ marginTop: 40 }}>
          <Grid rows={filteredPendingRows} columns={columns}>
            <ProjectTypeProvider for={["amount", "downPayment"]} />

            <Table />
            <TableColumnResizing columnWidths={columnWidths} />

            <TableHeaderRow contentComponent={ColumFormater} />
          </Grid>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MortgagesRequestDescription);
