import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { SubmitOperation } from "../../UI/index";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import numberUtils from "../../utils/numberUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import dateUtils from "../../utils/dateUtils";
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
const ProjectRateProvider = props => (
  <DataTypeProvider formatterComponent={rateFormater} {...props} />
);
const ProjectNumberProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNumberFormater} {...props} />
);
const ActionnFormater = ({ value }) =>
  value.action.activeAccount.type === "EXTERNAL" ? (
    <div style={{ borderColor: "black", border: 1 }}>
      {value.rows.side === "ask" ? (
        <SubmitOperation
          icon="delete"
          onSuccess={value.action.cancelOrderExternal.bind(this)}
          request={{
            projectId: value.action.project.address,
            auctionId: value.auctionId
          }}
          contract={"CornerStone"}
          event={"AskCancel"}
          method={"askCancel"}
        />
      ) : (
        <SubmitOperation
          icon="delete"
          onSuccess={value.action.cancelOrderExternal.bind(this)}
          request={{
            projectId: value.action.project.address,
            auctionId: value.auctionId
          }}
          contract={"CornerStone"}
          event={"BidCancel"}
          method={"bidCancel"}
        />
      )}
    </div>
  ) : (
    <IconButton
      onClick={value.cancelOrder.bind(this, value.auctionId, value.side)}
      aria-label="Delete"
    >
      <DeleteIcon />
    </IconButton>
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

const ProjectTypeAction = props => (
  <DataTypeProvider formatterComponent={ActionnFormater} {...props} />
);

class ActiveAuctionOrders extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showCycle: false,
      deleteAuctionId: "",
      columnWidths: [
        { columnName: "size", width: 80 },
        { columnName: "price", width: 75 },
        { columnName: "closedDate", width: 75 },
        { columnName: "action", width: 80 }
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
            {this.props.t("ActiveBidsOrders")}
          </div>
          {this.state.showCycle && (
            <div style={{ marginTop: 10 }}>
              <LoadingCircular open size={30} />{" "}
            </div>
          )}
          <Grid rows={rows} columns={columns}>
            <DateProvider for={["closedDate"]} />
            <ProjectNumberProvider for={["size"]} />
            <ProjectRateProvider for={["price"]} />
            <ProjectTypeAction for={["action"]} />

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
      user
    } = this.props;
    const auctionsBids = auctionsBidOrders[projectId];
    const auctionsAsks = auctionsAskOrders[projectId];
    const rows = auctionsBids
      ? auctionsBids.filter(row => row.user === user.uid)
      : [];
    return rows
      ? rows.map(row => {
          const auctionAsk = auctionsAsks.filter(
            ask => row.auctionId === ask.auctionId
          )[0];
          return {
            size: row.size,
            price: row.price,
            closedDate: auctionAsk.dueDate,
            action: {
              side: "bid",
              cancelOrder: this.cancelOrder.bind(this),
              action: this.props,
              auctionId: row.auctionId
            }
          };
        })
      : [];
  }

  columnDefinitions() {
    return [
      { name: "size", title: this.props.t("Volume") },
      { name: "price", title: this.props.t("Price") },
      { name: "closedDate", title: this.props.t("closedDate") },
      { name: "action", title: " " }
    ];
  }
  componentWillReceiveProps() {
    const { projectId, auctionsBidOrders, user } = this.props;
    const auctionsBids = auctionsBidOrders[projectId];
    const rows = auctionsBids
      ? auctionsBids.filter(
          row =>
            row.user === user.uid &&
            row.auctionId === this.state.deleteAuctionId
        )
      : [];
    if (rows.length === 0) {
      this.setState({
        showCycle: false,
        deleteAuctionId: ""
      });
    }
  }
}

const mapStateToProps = (state, props) => ({
  auctionsBidOrders: state.trades.auctionsBidOrders,
  auctionsAskOrders: state.trades.auctionsAskOrders,
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  changed: state.trades.change
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveAuctionOrders);
