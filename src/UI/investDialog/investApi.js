import firebase from "firebase";

export function submitProjectOffer(
  amount,
  price,
  projectAddress,
  groupId,
  setLoading,
  setOpen
) {
  let submitOfferApi = firebase
    .functions()
    .httpsCallable("projectApi/sumbitOffer");
  try{
  submitOfferApi({
    project: projectAddress,
    groupId: groupId,
    investPrice: price,
    investAmount: amount
  }).then(result => {
    console.log(`done ${JSON.stringify(result)}`);
    if(setLoading){
      setLoading(false);
    }
    if(setOpen){
     setOpen(false);
    }
  });
}
catch(error){
  console.log(`ERROR  ${JSON.stringify(error)}`)

}
}



export function updateOffer(
  amount,
  price,
  projectAddress,
  groupId,
  setLoading,
  setOpen
) {
  let updateOfferApi = firebase
    .functions()
    .httpsCallable("projectApi/updateOffer");
  try{
    updateOfferApi({
    project: projectAddress,
    groupId: groupId,
    investPrice: price,
    investAmount: amount
  }).then(result => {
    console.log(`done ${JSON.stringify(result)}`);
    if(setLoading){
      setLoading(false);
    }
    if(setOpen){
     setOpen(false);
    }
  });
}
catch(error){
  console.log(`ERROR  ${JSON.stringify(error)}`)

}
}