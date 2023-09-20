export const types = {
  ASK_ROLE: "ASK_ROLE",
  SET_ROLE_REQUEST: "SET_ROLE_REQUEST",
  SET_ADMIN_ROLE_REQUESTS: "SET_ADMIN_ROLE_REQUESTS",
  LISTEN_ROLE_ADMIN_REQUESTS: "LISTEN_ROLE_ADMIN_REQUESTS",
  APPROVE_ROLE: "APPROVE_ROLE",
  LISTEN_ROLE_REQUEST: "LISTEN_ROLE_REQUEST"
};

export const askRole = (user, role) => {
  return {
    type: types.ASK_ROLE,
    user,
    role
  };
};

export const listenRoles = user => {
  return {
    type: types.LISTEN_ROLE_REQUEST,
    user
  };
};

export const listenRolesAdmin = () => {
  return {
    type: types.LISTEN_ROLE_ADMIN_REQUESTS
  };
};

export const approveRole = (role, entity) => {
  return {
    type: types.APPROVE_ROLE,
    role,
    entity
  };
};
