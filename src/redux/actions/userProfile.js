export const types = {
  SET_LANGUAGE: "SET_LANGUAGE",
  SET_PROJECTS_VIEW: "SET_PROJECTS_VIEW",
  FILTER_PROJECT: "FILTER_PROJECT"
};
export const selectLanguage = (lang, direction) => ({
  type: types.SET_LANGUAGE,
  lang,
  direction
});
export const selectProjectsView = projectsView => ({
  type: types.SET_PROJECTS_VIEW,
  projectsView
});
export const filterProjects = (filterType, searchText) => ({
  type: types.FILTER_PROJECT,
  filterType,
  searchText
});
