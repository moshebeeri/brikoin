export const types = {
  SET_PROJECT_NEXT_PAGE: "SET_PROJECT_NEXT_PAGE",
  SET_PROJECT_LAST_PAGE: "SET_PROJECT_LAST_PAGE",
  GET_PROJECT: "SET_PROJECT_LAST_PAGE"
};

export const getNextPage = key => {
  return {
    type: types.SET_PROJECT_NEXT_PAGE,
    key
  };
};

export const getLastPage = key => {
  return {
    type: types.SET_PROJECT_LAST_PAGE,
    key
  };
};

export const getProject = projectAddress => {
  return {
    type: types.GET_PROJECT,
    projectAddress
  };
};
