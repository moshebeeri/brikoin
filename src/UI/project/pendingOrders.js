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
import LoadingCircular from "../../UI/loading/LoadingCircular";
const ProjectTitleFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyCoßntent: "center",
      fontSize: 14
    }}
  >
    {value}
  </div>
);
const ProjectStatusFormater = ({ value }) => <LoadingCircular open />;
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

const ProjectNumberProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNumberFormater} {...props} />
);
const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);

const ProjectRateProvider = props => (
  <DataTypeProvider formatterComponent={rateFormater} {...props} />
);
const ProjectStatusProvider = props => (
  <DataTypeProvider formatterComponent={ProjectStatusFormater} {...props} />
);
class pendingOrders extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "volume", width: 75 },
        { columnName: "price", width: 75 },
        { columnName: "type", width: 75 },
        { columnName: "status", width: 85 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;
    const columns = [
      { name: "volume", title: this.props.t("Volume") },
      { name: "price", title: this.props.t("Price") },
      { name: "type", title: this.props.t("Type") },
      { name: "status", title: " " }
    ];
    const { rows } = this.props;
    const pendingRows = rows
      ? rows.map(row => {
          return {
            volume: row.size,
            price: row.price,
            type: row.side,
            status: this.props.t("processing")
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
            {this.props.t("OrderPending")}
          </div>
          <Grid rows={pendingRows} columns={columns}>
            <ProjectTypeProvider for={["type"]} />
            <ProjectNumberProvider for={["volume"]} />
            <ProjectStatusProvider for={["status"]} />
            <ProjectRateProvider for={["price"]} />

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

export default connect(mapStateToProps, mapDispatchToProps)(pendingOrders);
