import React, { useEffect, useReducer, useState } from "react";
import {
    useList,
    useObject,
    useObjectVal
  } from "react-firebase-hooks/database";
import numberUtils from "../../utils/numberUtils";
import firebase from "firebase";

export default function userBalance(props) {
    const [ledger, setLeger] = useState([]);
    listenForLedger(setLeger, props)
    return <div
      style={{
        color:props.fontColor,
        marginLeft: 10,
        marginRight: 10,
        flex: "display",
        flexDirection: "colummn"
      }}
    >
      <div style={{ marginTop: 20 }}>{props.t("balance")}</div>
      <div>{numberUtils.formatNumber(calcSum(ledger), 2)}</div>
    </div>
}


function calcSum(ledger) {
    if (ledger && ledger.length > 0) {
      const reducer = (accumulator, currentValue) =>
        accumulator + currentValue;
      return (
        ledger
          .map(transaction =>
            transaction.isAdd
              ? parseInt(transaction.amount)
              : parseInt(transaction.amount) * -1
          )
          .reduce(reducer) / 1000000
      );
    }
    return 0;
  }

function listenForLedger(setLedger, props) {
    const [values, loading, error] = useObjectVal(
      firebase
        .database()
        .ref(`server/users/${props.user.uid}/ledger`)
    );
    const [snapshots, loadingNotifications, errorLoading] = useList(
      firebase.database().ref(`server/users/${props.user.uid}/ledger`)
    );
    useEffect(() => {
      setLedger(getLdegers(values));
    }, [snapshots, loading]);
  }
  

  function getLdegers(ledgers) {
    if (!ledgers || Object.keys(ledgers).length === 0) {
      return [];
    }
    return Object.keys(ledgers)
      .map(key => {
        let ldeger = ledgers[key];
        ldeger.id = key;
        return ldeger;
      })

  }