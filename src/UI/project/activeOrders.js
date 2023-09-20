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
const ProjectRateProvider = props => (
  <DataTypeProvider formatterComponent={rateFormater} {...props} />
);
const ProjectNumberProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNumberFormater} {...props} />
);
const ActionnFormater = ({ value }) =>
  value.activeAccount.type === "EXTERNAL" ? (
    <div style={{ borderColor: "black", border: 1 }}>
      {value.rows.side === "ask" ? (
        <SubmitOperation
          icon="delete"
          onSuccess={value.cancelOrderExternal.bind(this)}
          request={{
            projectId: value.project.address
          }}
          contract={"CornerStone"}
          event={"AskCancel"}
          method={"askCancel"}
        />
      ) : (
        <SubmitOperation
          icon="delete"
          onSuccess={value.cancelOrderExternal.bind(this)}
          request={{
            projectId: value.project.address
          }}
          contract={"CornerStone"}
          event={"BidCancel"}
          method={"bidCancel"}
        />
      )}
    </div>
  ) : (
    <IconButton onClick={value.cancelOrder.bind(this)} aria-label="Delete">
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

const ProjectTypeAction = props => (
  <DataTypeProvider formatterComponent={ActionnFormater} {...props} />
);

class ActiveOrders extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "size", width: 80 },
        { columnName: "price", width: 75 },
        { columnName: "side", width: 75 },
        { columnName: "action", width: 80 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;

    const columns = [
      { name: "size", title: this.props.t("Volume") },
      { name: "price", title: this.props.t("Price") },
      { name: "side", title: this.props.t("Type") },
      { name: "action", title: " " }
    ];
    const { rows } = this.props;
    if (!rows) {
      return <div />;
    }
    let pendingRows = [];

    pendingRows.push({
      size: rows.size,
      price: rows.price,
      side: rows.side,
      action: this.props
    });
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
            {this.props.t("ActiveOrders")}
          </div>
          <Grid rows={pendingRows} columns={columns}>
            <ProjectTypeProvider for={["side"]} />
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
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveOrders);
