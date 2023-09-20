import React, { useEffect, useReducer, useState } from "react";
import { withUser } from "../../UI/warappers/withUser";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { GenericForm } from "../../UI/index";
import { listenForGroupStat } from "./groupsUtils";
import { saveStats } from "../../redux/actions/groups";
import currencyUtils from "../../utils/currencyUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";

const GROUP_VIEW = {
  sum: "readOnly-text-number",
  activeMembers: "readOnly-text-number",
  members: "readOnly-text-number",
  reservedPercentage: "readOnly-text-number",
  signedAgreementPercentage: "readOnly-text-number"
};

export function GroupView(props) {
  const [groupStatLoading, setGroupStatLoading] = useState(
    props.groupsStats[props.group.id] ? false : true
  );
  const [changed, setChanged] = useState(false);
  listenForGroupStat(
    setGroupStatLoading,
    props.group.project,
    props.group.id,
    props.saveStats,
    setChanged,
    changed
  );
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.group.name}</DialogTitle>
      <div dir={props.direction}>
        <div style={{ width: 320 }}>
          <LoadingCircular
            open={groupStatLoading && !props.groupsStats[props.group.id]}
          />
          {props.groupsStats[props.group.id] &&
            Object.keys(props.groupsStats[props.group.id]).length > 0 && (
              <GenericForm
                symbols={getSymbols(props)}
                entity={props.groupsStats[props.group.id]}
                t={props.t}
                entityDescriptor={GROUP_VIEW}
              />
            )}
        </div>
      </div>
    </Dialog>
  );
}

function getSymbols(props) {
  return {
    sum: currencyUtils.currencyCodeToSymbol(props.project.currency),
    activeMembers: "",
    members: "",
    reservedPercentage: "%",
    signedAgreementPercentage: "%"
  };
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  groupsStats: state.groups.groupsStats
});
const mapDispatchToProps = {
  saveStats
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(GroupView)
);
