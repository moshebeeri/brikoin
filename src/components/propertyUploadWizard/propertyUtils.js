import React, { useEffect, useReducer, useState } from "react";
import {
  useList,
  useObject,
  useObjectVal
} from "react-firebase-hooks/database";
import firebase from "firebase";

export function listenForNewProjectss(setProjects) {
  const [values, loading, error] = useObjectVal(
    firebase.database().ref(`server/loadingProperties/`)
  );
  useEffect(() => {
    setProjects(getOperations(values));
  }, [loading]);
}



export async function getLoadingProperties(){
  return new Promise((resolve, reject) => {
   
    let api = firebase
      .functions()
      .httpsCallable("collectionsApi/getLoadingProjects");
  
      api().then(async result => {

        let resultData = result.data === 'error' ? [] : result.data
        if(resultData.length > 0 ){
        resultData = await Promise.all(
          resultData.map(async (property) => {
            return await donwloadFiles(property);
          }))  
       }
        resolve(resultData)
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}


async function donwloadFiles(property) {
  console.log("downloadFiles");
  if (property.estimation) {
    property.estimation = await downloadUrlAsPromise(property.estimation);
  }
  if (property.registrar) {
    property.registrar = await downloadUrlAsPromise(property.registrar);
  }
  if (property.rent) {
    property.rent = await downloadUrlAsPromise(property.rent);
  }
  if (property.management) {
    property.management = await downloadUrlAsPromise(property.management);
  }
  if (property.pictures) {
    property.pictures = await Promise.all(
      property.pictures.map(async (picture) => {
        return await downloadUrlAsPromise(picture);
        }))  
  }
  if (property.map) {
    property.map = await downloadUrlAsPromise(property.map); 
  }


  if (property.subProjects && property.subProjects.map) {
    property.subProjects.map = await downloadUrlAsPromise(property.subProjects.map); 
  }

  console.log("download completed");
  return property;
}

function downloadUrlAsPromise(url) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function(evt) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let blob = xhr.response;
          blob.name = url;
          resolve(blob);
        } else {
          reject(new Error("Ajax error for " + url + ": " + xhr.status));
        }
      }
    };
    xhr.send();
  });
}

function getOperations(operations) {
  if (!operations || Object.keys(operations).length === 0) {
    return [];
  }
  return Object.keys(operations)
    .map(key => {
      let operation = operations[key];
      operation.id = key;
      return operation;
    })
    .sort(function(a, b) {
      return parseFloat(b.time) - parseFloat(a.time);
    });
}

export function duplicateProperty(project){
  return new Promise((resolve, reject) => {
   
    let duplicateApi = firebase
      .functions()
      .httpsCallable("collectionsApi/duplicateProject");
  
      duplicateApi({id: project}).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}


export function deleteProject(project){
  return new Promise((resolve, reject) => {
   
    let duplicateApi = firebase
      .functions()
      .httpsCallable("collectionsApi/deleteLoadingProject");
  
      duplicateApi({id: project}).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}

export function approveProject(project){
  return new Promise((resolve, reject) => {
   
    let duplicateApi = firebase
      .functions()
      .httpsCallable("collectionsApi/loadingProjectApproved");
  
      duplicateApi({id: project}).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}
export function projectReviewed(project){
  return new Promise((resolve, reject) => {
   
    let duplicateApi = firebase
      .functions()
      .httpsCallable("collectionsApi/loadingProjectReviewed");
  
      duplicateApi({id: project}).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}




export function getParentProjects(){
  return new Promise((resolve, reject) => {
   
    let parentProjects = firebase
      .functions()
      .httpsCallable("collectionsApi/getParentProjects");
  
      parentProjects().then(result => {
        resolve(result.data)
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}


export function assignProjectToParent(projectId, parentId){
  return new Promise((resolve, reject) => {
   
    let parentProjects = firebase
      .functions()
      .httpsCallable("collectionsApi/assignToParentProject");
  
      parentProjects({id: projectId, parentId: parentId}).then(result => {
        resolve(result.data)
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}