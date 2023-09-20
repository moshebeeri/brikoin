import { createSelector } from "reselect";
import { getProjectList } from "../../UI/project/projectUtils";
export const getProjects = (state, props) => state.projects.projects;
export const getOrganization = (state, props) => state.projects.organizations;
export const getProjectsMortgages = (state, props) =>
  state.projects.projectsMortgages;
const getTerms = (state, props) => state.terms.list;
const getProperties = (state, props) => state.properties.list;
const getProjectsView = (state, props) => state.userProfileReducer.projectsView;
const getProjectType = (state, props) => state.userProfileReducer.projectType;
const getProjectSearchText = (state, props) =>
  state.userProfileReducer.projectSearchText;

const getManagers = (state, props) => state.managers.list;
const getRegistrars = (state, props) => state.registrars.list;
const getTrustees = (state, props) => state.trustees.list;
const getEstimations = (state, props) => state.estimations.list;
export const getPopulatedProjects = createSelector(
  [
    getProjects,
    getTerms,
    getProperties,
    getManagers,
    getRegistrars,
    getTrustees,
    getEstimations,
    getProjectsMortgages,
    getOrganization,
    getProjectsView,
    getProjectType,
    getProjectSearchText
  ],
  (
    projects,
    terms,
    properties,
    managers,
    registrars,
    trustees,
    estimations,
    projectsMortgages,
    organizations,
    projectsView,
    projectType,
    searchText
  ) => {
    if (projects) {
      return projects  ? projects.filter(
        proj =>
          proj.status &&
          proj.status.toLowerCase() === projectsView.toLowerCase() //&& searchProject(proj, projectType, searchText)
      ): [];
    }
    return [];
  }
);
export const getAllProject = createSelector(
  [
    getProjects,
    getTerms,
    getProperties,
    getManagers,
    getRegistrars,
    getTrustees,
    getEstimations,
    getProjectsMortgages
  ],
  (
    projects,
    terms,
    properties,
    managers,
    registrars,
    trustees,
    estimations,
    projectsMortgages
  ) => {
    if (projects) {
      return projects;
    }
    return [];
  }
);

function searchProject(project, type, searchText) {
  if (!type && !searchText) {
    return true;
  }
  if (type && !(project.structure.toLowerCase() === type.toLowerCase())) {
    return false;
  }

  if (!searchText) {
    return true;
  }
  if (searchText) {
    if (project.name.includes(searchText)) {
      return true;
    }

    if (project.description.includes(searchText)) {
      return true;
    }

    if (project.lang.He.description.includes(searchText)) {
      return true;
    }
    if (project.lang.He.name.includes(searchText)) {
      return true;
    }
  }

  return false;
}
