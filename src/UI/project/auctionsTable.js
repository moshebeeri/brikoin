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
    {numberUtils.formatNumber(value, 0)}
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

class AuctionsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "auctionVolume", width: 80 },
        { columnName: "startingPrice", width: 75 },
        { columnName: "closedDate", width: 75 },
        { columnName: "currentBidsVolume", width: 80 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;
    const columns = this.columnsDefinitions();
    const { auctionsAskOrders, auctionsBidOrders, projectId } = this.props;
    const rows = auctionsAskOrders[projectId];
    const auctionsBids = auctionsBidOrders[projectId];
    const tableRows = this.createTableRows(rows, auctionsBids);

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
            {this.props.t("auctions")}
          </div>
          <Grid rows={tableRows} columns={columns}>
            <ProjectTypeProvider
              for={["auctionVolume", "startingPrice", "currentBidsVolume"]}
            />

            <DateProvider for={["closedDate"]} />

            <Table columnExtensions={columnWidths} />

            <TableHeaderRow contentComponent={ColumFormater} />
          </Grid>
        </Paper>
      </div>
    );
  }

  createTableRows(rows, auctionsBids) {
    return rows
      ? rows.map(row => {
          const askBids = auctionsBids
            ? auctionsBids.filter(bid => bid.auctionId === row.auctionId)
            : [];
          let bidsVolume = 0;
          if (askBids.length > 0) {
            bidsVolume = askBids
              .map(bid => parseInt(bid.size))
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue
              );
          }
          return {
            auctionVolume: row.amount,
            startingPrice: row.price,
            closedDate: row.dueDate,
            currentBidsVolume: bidsVolume
          };
        })
      : [];
  }

  columnsDefinitions() {
    return [
      { name: "auctionVolume", title: this.props.t("auctionVolume") },
      { name: "startingPrice", title: this.props.t("auctionStartingPrice") },
      { name: "closedDate", title: this.props.t("closedDate") },
      { name: "currentBidsVolume", title: this.props.t("currentBidsVolume") }
    ];
  }
}

const mapStateToProps = (state, props) => ({
  auctionsAskOrders: state.trades.auctionsAskOrders,
  auctionsBidOrders: state.trades.auctionsBidOrders,
  changed: state.trades.change
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AuctionsTable);
