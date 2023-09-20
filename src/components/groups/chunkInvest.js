import React, { useEffect, useReducer, useState } from "react";
import { withUser } from "../../UI/warappers/withUser";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import withWidth from "@material-ui/core/withWidth";
import { GenericForm } from "../../UI/index";
import Typography from "@material-ui/core/Typography";
import { listenForGroupStat } from "./groupsUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import { format } from "../../utils/stringUtils";
import numberUtils from "../../utils/numberUtils";
import { setPendingOrder } from "../../redux/actions/trade";
import { saveStats } from "../../redux/actions/groups";
import currencyUtils from "../../utils/currencyUtils";
import { submitProjectOffer } from "../../UI/investDialog/investApi";

const GROUP_CREATOR = {
  investAmountGroup: "text"
};

export function ChunkInvest(props) {
  const [invalidMessage, setInvalidMessage] = useState("");
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
      onClose={onClose.bind(this, props, setInvalidMessage)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.t("invest")}</DialogTitle>
      <div
        dir={props.direction}
        style={{
          height: props.width === "xs" ? 600 : 300,
          width: props.width === "xs" ? 500 : 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column"
        }}
      >
        <LoadingCircular open={groupStatLoading} />
        {!groupStatLoading && (
          <div style={{ margin: 4 }}>
            <Typography
              align={props.direction === "ltr" ? "left" : "right"}
              variant="subtitle1"
            >
              {format(props.t("GroupInvestmentDescription"), [
                ` ${currencyUtils.currencyCodeToSymbol(
                  props.project.currency
                )} ${numberUtils.formatNumber(
                  parseInt(props.project.target) -
                    props.groupsStats[props.group.id].sum,
                  0
                )}`,
                ` ${currencyUtils.currencyCodeToSymbol(
                  props.project.currency
                )} ${numberUtils.formatNumber(props.project.minBulkSize, 0)} `,
                ` ${currencyUtils.currencyCodeToSymbol(
                  props.project.currency
                )} ${numberUtils.formatNumber(props.project.maxBulkSize, 0)} `
              ])}
            </Typography>
          </div>
        )}
        {!groupStatLoading && (
          <div style={{ width: 320 }}>
            <GenericForm
              mandatoryFields={["investAmountGroup"]}
              buttonTitle={"invest"}
              entity={{}}
              t={props.t}
              entityDescriptor={GROUP_CREATOR}
              save={submitOrder.bind(
                this,
                props,
                setInvalidMessage,
                props.groupsStats[props.group.id]
              )}
            />
          </div>
        )}
        {invalidMessage && (
          <div style={{ marginTop: 4 }}>
            <Typography
              align={props.direction === "ltr" ? "left" : "right"}
              variant="subtitle1"
            >
              {invalidMessage}
            </Typography>
          </div>
        )}
      </div>
    </Dialog>
  );
}

function onClose(props, setInvalidMessage) {
  setInvalidMessage("");
  props.close();
}

function submitOrder(props, setInvalidMessage, groupStat, entity) {
  if (
    validateOrder(props, setInvalidMessage, entity, props.project, groupStat)
  ) {
    setInvalidMessage("");
    submitProjectOffer(
      entity.investAmountGroup,
      1,
      props.project.address,
      props.group.id,
      '',
      ''
    );
   
    props.close();
  }
}


function validateOrder(props, setInvalidMessage, entity, project, groupStat) {
  let sumLeft = parseInt(project.target) - groupStat.sum;
  if (
    sumLeft - entity.investAmountGroup > 0 &&
    sumLeft - entity.investAmountGroup < project.minBulkSize
  ) {
    setInvalidMessage(
      format(props.t("invalidMinLeft"), [
        ` ${currencyUtils.currencyCodeToSymbol(
          props.project.currency
        )} ${numberUtils.formatNumber(sumLeft - entity.investAmountGroup, 0)}`
      ])
    );
    return false;
  }
  if (entity.investAmountGroup < project.minBulkSize) {
    setInvalidMessage(
      format(props.t("invalidMin"), [
        ` ${currencyUtils.currencyCodeToSymbol(
          props.project.currency
        )} ${numberUtils.formatNumber(project.minBulkSize, 0)}`
      ])
    );
    return false;
  }
  if (entity.investAmountGroup > project.maxBulkSize) {
    setInvalidMessage(
      format(props.t("invalidMax"), [
        ` ${currencyUtils.currencyCodeToSymbol(
          props.project.currency
        )} ${numberUtils.formatNumber(project.maxBulkSize, 0)}`
      ])
    );
    return false;
  }
  return true;
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  groupsStats: state.groups.groupsStats
});
const mapDispatchToProps = {
  setPendingOrder,
  saveStats
};
export default withWidth()(
  withUser(connect(mapStateToProps, mapDispatchToProps)(ChunkInvest))
);
