export const types = {
  MAIN: {
    SHOW_PROJECTS: "SHOW_PROJECTS",
    SHOW_ADMIN: "SHOW_ADMIN",
    SHOW_MORTGAGE: "SHOW_MORTGAGE",
    SHOW_HOLDINGS: "SHOW_HOLDINGS",
    SHOW_HOME: "SHOW_HOME",
    SHOW_LOGIN: "SHOW_LOGIN",
    SHOW_SIGN_UP: "SHOW_SIGN_UP"
  }
};
export const showLogin = () => ({
  type: types.MAIN.SHOW_LOGIN
});
export const showSignup = () => ({
  type: types.MAIN.SHOW_SIGN_UP
});
export const showProjects = () => ({
  type: types.MAIN.SHOW_PROJECTS
});
export const showHome = () => ({
  type: types.MAIN.SHOW_HOME
});

export const showAdmin = credential => ({
  type: types.MAIN.SHOW_ADMIN
});
export const showMortgage = credential => ({
  type: types.MAIN.SHOW_MORTGAGE
});

export const showHoldings = error => ({
  type: types.MAIN.SHOW_HOLDINGS
});
