import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { RowDetailState, DataTypeProvider } from "@devexpress/dx-react-grid";
import { Grid, Table } from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

const ProjectTitleFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);

const StatusTitleFormater = ({ value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      color: "#2b9132",
      alignItems: "center",
      justifyContent: "flex-start"
    }}
  >
    <ErrorOutline />
    <div style={{ marginRight: 5, marginLeft: 5 }}>
      <div style={{ color: "#2b9132", fontSize: 12 }}>{value}</div>
    </div>
  </div>
);

const PrecentFormater = ({ value }) => {
  if (value === "-") {
    return value;
  }
  if (value === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div style={{ marginRight: 5, marginLeft: 5 }}>
          <div style={{ fontSize: 14 }}>{value}%</div>
        </div>
      </div>
    );
  }
  if (!value) {
    return "-";
  }
  if (value > 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div style={{ marginRight: 5, marginLeft: 5 }}>
          <div style={{ fontSize: 14, color: "#4AA24E" }}>
            {value.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <div style={{ marginRight: 5, marginLeft: 5 }}>
        <div style={{ fontSize: 14, color: "#DF3D2D" }}>
          {value.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);

const StatusTypeProvider = props => (
  <DataTypeProvider formatterComponent={StatusTitleFormater} {...props} />
);

const PrecentTypeProvider = props => (
  <DataTypeProvider formatterComponent={PrecentFormater} {...props} />
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
class HoldingsNew extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: "project", title: " " },
        // { name: 'generalStatus', title: ' ' },
        { name: "status", title: "Status" },
        { name: "income", title: "Income" },
        // { name: 'mortgage', title: 'Mortgage' },
        { name: "size", title: "Volume" },
        { name: "investment", title: "Investment($)" },
        { name: "est", title: "Est($)" },
        { name: "yieldPercent", title: "Est(%)" },
        { name: "yieldTotalPercent", title: "Total(%)" }
      ],
      columnWidths: [
        { columnName: "project", width: 173 },
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "status", width: 120 },
        { columnName: "income", width: 70 },
        // { columnName: 'mortgage', width: 70 },
        { columnName: "size", width: 70 },
        { columnName: "investment", width: 150 },
        { columnName: "est", width: 150 },
        { columnName: "yieldPercent", width: 60 },
        { columnName: "yieldTotalPercent", width: 60 }
      ],
      totalSummaryItems: [
        { columnName: "investment", type: "totalInvestment" },
        { columnName: "est", type: "totalInvestmentEst" },
        { columnName: "income", type: "incomeTotal" }
      ],
      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  render() {
    const { columns, expandedRowIds, columnWidths } = this.state;
    const { row } = this.props;
    if (row) {
      let rows = [];
      const newRow = this.createRow(row);
      rows.push(newRow);
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <Grid rows={rows} columns={columns}>
            <ProjectTypeProvider
              for={[
                "project",
                "income",
                "investment",
                "mortgage",
                "size",
                "est"
              ]}
            />
            <StatusTypeProvider for={["status"]} />

            <PrecentTypeProvider for={["yieldPercent", "yieldTotalPercent"]} />
            <RowDetailState
              expandedRowIds={expandedRowIds}
              onExpandedRowIdsChange={this.changeExpandedDetails}
            />
            <Table columnExtensions={columnWidths} />
          </Grid>
        </div>
      );
    }
    return <div />;
  }

  createRow(row) {
    return {
      status: (row.status + " " + row.side).toUpperCase(),
      size: row.size
        ? parseInt(row.size)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "",
      investment:
        row.side === "bid" && row.size
          ? parseInt(row.size * row.price)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")
          : "",
      est:
        row.side === "ask" && row.size * row.price
          ? (row.size * row.price)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")
          : ""
    };
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(HoldingsNew)
);
