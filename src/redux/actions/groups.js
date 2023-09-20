export const types = {
  INVITE_USER: "INVITE_USER",
  ADD_GROUP_REPRESENTATIVE: "ADD_GROUP_REPRESENTATIVE",
  ADD_GROUP_VOTING_RIGHTS: "ADD_GROUP_VOTING_RIGHTS",
  ACCEPT_INVITATION: "ACCEPT_INVITATION",
  CREATE_GROUP: "CREATE_GROUP",
  JOIN_GROUP: "JOIN_GROUP",
  SAVE_STATS: "SAVE_STATS",
  CANCEL_USER_GROUP_ORDER: "CANCEL_USER_GROUP_ORDER",
  SAVE_GROUPS: "SAVE_GROUPS",
  SAVE_MY_GROUPS: "SAVE_MY_GROUPS"
};
export const inviteUser = (user, group, creator) => ({
  type: types.INVITE_USER,
  user,
  group,
  creator
});

export const addGroupRepresentative = (user, group, creator) => ({
  type: types.ADD_GROUP_REPRESENTATIVE,
  user,
  group,
  creator
});
export const addGroupVotingRights = (user, userMemberId, group, creator) => ({
  type: types.ADD_GROUP_VOTING_RIGHTS,
  user,
  userMemberId,
  creator,
  group
});
export const acceptInvitation = (user, group, memberId) => ({
  type: types.ACCEPT_INVITATION,
  user,
  group,
  memberId
});
export const createGroup = (user, groupType, project, name) => ({
  type: types.CREATE_GROUP,
  user,
  groupType,
  project,
  name
});
export const joinGroup = (user, group) => ({
  type: types.JOIN_GROUP,
  user,
  group
});
export const saveStats = (groupId, stats) => ({
  type: types.SAVE_STATS,
  groupId,
  stats
});
export const saveGroups = (project, groups) => ({
  type: types.SAVE_GROUPS,
  project,
  groups
});

export const saveMyGroups = (groups) => ({
  type: types.SAVE_MY_GROUPS,
  groups
});
export const cancelUserGroupOrder = (userId, groupId, project) => ({
  type: types.CANCEL_USER_GROUP_ORDER,
  userId,
  groupId,
  project
});
