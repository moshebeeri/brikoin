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
        fontSize: 14
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
const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);

class bidsAskTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "volumeAsk", width: 80 },
        { columnName: "askPrice", width: 75 },
        { columnName: "bidPrice", width: 75 },
        { columnName: "volumeBid", width: 80 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;
    const columns = [
      { name: "volumeAsk", title: this.props.t("Volume") },
      { name: "askPrice", title: this.props.t("AskPrice") },
      { name: "bidPrice", title: this.props.t("BidPrice") },
      { name: "volumeBid", title: this.props.t("Volume") }
    ];
    const { rows } = this.props;
    const pendingRows = rows
      ? rows.map(row => {
          return {
            volumeAsk: row.sizeAsk,
            askPrice: row.priceAsk,
            bidPrice: row.priceBid,
            volumeBid: row.sizeBid
          };
        })
      : [];

    if (pendingRows.length === 0) {
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
            {this.props.t("Ask")} - {this.props.t("Bid")}
          </div>
          <Grid rows={pendingRows} columns={columns}>
            <ProjectTypeProvider for={["volumeAsk", "volumeBid"]} />
            <ProjectRateProvider for={["askPrice", "bidPrice"]} />

            <Table columnExtensions={columnWidths} />

            <TableHeaderRow contentComponent={ColumFormater} />
          </Grid>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(bidsAskTable);
