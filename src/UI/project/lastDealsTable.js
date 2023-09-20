import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import numberUtils from "../../utils/numberUtils";
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
const ProjectPercentFormater = ({ value }) => {
  if (parseInt(value) === 0) {
    return (
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
  }
  if (parseInt(value) > 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2b9132",
          fontSize: 14
        }}
      >
        {value}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e83749",
        fontSize: 14
      }}
    >
      {value}
    </div>
  );
};
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
const ProjectRateProvider = props => (
  <DataTypeProvider formatterComponent={rateFormater} {...props} />
);
const ProjectPrecenteProvider = props => (
  <DataTypeProvider formatterComponent={ProjectPercentFormater} {...props} />
);

class LastDealsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "rate", width: 75 },
        { columnName: "volume", width: 80 },
        { columnName: "cost", width: 80 },
        { columnName: "change", width: 75 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;
    const columns = [
      { name: "rate", title: this.props.t("Rate") },
      { name: "volume", title: this.props.t("Volume") },
      { name: "cost", title: this.props.t("Cost") },
      { name: "change", title: this.props.t("change") }
    ];
    const { rows } = this.props;
    const pendingRows = rows
      ? rows.map(row => {
          return {
            rate: row.price,
            volume: row.size,
            cost: row.volumeDollar,
            change: row.changeView
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
            {this.props.t("LastDeals")}
          </div>
          <Grid rows={pendingRows} columns={columns}>
            <ProjectTypeProvider for={["volume", "cost"]} />
            <ProjectPrecenteProvider for={["change"]} />
            <ProjectRateProvider for={["rate"]} />

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

export default connect(mapStateToProps, mapDispatchToProps)(LastDealsTable);
