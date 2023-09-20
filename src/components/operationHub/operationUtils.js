import React, { useEffect, useReducer, useState } from "react";
import {
  useList,
  useObject,
  useObjectVal
} from "react-firebase-hooks/database";
import firebase from "firebase";
import { useDownloadURL } from 'react-firebase-hooks/storage';


export function operationDone(
  operation,
  setLoadingDone
) {

 return new Promise((resolve, reject) => {
   
  let operationDoneApi = firebase
    .functions()
    .httpsCallable("projectApi/operationDone");

    operationDoneApi(operation).then(result => {
      if(setLoadingDone){
        setLoadingDone()
      }
      resolve('done')

    console.log(`done ${JSON.stringify(result)}`);
  }).catch((error) => {
    if(setLoadingDone){
      setLoadingDone()
    }
    resolve('error')

    console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
  });;
})
}

export function updateOriginalFile(operation){
  return new Promise((resolve, reject) => {
   
    let updateOriginalFile = firebase
      .functions()
      .httpsCallable("projectApi/updateOriginalFile");
  
      updateOriginalFile(operation).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}
export function convertDocumentToHtml(
  operation,
) {

 return new Promise((resolve, reject) => {
   
  let operationDoneApi = firebase
    .functions()
    .httpsCallable("projectApi/convertDocumentToHtml");

    operationDoneApi(operation).then(result => {
      resolve('done')

    console.log(`done ${JSON.stringify(result)}`);
  }).catch((error) => {
    resolve('error')

    console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
  });;
})
}

export function getUserById(
  userId,
) {

 return new Promise((resolve, reject) => {
   
  let userApi = firebase
    .functions()
    .httpsCallable("projectApi/getUserById");

    userApi(userId).then(result => {
      resolve(result.data)

    console.log(`done ${JSON.stringify(result)}`);
  }).catch((error) => {
    resolve('error')

    console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
  });;
})
}

export function searchLawyer(searchParam, setLawyer){
  let submitOfferApi = firebase
  .functions()
  .httpsCallable("projectApi/searchLawyer");

submitOfferApi({
  text: searchParam,
}).then(result => {
  setLawyer(result.data)
});
}



export function selectLawyer(lawyerId, project, side, orderId , buyerId, operationKey){
  return new Promise((resolve, reject) => {
  
  let submitOfferApi = side === 'SELLER' ? firebase
  .functions()
  .httpsCallable("projectApi/assignSellerLawyer") : 
  firebase
  .functions()
  .httpsCallable("projectApi/assignBuyerLawyer")
  ;

submitOfferApi({
  project: project,
  operationKey: operationKey || '',
  orderId: orderId || '',
  buyer: buyerId || '',
  lawyerId: lawyerId,
}).then(result => {
  resolve(true)
});
})
}
 

export function getUserFlowWizards(project){
  return new Promise((resolve, reject) => {
  
  let api =  firebase.functions().httpsCallable("projectApi/getUserFlowById") 
  api(project).then(result => {
      resolve(result.data)
  });
})
}

export function getUserFlowsWizard(){
  return new Promise((resolve, reject) => {
  
  let api =  firebase.functions().httpsCallable("projectApi/getUserFlowsWizard") 
  api().then(result => {
      resolve(result.data)
  });
})
}


export function saveDocumentAttrivutes(
  documentId,
  attributes,
) {
  let submitOfferApi = firebase
    .functions()
    .httpsCallable("projectApi/updateDocument");

  submitOfferApi({
    documentId: documentId,
    attributes: attributes,
  }).then(result => {
    console.log(`done ${JSON.stringify(result)}`);
  });
}
export function getDownloadUrl(path, setDownloadUrl){
  const [value, loading, error] = useDownloadURL(
    firebase.storage().ref(path)
  );
  useEffect(() => {
    setDownloadUrl(value);
  }, [loading]);
}


export function listenForOperations(
  setOperations,
  setLoadingOperations,
  props
) {
  const [values, loading, error] = useObjectVal(
    firebase
      .database()
      .ref(`server/operationHub/${props.user.uid}/operations`)
      .orderByChild("time")
  );
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase.database().ref(`server/operationHub/${props.user.uid}/operations`)
  );
  useEffect(() => {
    setLoadingOperations(loading);
    setOperations(getOperations(values));
  }, [snapshots, loading]);
}

export function listenForOperation(setOperation, operation, props) {
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase
      .database()
      .ref(`server/operationHub/${props.user.uid}/operations/${operation.id}`)
  );
  useEffect(() => {
    let validationKey = snapshots.filter(snap => snap.key === "validation");
    if (validationKey.length > 0) {
      setOperation({
        validation: validationKey[0].val(),
        id: operation.id,
        operationId: operation.operationId,
        name: operation.name,
        type: operation.type,
        flowInstance: operation.flowInstance
      });
      return;
    }
    setOperation({});
  }, [snapshots, loadingNotifications]);
}

export function listenForCalendarEvents(
  setRanges,
  setLoadingOperations,
  userId,
  from
) {
  const [values, loading, error] = useObjectVal(
    firebase
      .database()
      .ref(`server/operationHub/calendar/${userId}/availabilities`)
      .orderByChild("from")
      .startAt(from)
  );
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase
      .database()
      .ref(`server/operationHub/calendar/${userId}/availabilities`)
      .orderByChild("from")
      .startAt(from)
  );
  useEffect(() => {
    setLoadingOperations(loading);
    setRanges(getEvents(values));
  }, [snapshots, loading]);
}

export function listenForDocuments(setDocuments, props) {
  const [values, loading, error] = useObjectVal(
    firebase
      .database()
      .ref(`server/legalDocuments/`)
      .orderByChild("owner")
      .equalTo(props.user.uid)
  );
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase
      .database()
      .ref(`server/legalDocuments/`)
      .orderByChild("owner")
      .equalTo(props.user.uid)
  );
  useEffect(() => {
    setDocuments(getOperations(values));
  }, [snapshots, loading]);
}

export function listenForMortgage(setMortgage, mortgageId, mortgageRequestId) {
  const [mortgageRequest, loading, error] = useObjectVal(
    firebase
      .database()
      .ref(
        `server/mortgages/${mortgageId}/mortgagesRequests/${mortgageRequestId}`
      )
  );
  const [snapshots, loadingNotifications, errorLoading] = useList(
    firebase
      .database()
      .ref(
        `server/mortgages/${mortgageId}/mortgagesRequests/${mortgageRequestId}`
      )
  );
  useEffect(() => {
    setMortgage(mortgageRequest);
  }, [snapshots, loading]);
}

export function listenForDocumentAttributes(setDocumentsAttributes, props) {
  const [attributes, attributesLoading, attributesErrors] = useObjectVal(
    firebase
      .database()
      .ref(`server/operationHub/${props.user.uid}/documentsAttributes`)
  );
  const [
    attributesSnapShots,
    loadingAttributesSnap,
    attributesErrorsSnap
  ] = useList(
    firebase
      .database()
      .ref(`server/operationHub/${props.user.uid}/documentsAttributes`)
  );
  useEffect(() => {
    console.log(attributesSnapShots);
    let snapAttributes = attributesSnapShots.map(att => {
      let newAtt = {}
      newAtt[att.key] = att.val()
      return newAtt
    })
    let newAttributes = {}

    snapAttributes.forEach(att => {newAttributes = {...newAttributes, ...att} })
    setDocumentsAttributes(newAttributes);
  }, [attributesSnapShots, attributesLoading]);
}

export function listenForBankAccount(setBankAccount, trustee, caseId) {
  if(!trustee){
    return
  }
  if(!caseId){
    return
  }
  const [attributes, attributesLoading, attributesErrors] = useObjectVal(
    firebase.database().ref(`server/cases/${trustee}/${caseId}/bankAccount`)
  );
  const [
    attributesSnapShots,
    loadingAttributesSnap,
    attributesErrorsSnap
  ] = useObject(
    firebase.database().ref(`server/cases/${trustee}/${caseId}/bankAccount`)
  );
  useEffect(() => {
    console.log(trustee);
    console.log(caseId);
    if(attributes){
      setBankAccount(attributes);
    }
  }, [attributesSnapShots, loadingAttributesSnap]);
}

export function listenForPendingOrder(
  setPendingOrder,
  project,
  pendingOrderId
) {
  const [attributes, attributesLoading, attributesErrors] = useObjectVal(
    firebase
      .database()
      .ref(`server/projects/pendingOrders/${project}/${pendingOrderId}`)
  );
  const [
    attributesSnapShots,
    loadingAttributesSnap,
    attributesErrorsSnap
  ] = useList(
    firebase
      .database()
      .ref(`server/projects/pendingOrders/${project}/${pendingOrderId}`)
  );
  useEffect(() => {
    setPendingOrder(attributes);
  }, [attributesSnapShots, loadingAttributesSnap]);
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

function getEvents(ranges) {
  if (!ranges || Object.keys(ranges).length === 0) {
    return [];
  }
  return Object.keys(ranges).map(key => {
    let range = ranges[key];
    range.key = key;
    return range;
  });
}
