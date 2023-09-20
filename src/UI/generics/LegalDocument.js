import React, { useEffect, useReducer, useState } from "react";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase";
import CollectionsBookmark from "@material-ui/icons/CollectionsBookmark";
import Close from "@material-ui/icons/Close";

export default function LegalDocument(props) {
  const [document, setDocument] = useState({});
  getDocument(setDocument, props.documentId);

  return (
    <a href={document ? document.signedDocument : ""} target="_blank">
      {!document ? (
        <Close color="secondary" />
      ) : !document.signedDocument ? (
        <Close color="secondary" />
      ) : props.icon ? (
        <CollectionsBookmark />
      ) : (
        document.signedDocument
      )}
    </a>
  );
}

function getDocument(setDocument, documentId) {
  const [values, loading, error] = useObjectVal(
    firebase.database().ref(`server/legalDocuments/${documentId}`)
  );
  useEffect(() => {
    setDocument(values);
  }, [loading]);
}
