import * as React from "react";
import { SubmitOperation } from "../../UI/index";
import Paper from "@material-ui/core/Paper";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
const ActionnFormater = ({ value }) =>
  value.props.activeAccount.type === "EXTERNAL" ? (
    <div style={{ borderColor: "black", border: 1 }}>
      {value.rows.side === "ask" ? (
        <SubmitOperation
          icon="delete"
          onSuccess={value.props.cancelOrderExternal.bind(this)}
          request={{
            projectId: value.props.project.address
          }}
          contract={"CornerStone"}
          event={"AskCancel"}
          method={"askCancel"}
        />
      ) : (
        <SubmitOperation
          icon="delete"
          onSuccess={value.props.cancelOrderExternal.bind(this)}
          request={{
            projectId: value.props.project.address
          }}
          contract={"CornerStone"}
          event={"BidCancel"}
          method={"bidCancel"}
        />
      )}
    </div>
  ) : (
    <IconButton
      onClick={value.props.cancelMortgageRequest.bind(
        this,
        value.key,
        value.mortgageId
      )}
      aria-label="Delete"
    >
      <DeleteIcon />
    </IconButton>
  );

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
const ProjectTypeAction = props => (
  <DataTypeProvider formatterComponent={ActionnFormater} {...props} />
);

class PendingMortgagesRequests extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        { columnName: "amount", width: 90 },
        { columnName: "downPayment", width: 100 },
        { columnName: "status", width: 60 },
        { columnName: "action", width: 50 }
      ]
    };
  }

  render() {
    const { columnWidths } = this.state;
    const columns = [
      { name: "amount", title: this.props.t("amount") },
      { name: "downPayment", title: this.props.t("downPayment") },
      { name: "status", title: this.props.t("status") },
      { name: "action", title: " " }
    ];
    const { rows, user } = this.props;

    console.log(rows);
    const pendingRows = rows
      ? rows.map(row => {
          let actionObj = {
            props: this.props,
            key: row.key,
            mortgageId: row.mortgageId
          };
          return {
            user: row.user,
            trade: row.trade,
            amount: row.amount,
            downPayment: row.downPayment,
            status: row.approved
              ? this.props.t("approved")
              : this.props.t("waitingForApprove"),
            action: actionObj
          };
        })
      : [];

    if (pendingRows.length === 0) {
      return <div />;
    }

    const filteredPendingRows = pendingRows.filter(
      row => !row.trade && row.user === user.uid
    );
    if (filteredPendingRows.length === 0) {
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
            {this.props.t("pendingMortgagesRequests")}
          </div>
          <Grid rows={filteredPendingRows} columns={columns}>
            <ProjectTypeProvider
              for={["amount", "downPayment", "status", "action"]}
            />
            <ProjectTypeAction for={["action"]} />

            <Table columnExtensions={columnWidths} />

            <TableHeaderRow contentComponent={ColumFormater} />
          </Grid>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingMortgagesRequests);
