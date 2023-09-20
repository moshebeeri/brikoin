import firebase from "firebase";
import {
  useList,
  useObject,
  useObjectVal
} from "react-firebase-hooks/database";
import React, { useEffect, useReducer, useState } from "react";
const minReducer = (accumulator, currentValue) =>
  currentValue < accumulator ? currentValue : accumulator;

export function getProjectMinInvest(subProjects) {
  if (subProjects.length === 0) {
    return 0;
  }
  return subProjects
    .map(project => project.target / project.maxOwners)
    .reduce(minReducer);
}



export function getProjectByAddress(projectAddress){
  return new Promise((resolve, reject) => {
   
    let api = firebase
      .functions()
      .httpsCallable("projects/getProjectByAddress");
  
      api(projectAddress
        ).then(result => {
        resolve(result.data)
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}


export function getSubProjectsByid(projectId){
  return new Promise((resolve, reject) => {
   
    let api = firebase
      .functions()
      .httpsCallable("projects/getSupProjects");
  
      api(projectId).then(result => {
        resolve(result.data)
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}

export function listenForProject(setProjectChanged) {
  const [snapshots, loadingNotifications, errorLoading] = useObjectVal(
    firebase
      .database()
      .ref(`server/projectsCollections/changedPath/time`)
  );
  useEffect(() => {
    setProjectChanged(true)
  }, [snapshots, loadingNotifications]);
}


export function getProjectSubProjects(parentProject, projects, subProjects) {
  let filteredProjects = projects.filter(
    project =>
      project.parentProjectId && project.parentProjectId === parentProject.id
  );
  if (filteredProjects.length > 0) {
    return filteredProjects;
  }
  if (!subProjects) {
    return [];
  }
  if (
    parentProject.subProjects &&
    parentProject.subProjects.projects &&
    Object.keys(parentProject.subProjects.projects).length > 0
  ) {
    filteredProjects = Object.keys(parentProject.subProjects.projects)
      .map(key => parentProject.subProjects.projects[key].project)
      .map(id => {
        let filteredProject = subProjects.filter(
          project => project.id && project.id === id
        );
        if (filteredProject.length > 0) {
          return filteredProject[0];
        }
        return "";
      })
      .filter(project => project);
    return filteredProjects;
  }
  return [];
}
