import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withUserOrder } from "../warappers/withUserOrder";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import numberUtils from "../../utils/numberUtils";
import Button from "@material-ui/core/Button";
import { saveStats } from "../../redux/actions/groups";
import currencyUtils from "../../utils/currencyUtils";
import { listenForGroupStat } from "../../components/groups/groupsUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import ProjectGroup from "../../components/groups/groupView";

function GroupDetails(props) {
  const { classes, order, project } = props;
  const [changed, setChanged] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [groupStatLoading, setGroupStatLoading] = useState(
    order.group ? (props.groupsStats[order.group] ? false : true) : true
  );
  listenForGroupStat(
    setGroupStatLoading,
    props.project.address,
    props.order.group,
    props.saveStats,
    setChanged,
    changed
  );
  if (order.group) {
    return (
      <Card className={classes.investCard}>
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              borderWidth: 5,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <Typography align="left" variant={"h6"} color="textSecondary">
              {props.t("Group Offering")}
            </Typography>
            {groupStatLoading && !props.groupsStats[order.group] ? (
              <LoadingCircular open={true} />
            ) : (
              <div>
                <Typography align="center" variant={"h6"} color="textSecondary">
                  {project.currency
                    ? currencyUtils.currencyCodeToSymbol(project.currency)
                    : "$"}{" "}
                  {numberUtils.formatNumber(
                    parseInt(props.groupsStats[order.group].sum),
                    0
                  )}
                </Typography>
                <Button onClick={setShowGroup.bind(this, true)} color="primary">
                  {props.t("groups details")}
                </Button>
              </div>
            )}
          </div>
        </div>
        <ProjectGroup
          t={props.t}
          project={props.project}
          close={setShowGroup.bind(this, false)}
          group={{ id: order.group }}
          open={showGroup}
        />
      </Card>
    );
  } else {
    return <div></div>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user,
    groupsStats: state.groups.groupsStats
  };
};
const mapDispatchToProps = {
  saveStats
};
export default withUserOrder(
  connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
);
