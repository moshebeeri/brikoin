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
import LoadingCircular from "../../UI/loading/LoadingCircular";
import dateUtils from "../../utils/dateUtils";
import auctionUtils from "../../utils/auctionUtils";
const ProjectNumberFormater = ({ value }) => (
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
const labelFormater = ({ value }) => (
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
const LabelProvider = props => (
  <DataTypeProvider formatterComponent={labelFormater} {...props} />
);
const ProjectRateProvider = props => (
  <DataTypeProvider formatterComponent={rateFormater} {...props} />
);
const ProjectNumberProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNumberFormater} {...props} />
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

class AuctionBidOrders extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showCycle: false,
      deleteAuctionId: "",
      columnWidths: [
        { columnName: "size", width: 80 },
        { columnName: "price", width: 75 },
        { columnName: "closedDate", width: 75 },
        { columnName: "status", width: 80 }
      ]
    };
  }

  cancelOrder(auctionId, side) {
    this.setState({
      showCycle: true,
      deleteAuctionId: auctionId
    });
    this.props.cancelOrder(auctionId, side);
  }

  render() {
    const { columnWidths } = this.state;

    const columns = this.columnDefinitions();
    const rows = this.createTableRows();
    if (!rows || rows.length === 0) {
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
            {this.props.t("AuctionsBids")}
          </div>
          {this.state.showCycle && (
            <div style={{ marginTop: 10 }}>
              <LoadingCircular open />{" "}
            </div>
          )}
          <Grid rows={rows} columns={columns}>
            <DateProvider for={["closedDate"]} />
            <ProjectNumberProvider for={["size"]} />
            <ProjectRateProvider for={["price"]} />
            <LabelProvider for={["status"]} />

            <Table columnExtensions={columnWidths} />

            <TableHeaderRow contentComponent={ColumFormater} />
          </Grid>
        </Paper>
      </div>
    );
  }

  createTableRows() {
    const {
      projectId,
      auctionsBidOrders,
      auctionsAskOrders,
      userProjectAuctions
    } = this.props;

    const rows = auctionUtils.sortBidsByType(
      auctionsBidOrders[projectId],
      userProjectAuctions[projectId]
    );
    const auctionsAsks = auctionsAskOrders[projectId];
    return rows
      ? rows.map(row => {
          const auctionAsk = auctionsAsks.filter(
            ask => row.auctionId === ask.auctionId
          )[0];
          const bidStatus = auctionUtils.getBidStatus(rows, row, auctionAsk);
          return {
            size: row.size,
            price: row.price,
            closedDate: auctionAsk.dueDate,
            status: this.props.t(bidStatus)
          };
        })
      : [];
  }

  columnDefinitions() {
    return [
      { name: "size", title: this.props.t("Volume") },
      { name: "price", title: this.props.t("Price") },
      { name: "closedDate", title: this.props.t("closedDate") },
      { name: "status", title: "status" }
    ];
  }
}

const mapStateToProps = (state, props) => ({
  auctionsBidOrders: state.trades.auctionsBidOrders,
  auctionsAskOrders: state.trades.auctionsAskOrders,
  userProjectAuctions: state.trades.userProjectAuctions,
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  changed: state.trades.change
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AuctionBidOrders);
