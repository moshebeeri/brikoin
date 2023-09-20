import firebase from "firebase";


export function sendOffer(operation, amount){
    return new Promise((resolve, reject) => {
     
      let negotaionApi = firebase
        .functions()
        .httpsCallable("negotiationApi/sendOffer");
    
        negotaionApi(
          {
            operation: operation,
            amount: amount,
          }
          ).then(result => {
          resolve('done')
    
        console.log(`done ${JSON.stringify(result)}`);
      }).catch((error) => {
        resolve('error')
    
        console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
      });;
    })
  }




export function rejectOffer(operation, offerId){
  return new Promise((resolve, reject) => {
   
    let negotaionApi = firebase
      .functions()
      .httpsCallable("negotiationApi/rejectOffer");
  
      negotaionApi({
        operation: operation,
        offerId: offerId,
      }).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}



export function approveOffer(operation, offerId){
  return new Promise((resolve, reject) => {
   
    let negotaionApi = firebase
      .functions()
      .httpsCallable("negotiationApi/approveOffer");
  
      negotaionApi({
        operation: operation,
        offerId: offerId,
      }).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}




export function counterOffer(operation, amount){
  return new Promise((resolve, reject) => {
   
    let negotaionApi = firebase
      .functions()
      .httpsCallable("negotiationApi/counterOffer");
  
      negotaionApi({
        operation: operation,
        amount: amount,
      }).then(result => {
        resolve('done')
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}



export function getOffers(operation){
  return new Promise((resolve, reject) => {
   
    let negotaionApi = firebase
      .functions()
      .httpsCallable("negotiationApi/getOffers");
  
      negotaionApi(operation).then(result => {
        resolve(result.data)
  
      console.log(`done ${JSON.stringify(result)}`);
    }).catch((error) => {
      resolve('error')
  
      console.log(`ERROR FETCHING ${JSON.stringify(error)}`)
    });;
  })
}

