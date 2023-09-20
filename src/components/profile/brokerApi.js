
import firebase from "firebase";


export function generateBrokerLink(setLink, setLoadLink) {
 setLoadLink(true)
  let operationDoneApi = firebase
    .functions()
    .httpsCallable("brokerApi/generateBrokerLink");

    operationDoneApi().then(result => {
    console.log(`done ${JSON.stringify(result)}`);
    setLoadLink(false)
    setLink(result.data.link)
  });
}

