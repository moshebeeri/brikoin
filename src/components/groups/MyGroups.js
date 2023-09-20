import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import { listenForAllGroups, listenForUsers } from "./groupsUtils";
import GroupInvite from "./groupInvite";
import GroupAddRep from "./groupAddRep";
import GroupAddVotingRights from "./groupAddVotingRights";
import ChunckInvest from "./chunkInvest";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import { GenericList } from "../../UI/index";
import { connect } from "react-redux";
import ApproveDialog from "../../UI/messageBox/ApproveDialog";
import { withRouter } from "react-router-dom";
import { listenForGroups, acceptInvatation, joinGroup } from "./groupsUtils";
import PageLaoding from "../../UI/loading/pageLoading";
import {
  cancelUserGroupOrder,
  saveMyGroups,
  saveStats
} from "../../redux/actions/groups";
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});
import LoadingCircular from "../../UI/loading/LoadingCircular";

const LIST_DESCRIPTOR = {
  projectName: {
    type: "redirectLink",
    width: 200,
    linkParam: "projectAddress",
    labelField: "projectName",
    noTitle: true,
    redirectLink: `/projectsView/`
  },
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
    menuActions: ["invite", "approveInvitation","addRep", "addVotingRights", "createVote", "showVotes"],
    actionType: {
      downloadDocument: "href"
    }
  }
};


const LIST_DESCRIPTOR_SMALL = {
  projectName: {
    type: "redirectLink",
    width: 200,
    linkParam: "projectAddress",
    labelField: "projectName",
    noTitle: true,
    redirectLink: `/projectsView/`
  },
  groupName: { type: "text", width: 150 },
  sum: { type: "number", width: 100 },
  sumTransferred: { type: "number", width: 100 },
  activeMembers: { type: "text", width: 100 },
  reservedPercentage: { type: "text", width: 100 },
  actions: {
    type: "action",
    param: "user",
    width: 300,
    noTitle: true,
    actions: [
    
    ],
    menuActions: ["addRep", "addVotingRights", "createVote", "showVotes",   "invite",
    "approveInvitation",
    "joinGroup",
    "invest",
    "cancelOrder"],
    actionType: {
      downloadDocument: "href"
    }
  }
};
function MyGroups(props){
  const [users, setUsers] = useState([]);
  const [changed, setChanged] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showInvest, setShowInvest] = useState(false);
  const [showRep, setShowRep] = useState(false);
  const [showVotingRights, setVotingRights] = useState(false);
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showApproveInvite, setShowApproveInvite] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  listenForAllGroups(
    props.saveMyGroups,
    setLoadingGroups,
    setChanged,
    changed,
    props.saveStats,
    setGroupsLoaded,
    groupsLoaded
  );
  listenForUsers(setUsers);

  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const { classes, lang, projects, user, direction } = props;
  let loading = false
  if(loadingGroups){
    return <PageLaoding />
  }
  if (projects && projects.length > 0) {
    
    return (
      <div
      style={{
        marginTop: '10%',
        display: "flex",
        minHeight: 300,
        marginTop: "5%",
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
        
         
          <GenericList
            direction={props.direction}
            users={users}
            title={"Project Groups"}
            t={props.t}
            columnDescription={props.width === "xs" ? LIST_DESCRIPTOR_SMALL : LIST_DESCRIPTOR}
            rows={groupsRows(
              props,
              props.myGroups,
              setSelectedGroup,
              setShowInvite,
              setShowApproveInvite,
              setShowJoin,
              setShowInvest,
              props.projectPendingOrders,
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
              users={users}
              t={props.t}
              close={closeGroupView.bind(this, setShowInvite, setSelectedGroup)}
              group={selectedGroup}
              open={showInvite}
            />
          )}
          {showInvest && (
            <ChunckInvest
              t={props.t}
              orders={selectedGroup ? getSelectedOrders(selectedGroup, props.projectPendingOrders) : []}
              close={closeGroupView.bind(this, setShowInvest, setSelectedGroup)}
              group={selectedGroup}
              open={showInvest}
              project={projects.filter(project => project.address === selectedGroup.project)[0]}
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
  return (
    <div style={{ width: "100%", marginTop: "10%", minHeight: 500 }}>
      <LoadingCircular open className={classes.progress} />
    </div>
  );
}


async  function approveInvitation(props, selectedGroup, setShowApproveInvite) {
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
  await joinGroup(selectedGroup.id);
  setShowJoin(false);
}

function closeGroupView(setShowGroup, setSelectedGroup) {
  setShowGroup(false);
  setSelectedGroup("");
}

function getSelectedOrders(group, orders){
  const groupOrders = orders[group.project] ?  orders[group.project].filter(order => order.group === group.id) : []
  return groupOrders
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
  let groupList = groups.data ? groups.data :groups
  return groupList.map(group => {
    group.projectAddress = group.project
    group.projectName = props.projects ? props.projects.filter(project => project.address ===  group.project)[0].name : ''
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
  const groupOrders = getSelectedOrders(group, orders)
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

MyGroups.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  user: state.login.user,
  lang: state.userProfileReducer.lang,
  init: state.trades.init,
  direction: state.userProfileReducer.direction,
  projectPendingOrders: state.projectTradesStats.projectPendingOrders,
  myGroups: state.groups.myGroups,
  groupsStats: state.groups.groupsStats,
});

const mapDispatchToProps = {
  saveMyGroups,
  cancelUserGroupOrder,
  saveStats
};
export default withRouter(
  withWidth()(
    withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MyGroups))
  )
);
