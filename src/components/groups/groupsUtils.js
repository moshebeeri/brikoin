import React, { useEffect, useReducer, useState } from "react";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase";

export function inviteUser(groupId, userId){
    return new Promise((resolve, reject) => {
   
      let api = firebase
        .functions()
        .httpsCallable("groupsApi/inviteUser");
    
        api({groupId: groupId, userId: userId}).then(result => {
          resolve(result.data)
        console.log(`done ${JSON.stringify(result)}`);
      }).catch((error) => {
        resolve('error')
    
        console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
      });;
    })
  }

  export function acceptInvatation(groupId, memberId){
  
    return new Promise((resolve, reject) => {
   
      let api = firebase
        .functions()
        .httpsCallable("groupsApi/acceptInvatation");
    
        api({groupId: groupId, memberId: memberId}).then(result => {
          resolve(result.data)
        console.log(`done ${JSON.stringify(result)}`);
      }).catch((error) => {
        resolve('error')
    
        console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
      });;
    })
  }


  export function joinGroup(groupId){
  
    return new Promise((resolve, reject) => {
   
      let api = firebase
        .functions()
        .httpsCallable("groupsApi/joinGroup");
    
        api({groupId: groupId}).then(result => {
          resolve(result.data)
        console.log(`done ${JSON.stringify(result)}`);
      }).catch((error) => {
        resolve('error')
    
        console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
      });;
    })
  }




export function createGroup(group){
  return new Promise((resolve, reject) => {
   
    let api = firebase
      .functions()
      .httpsCallable("groupsApi/createGroup");
  
      api(group).then(result => {
        resolve(result.data)
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}

export function searchUser(text){
  return new Promise((resolve, reject) => {
   
    let api = firebase
      .functions()
      .httpsCallable("userApi/searchUsers");
  
      api(text).then(result => {
        resolve(result.data.hits)
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}

export function listenForGroups(
  setGroups,
  setLoadingGroups,
  projectAddress,
  setChanged,
  changed,
  saveStats
) {
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/groups/changed/${projectAddress}`)
  );
  let getProjectGroups = firebase
    .functions()
    .httpsCallable("groupsApi/getProjectGroups");
  let getGroupStat = firebase
    .functions()
    .httpsCallable("groupsApi/getGroupStat");

  useEffect(() => {
    getProjectGroups({ project: projectAddress }).then(result => {
      setLoadingGroups(false);
      setGroups(projectAddress, result.data);
      if (result.data && result.data.length > 0) {
        result.data.map(group =>
          getGroupStat({ group: group.id }).then(result => {
            setLoadingGroups(false);
            saveStats(group.id, result.data);
            setChanged(changed);
          })
        );
      }
      setChanged(!changed);
    });
  }, [snapshots]);
}

export function listenForAllGroups(
  setGroups,
  setLoadingGroups,
  setChanged,
  changed,
  saveStats,
  setGroupsLoaded,
  groupsLoaded
  
) {
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/groups/changed/`)
  );
  let getProjectGroups = firebase
    .functions()
    .httpsCallable("groupsApi/getMyProjectGroups");
  let getGroupStat = firebase
    .functions()
    .httpsCallable("groupsApi/getGroupStat");
  useEffect(() => {
    if(!groupsLoaded){
      setLoadingGroups(true);
    }
    getProjectGroups().then(result => {
      setGroups(result.data)
      setGroupsLoaded(true)
      setLoadingGroups(false);
      if (result.data && result.data.length > 0) {
        result.data.map(group =>
          getGroupStat({ group: group.id }).then(result => {
            setLoadingGroups(false);
            saveStats(group.id, result.data);
            setChanged(changed);
          })
        );
      }
      setChanged(!changed);
    });
  }, [snapshots]);
}

export function listenForGroupStat(
  setLoadingGroups,
  projectAddress,
  groupId,
  saveStats,
  setChanged,
  changed
) {
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/groups/changed/${projectAddress}`)
  );
  let getGroupStat = firebase
    .functions()
    .httpsCallable("groupsApi/getGroupStat");
  useEffect(() => {
    getGroupStat({ group: groupId }).then(result => {
      setLoadingGroups(false);
      saveStats(groupId, result.data);
      setChanged(!changed);
    });
  }, [snapshots]);
}

function getObjects(values, snapshots) {
  if (!values || Object.keys(values).length === 0) {
    return [];
  }
  let changes = [];
  let changesIds = [];
  if (snapshots && snapshots.length > 0) {
    changes = snapshots.map(snap => {
      let change = snap.val();
      change.id = snap.key;
      return change;
    });
    changesIds = snapshots.map(snap => snap.key);
  }
  let results = Object.keys(values)
    .map(key => {
      let value = values[key];
      value.id = key;
      return value;
    })
    .filter(value => !changesIds.includes(value.id));
  return results.concat(changes);
}

export function listenForUsers(setUsers) {
  const [values, loading, error] = useObjectVal(
    firebase.database().ref(`server/usersPublic/`)
  );
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/usersPublic/`)
  );
  useEffect(() => {
    setUsers(
      getObjects(values).map(user => {
        user.userId = user.id;
        return user;
      })
    );
  }, [snapshots, loading]);
}
