import React, { useEffect, useReducer, useState } from "react";
import {
  useList,
  useObject,
  useObjectVal
} from "react-firebase-hooks/database";
import firebase from "firebase";


export function getProjectStatus(
  project,
  setProjectStatus,
  setLoadingStatus
) {
  let projectStatusApi = firebase
    .functions()
    .httpsCallable("projectApi/getProjectStatus");

    projectStatusApi(project.address).then(result => {
      setProjectStatus(result.data)
      setLoadingStatus(false)
     console.log(`done ${JSON.stringify(result)}`);
  });
}


export function getOrder(
  project,
  setUserOrder,
  setLoadingOrder
) {
  let userOrderApi = firebase
    .functions()
    .httpsCallable("projectApi/getUserOrder");

    userOrderApi(project.address).then(result => {
      setUserOrder(result.data)
      setLoadingOrder(false)
    console.log(`done ${JSON.stringify(result)}`);
  });
}

export function getProject(projects, projectAddress) {
  if (projects && projectAddress) {
    return projects.filter(project => project.address === projectAddress)[0];
  }
  return "";
}

export function getProjectName(project, userLang) {
  if (!project) {
    return "";
  }
  if (project.lang && project.lang[userLang] && project.lang[userLang].name) {
    return project.lang[userLang].name;
  }
  return project.name;
}

export function isProjectLoaded(loaded, project, preview){
  if (preview) {
    return true;
  }
  if (!loaded[project.address]) {
    return false;
  }
  if (loaded[project.address]["ASKS"]) {
    return true;
  }
  if (loaded[project.address]["BIDS"]) {
    return true;
  }
  if (loaded[project.address]["PENDING"]) {
    return true;
  }
  if (loaded[project.address]["HOLDINGS"]) {
    return true;
  }
  if (loaded[project.address]["TRADES"]) {
    return true;
  }
  return false;
  
}
export function getProjectDescription(project, lang) {
  if (project[lang] && project[lang].description) {
    return project[lang].description;
  }
  return project.description;
}

export function getProjectList(
  managers,
  registrars,
  trustees,
  estimations,
  properties,
  projects,
  projectsMortgages,
  terms
) {
  let managersMap = toMap(managers);
  let registrarsMap = toMap(registrars);
  let trusteesMap = toMap(trustees);
  let estimationsMap = toMap(estimations);
  let populatedProperties = properties;
  if (Object.keys(managersMap).length === 0) {
    return [];
  }
  if (Object.keys(registrarsMap).length === 0) {
    return [];
  }
  if (Object.keys(trusteesMap).length === 0) {
    return [];
  }
  if (Object.keys(estimationsMap).length === 0) {
    return [];
  }
  populatedProperties.forEach(property => {
    if (property.manager && !property.manager.address) {
      property.manager = managersMap[property.manager];
    }
    if (property.registrar && !property.registrar.address) {
      property.registrar = registrarsMap[property.registrar];
    }
    if (property.trustee && !property.trustee.address) {
      property.trustee = trusteesMap[property.trustee];
    }
    if (property.estimation && !property.estimation.address) {
      property.estimation = estimationsMap[property.estimation];
    }
    return property;
  });
  let propertiesMap = toMap(populatedProperties);
  let termsMap = toMap(terms);
  if (Object.keys(propertiesMap).length === 0) {
    return [];
  }
  if (Object.keys(termsMap).length === 0) {
    return [];
  }
  let populatedProjects = projects;
  populatedProjects.forEach(project => {
    if (project.term && !project.term.address) {
      project.term = termsMap[project.term];
    }
    if (project.property && !project.property.address) {
      project.property = propertiesMap[project.property];
    }
    project.mortgages = projectsMortgages[project.address];
    if (project.organization) {
      let org = organizations.filter(
        org => org.address === project.organization
      );
      if (org.length > 0) {
        project.organization = org[0];
      }
    }
    return project;
  });
  let sortedProjects = populatedProjects.sort(function(a, b) {
    return b.timestamp - a.timestamp;
  });
  return sortedProjects;
}

function toMap(array) {
  return array.reduce(function(map, obj) {
    map[obj.address] = obj;
    return map;
  }, {});
}
