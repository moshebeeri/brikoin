/* eslint-disable no-multi-spaces */
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import numberUtils from "../../utils/numberUtils";
import dateUtils from "../../utils/dateUtils";
const ProjectTitleFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14
    }}
  >
    {numberUtils.formatNumber(value, 0)}$
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
        fontSize: 12,
        width: 55
      }}
    >
      {col.column.title}
    </div>
  );
};

const rateFormater = ({ value }) => (
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
const ProjectRateProvider = props => (
  <DataTypeProvider formatterComponent={rateFormater} {...props} />
);
const dateFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14
    }}
  >
    {dateUtils.messageFormater(value)}
  </div>
);
const DateProvider = props => (
  <DataTypeProvider formatterComponent={dateFormater} {...props} />
);
const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);

class AuctionsHistoryTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "dealPrice", width: 105 },
        { columnName: "closingPrice", width: 100 },
        { columnName: "closedDate", width: 105 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;
    const columns = this.columnsDefinitions();
    const { userProjectHistoryAuctions, projectId } = this.props;
    const rows = userProjectHistoryAuctions[projectId];
    const tableRows = this.createTableRows(rows);

    if (tableRows.length === 0) {
      return <div />;
    }
    return (
      <div
        style={{
          marginBottom: 16,
          width: 320,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Paper
          style={{
            boxShadow: "none",
            borderWidth: 1,
            borderColor: "#e5e5e5",
            borderStyle: "solid"
          }}
        >
          <div
            style={{
              marginRight: 10,
              marginTop: 5,
              marginLeft: 10,
              display: "flex",
              alignItems: "flex-start"
            }}
          >
            {" "}
            {this.props.t("auctionsHistory")}
          </div>
          <Grid rows={tableRows} columns={columns}>
            <ProjectTypeProvider for={["dealPrice"]} />

            <DateProvider for={["closedDate"]} />

            <ProjectRateProvider for={["closingPrice"]} />

            <Table columnExtensions={columnWidths} />

            <TableHeaderRow contentComponent={ColumFormater} />
          </Grid>
        </Paper>
      </div>
    );
  }

  createTableRows(rows) {
    return rows
      ? rows.map(row => {
          return {
            dealPrice: parseInt(row.volume) * row.finalPrice,
            closingPrice: row.finalPrice,
            closedDate: row.dueDate
          };
        })
      : [];
  }

  columnsDefinitions() {
    return [
      { name: "dealPrice", title: this.props.t("dealPrice") },
      { name: "closingPrice", title: this.props.t("closingPrice") },
      { name: "closedDate", title: this.props.t("closedDate") }
    ];
  }
}

const mapStateToProps = (state, props) => ({
  userProjectHistoryAuctions: state.trades.userProjectHistoryAuctions,
  changed: state.trades.change
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuctionsHistoryTable);
