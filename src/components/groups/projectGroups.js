import React, { useEffect, useReducer, useState } from "react";
import { listenForGroups, acceptInvatation, joinGroup } from "./groupsUtils";
import { withProject } from "../../UI/warappers/withProject";
import GroupInvite from "./groupInvite";
import GroupAddRep from "./groupAddRep";
import GroupAddVotingRights from "./groupAddVotingRights";
import ChunckInvest from "./chunkInvest";
import GroupCreate from "./groupCreate";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import { GenericList } from "../../UI/index";
import { connect } from "react-redux";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import ProjectNew from "../projects/ProjectNew";
import ApproveDialog from "../../UI/messageBox/ApproveDialog";
import {
  cancelUserGroupOrder,
  saveGroups,
  saveStats
} from "../../redux/actions/groups";

import Button from "@material-ui/core/Button";
import { listenForOrders } from "../../UI/mortgage/mortgageUtils";

const LIST_DESCRIPTOR = {
  groupName: { type: "text", width: 150 },
  groupType: { type: "checkBox", width: 60 },
  sum: { type: "number", width: 100 },
  sumTransferred: { type: "number", width: 100 },
  membersNumber: { type: "text", width: 100 },
  activeMembers: { type: "text", width: 100 },
  reservedPercentage: { type: "text", width: 100 },
  signedAgreementPercentage: { type: "text", width: 100 },
  actions: {
    type: "action",
    param: "user",
    width: 300,
    noTitle: true,
    actions: [
      "invite",
      "approveInvitation",
      "joinGroup",
      "invest",
      "cancelOrder"
    ],
    menuActions: ["addRep", "addVotingRights", "createVote", "showVotes"],
    actionType: {
      downloadDocument: "href"
    }
  }
};

export function ProjectGroups(props) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState("");
  const [changed, setChanged] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showInvest, setShowInvest] = useState(false);
  const [showRep, setShowRep] = useState(false);
  const [showVotingRights, setVotingRights] = useState(false);
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showApproveInvite, setShowApproveInvite] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  listenForGroups(
    props.saveGroups,
    setLoadingGroups,
    props.project.address,
    setChanged,
    changed,
    props.saveStats
  );
  listenForOrders(setOrders, props);
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const loading =
    (loadingGroups && !props.projectGroups[props.project.address]) ||
    !orders ||
    !props.projectGroups[props.project.address];
  return (
    <div
      style={{
        display: "flex",
        minHeight: 300,
        marginTop: "2%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      {loading ? (
        <LoadingCircular open />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <ProjectNew
            showFullDetails={goToProject.bind(this, props)}
            tory={props.history}
            viewOnly
            t={props.t}
            project={props.project}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              marginTop: 20,
              alignItems: "flex-start",
              justifyContent: "flex-start"
            }}
          >
            <Button
              onClick={setShowGroupCreate.bind(this, true)}
              fullWidth
              className={props.classes.button}
              variant="outlined"
            >
              {props.t("createGroup")}
            </Button>
          </div>
          <GenericList
            direction={props.direction}
            users={users}
            title={"Project Groups"}
            t={props.t}
            columnDescription={LIST_DESCRIPTOR}
            rows={groupsRows(
              props,
              props.projectGroups[props.project.address],
              setSelectedGroup,
              setShowInvite,
              setShowApproveInvite,
              setShowJoin,
              setShowInvest,
              orders,
              setShowCancelOrder,
              setShowRep,
              setVotingRights
            )}
          />
          {showRep && (
            <GroupAddRep
              users={users}
              t={props.t}
              close={closeGroupView.bind(this, setShowRep, setSelectedGroup)}
              group={selectedGroup}
              open={showRep}
            />
          )}
          {showVotingRights && (
            <GroupAddVotingRights
              users={users}
              t={props.t}
              close={closeGroupView.bind(
                this,
                setVotingRights,
                setSelectedGroup
              )}
              group={selectedGroup}
              open={showVotingRights}
            />
          )}
          {showInvite && (
            <GroupInvite
              t={props.t}
              close={closeGroupView.bind(this, setShowInvite, setSelectedGroup)}
              group={selectedGroup}
              open={showInvite}
            />
          )}
          {showInvest && (
            <ChunckInvest
              t={props.t}
              orders={orders}
              close={closeGroupView.bind(this, setShowInvest, setSelectedGroup)}
              group={selectedGroup}
              open={showInvest}
              project={props.project}
            />
          )}
          {showGroupCreate && (
            <GroupCreate
              t={props.t}
              project={props.project}
              close={setShowGroupCreate.bind(this, false)}
              open={showGroupCreate}
            />
          )}
          <ApproveDialog
            t={props.t}
            cancelAction={setShowApproveInvite.bind(this, false)}
            processDone={setShowApproveInvite.bind(this, false)}
            process={showApproveInvite}
            openDialog={showApproveInvite}
            title={props.t("approveInvitation")}
            approveAction={approveInvitation.bind(
              this,
              props,
              selectedGroup,
              setShowApproveInvite
            )}
            approveMessage={props.t("ApproveInvitationMsg")}
          />
          <ApproveDialog
            t={props.t}
            cancelAction={setShowJoin.bind(this, false)}
            processDone={setShowJoin.bind(this, false)}
            process={showJoin}
            openDialog={showJoin}
            title={props.t("joinGroup")}
            approveAction={joinGroupAction.bind(
              this,
              props,
              selectedGroup,
              setShowJoin
            )}
            approveMessage={props.t("JoinGroupMsg")}
          />
          <ApproveDialog
            t={props.t}
            cancelAction={setShowCancelOrder.bind(this, false)}
            processDone={setShowCancelOrder.bind(this, false)}
            process={showCancelOrder}
            openDialog={showCancelOrder}
            title={props.t("cancelOrder")}
            approveAction={cancelOrder.bind(
              this,
              props,
              selectedGroup,
              setShowCancelOrder
            )}
            approveMessage={props.t("cancelOrderMsg")}
          />
        </div>
      )}
    </div>
  );
}

async function approveInvitation(props, selectedGroup, setShowApproveInvite) {
  let member = getUserMember(props, selectedGroup);
  await acceptInvatation(selectedGroup.id, member.id);
  setShowApproveInvite(false);
}

function cancelOrder(props, selectedGroup, setShowCancelOrder) {
  props.cancelUserGroupOrder(
    props.user.uid,
    selectedGroup.id,
    props.project.address
  );
  setShowCancelOrder(false);
}

async function joinGroupAction(props, selectedGroup, setShowJoin) {
  await joinGroup(props.user.uid, selectedGroup.id);
  setShowJoin(false);
}

function closeGroupView(setShowGroup, setSelectedGroup) {
  setShowGroup(false);
  setSelectedGroup("");
}

function selectGroup(setShowGroup, setSelectedGroup, group, otherAction) {
  setShowGroup(true);
  setSelectedGroup(group);
  if (typeof otherAction === "function") {
    otherAction();
  }
}

function goToProject(props) {
  props.history.push(`/projectsView/${props.project.address}`);
}

function groupsRows(
  props,
  groups,
  setSelectedGroup,
  setShowInvite,
  setShowApproveInvite,
  setShowJoin,
  setShowInvest,
  orders,
  setShowCancelOrder,
  setShowRep,
  setVotingRights
) {
  return groups.map(group => {
    group.groupName = props.t(group.name);
    group.groupCreator = group.creator;
    group.groupType = group.type === "CLOSED";
    group.sum = props.groupsStats[group.id]
      ? props.groupsStats[group.id].sum
      : 0;
    group.sumTransferred = props.groupsStats[group.id]
      ? props.groupsStats[group.id].sumTransferred
      : 0;
    group.activeMembers = props.groupsStats[group.id]
      ? props.groupsStats[group.id].activeMembers
      : 0;
    group.reservedPercentage = props.groupsStats[group.id]
      ? props.direction === "rtl"
        ? `% ${props.groupsStats[group.id].reservedPercentage}`
        : `${props.groupsStats[group.id].reservedPercentage} %`
      : 0;
    group.signedAgreementPercentage = props.groupsStats[group.id]
      ? props.direction === "rtl"
        ? `% ${props.groupsStats[group.id].signedAgreementPercentage}`
        : `${props.groupsStats[group.id].signedAgreementPercentage} %`
      : 0;
    group.hideActions = getRowAction(props, group, orders);
    group.invite = selectGroup.bind(
      this,
      setShowInvite,
      setSelectedGroup,
      group
    );
    group.invest = selectGroup.bind(
      this,
      setShowInvest,
      setSelectedGroup,
      group
    );
    group.addRep = selectGroup.bind(this, setShowRep, setSelectedGroup, group);
    group.addVotingRights = selectGroup.bind(
      this,
      setVotingRights,
      setSelectedGroup,
      group
    );
    group.createVote = selectGroup.bind(
      this,
      setShowInvest,
      setSelectedGroup,
      group
    );
    group.showVotes = selectGroup.bind(
      this,
      setShowInvest,
      setSelectedGroup,
      group
    );
    group.joinGroup = selectGroup.bind(
      this,
      setShowJoin,
      setSelectedGroup,
      group
    );
    group.approveInvitation = selectGroup.bind(
      this,
      setShowApproveInvite,
      setSelectedGroup,
      group
    );
    group.cancelOrder = selectGroup.bind(
      this,
      setShowCancelOrder,
      setSelectedGroup,
      group
    );
    group.membersNumber = group.members ? Object.keys(group.members).length : 0;
    return group;
  });
}

function getUserMember(props, group) {
  if (!group.members) {
    return "";
  }
  let members = Object.keys(group.members).map(key => {
    let member = group.members[key];
    member.id = key;
    return member;
  });
  let userMember =
    members.length > 0
      ? members.filter(member => member.userId === props.user.uid)
      : [];
  if (userMember.length > 0) {
    return userMember[0];
  }
  return "";
}

function getRowAction(props, group, orders) {
  const groupOrders = orders.filter(order => order.group === group.id);
  if (group.creator === props.user.uid) {
    if (group.members && Object.keys(group.members).length <= 10) {
      if (groupOrders.length === 0) {
        return showAction([
          "invite",
          "invest",
          "addRep",
          "addVotingRights",
          "createVote",
          "showVotes"
        ]);
      }
      if (!group.fired) {
        return showAction([
          "invite",
          "cancelOrder",
          "addRep",
          "addVotingRights",
          "createVote",
          "showVotes"
        ]);
      }
      return showAction([
        "invite",
        "addRep",
        "addVotingRights",
        "createVote",
        "showVotes"
      ]);
    }
  }
  let userMember = getUserMember(props, group);
  if (userMember && userMember.status === "Invited") {
    return showAction(["approveInvitation"]);
  }
  if (userMember) {
    if (groupOrders.length === 0) {
      return showAction(["invest"]);
    }
    if (!group.fired) {
      return showAction(["cancelOrder"]);
    }
    return showAction([]);
  }
  return showAction(["joinGroup"]);
}

function showAction(actions) {
  let results = [];
  if (LIST_DESCRIPTOR.actions.menuActions) {
    results = LIST_DESCRIPTOR.actions.menuActions.filter(
      action => !actions.includes(action)
    );
  }
  return results.concat(
    LIST_DESCRIPTOR.actions.actions.filter(action => !actions.includes(action))
  );
}

const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  user: state.login.user,
  projectGroups: state.groups.projectGroups,
  direction: state.userProfileReducer.direction,
  groupsStats: state.groups.groupsStats,
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {
  saveGroups,
  cancelUserGroupOrder,
  saveStats
};
export default withProject(
  connect(mapStateToProps, mapDispatchToProps)(ProjectGroups)
);
