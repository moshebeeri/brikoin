import React, { useEffect, useReducer, useState } from "react";
import { GenericFormV2 } from "../../UI/index";
import { useObjectVal } from "react-firebase-hooks/database";
import firebase from "firebase";

function FormGen(props) {
  const { setState, entity, entityPath, buttonTitle, save } = props;
  const [entityDescriptor, setEntityDescriptor] = useState({});
  const [selectorValues, setSelectorValues] = useState({});
  const [dynamicForms, setDynamicForms] = useState({});
  listenToForm(setDynamicForms, "propertyLoader");
  listenToForm(setEntityDescriptor, entityPath);
  listenToSelecterValues(setSelectorValues, "selectors");
  if (!dynamicForms) {
    return <div></div>;
  }
  if (!selectorValues) {
    return <div></div>;
  }
  if (!entityDescriptor) {
    return <div></div>;
  }
  return (
    <GenericFormV2
      {...props}
      entity={entity}
      save={save}
      state={entity}
      setState={setState}
      t={props.t}
      listenToForm={listenToForm}
      buttonTitle={buttonTitle}
      dynamicForm={dynamicForms ? dynamicForms : {}}
      selectorValues={selectorValues ? selectorValues : {}}
      entityDescriptor={entityDescriptor ? entityDescriptor : {}}
    />
  );
}

function listenToForm(setEntityDescriptor, entityPath) {
  const [values, loading, error] = useObjectVal(
    firebase.database().ref(`server/Forms/${entityPath}`)
  );
  useEffect(() => {
    setEntityDescriptor(values);
  }, [loading]);
}

function listenToSelecterValues(setSelectorValues, entityPath) {
  const [values, loading, error] = useObjectVal(
    firebase.database().ref(`server/Forms/${entityPath}`)
  );
  useEffect(() => {
    if (values) {
      setSelectorValues(setSelectors(values));
    }
    setSelectorValues(values);
  }, [loading]);
}

function setSelectors(values) {
  let selectors = {};
  Object.keys(values).forEach(key => {
    selectors[key] = Object.keys(values[key]).map(
      innerKey => values[key][innerKey]
    );
  });

  return selectors;
}

export default FormGen;
