import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { DataTypeProvider, RowDetailState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableColumnResizing,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { handleMortgageRequest } from "../../redux/actions/mortgage";
import numberUtils from "../../utils/numberUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
const numberFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {numberUtils.formatNumber(value, 2)}
  </Typography>
);
const ProjectTitleFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);
const StatusFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value ? "True" : "False"}
  </Typography>
);
const ActionFormater = ({ value }) => (
  <div>
    {!value.row.approved && (
      <Button
        onClick={value.approveRejectRequest.bind(
          this,
          value.props.user.uid,
          value.row.mortgageRequestAddress,
          value.row.mortgageConditionAddress,
          value.row.project,
          value.row.mortgageId,
          value.row.key,
          true,
          value.props,
          value.setCallingAction
        )}
        color="primary"
      >
        Approve
      </Button>
    )}
    {!value.row.approved && (
      <Button
        onClick={value.approveRejectRequest.bind(
          this,
          value.props.user.uid,
          value.row.mortgageRequestAddress,
          value.row.mortgageConditionAddress,
          value.row.project,
          value.row.mortgageId,
          value.row.key,
          false,
          value.props,
          value.setCallingAction
        )}
        color="primary"
      >
        Decline
      </Button>
    )}
    {value.row.approved && value.myMortgagePayment[value.row.key] && (
      <Button
        onClick={value.props.openDetailsPopup.bind(
          this,
          value.row.project,
          value.row.mortgageId,
          value.row.key
        )}
        color="primary"
      >
        Details
      </Button>
    )}
  </div>
);
const UserFormater = ({ value }) => (
  <Button
    onClick={value.props.openKycPopup.bind(this, value.user)}
    color="primary"
  >
    KYC
  </Button>
);
const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);
const NumberProvider = props => (
  <DataTypeProvider formatterComponent={numberFormater} {...props} />
);
const StatusProvider = props => (
  <DataTypeProvider formatterComponent={StatusFormater} {...props} />
);
const ActionProvider = props => (
  <DataTypeProvider formatterComponent={ActionFormater} {...props} />
);
const UserProvider = props => (
  <DataTypeProvider formatterComponent={UserFormater} {...props} />
);

function MortgagePendingRow(props) {
  const [columnWidths, setColumnWidth] = useState([
    { columnName: "downPayment", width: 100 },
    { columnName: "amount", width: 140 },
    { columnName: "mortgageType", width: 100 },
    { columnName: "user", width: 80 },
    { columnName: "approved", width: 120 },
    { columnName: "action", width: 180 }
  ]);
  const [expandedRowIds, setExpandedRowIds] = useState([]);
  const [callingAction, setCallingAction] = useState(false);
  useEffect(() => {
    if (callingAction) {
      setTimeout(() => {
        setCallingAction(false);
      }, 20000);
    }
  }, [callingAction]);
  const { rows, myMortgagePayment } = props;
  const columns = columnDefinitions(props);
  if (rows) {
    const tableRows = rows.map(row => {
      let newRow = createRow(
        row,
        myMortgagePayment,
        props,
        approveRejectRequest,
        setCallingAction
      );
      return newRow;
    });
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        {callingAction && <LoadingCircular open />}
        {createTable(
          tableRows,
          columns,
          expandedRowIds,
          columnWidths,
          setExpandedRowIds
        )}
      </div>
    );
  }
  return <div />;
}

function approveRejectRequest(
  userUid,
  mortgageRequestAddress,
  mortgageConditionAddress,
  project,
  mortgageId,
  key,
  approve,
  props,
  setCallingAction
) {
  props.handleMortgageRequest(
    userUid,
    mortgageRequestAddress,
    mortgageConditionAddress,
    project,
    mortgageId,
    key,
    approve
  );
  setCallingAction(true);
}

function createTable(
  tableRows,
  columns,
  expandedRowIds,
  columnWidths,
  setExpandedRowIds
) {
  return (
    <Grid rows={tableRows} columns={columns}>
      <ProjectTypeProvider for={["mortgageType"]} />
      <NumberProvider for={["amount", "downPayment"]} />

      <StatusProvider for={["approved"]} />
      <ActionProvider for={["action"]} />
      <UserProvider for={["user"]} />
      <RowDetailState
        expandedRowIds={expandedRowIds}
        onExpandedRowIdsChange={setExpandedRowIds}
      />
      <Table />

      <TableColumnResizing columnWidths={columnWidths} />
      <TableHeaderRow />
    </Grid>
  );
}

function columnDefinitions(props) {
  return [
    { name: "amount", title: props.t("mortgageAmount") },
    { name: "downPayment", title: props.t("downPayment") },
    { name: "mortgageType", title: props.t("type") },
    { name: "user", title: props.t("requester") },
    { name: "approved", title: props.t("approved") },
    { name: "action", title: " " }
  ];
}

function createRow(
  row,
  myMortgagePayment,
  props,
  approveRejectRequest,
  setCallingAction
) {
  return {
    downPayment: row.downPayment,
    amount: row.amount,
    mortgageType: row.mortgageType,
    user: { props: props, user: row.user },
    approved: row.approved,
    action: {
      props: props,
      setCallingAction: setCallingAction,
      approveRejectRequest: approveRejectRequest,
      row: row,
      myMortgagePayment: myMortgagePayment
    }
  };
}

const mapStateToProps = (state, props) => ({
  user: state.login.user
});
const mapDispatchToProps = {
  handleMortgageRequest
};
export default connect(mapStateToProps, mapDispatchToProps)(MortgagePendingRow);
