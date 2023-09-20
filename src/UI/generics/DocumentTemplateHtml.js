import React, { useEffect, useReducer, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import GenericTextField from "./GenericTextField";
import GenericSelector from "./GenericSelector";
import GenericSignature from "./GenericSigniture";
import numberUtils from "../../utils/numberUtils";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import dateUtils from "../../utils/dateUtils";
import JsPDF from "jspdf";
import html2canvas from "html2canvas";

function DocumentTemplate(props) {
  const { document, title, classes, pages } = props;
  const [state, setState] = useState({});
  const [globalState, setGlobalState] = useState({});
  const [render, setRender] = useState(false);
  useEffect(() => {
    let newState = globalState;
    extend(newState, state);
    setGlobalState(newState);
    setRender(!render);
  }, [state]);
  // const pages = splitDocument(document)
  return (
    <div
    
      dir={props.direction}
      style={{
        display: "flex",
        marginTop: 30,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <div
       id={'documentHtml'}
        dir={props.direction}
        style={{
          display: "flex",
          borderWidth: 1,
          marginTop: 10,
          marginRight: 5,
          marginLeft: 5,
          maxWidth: props.width === "xs" ? 450 : 1140,
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        {props.pages.map((page, index) =>
          createPage(page, title, props, globalState, setState, index, render)
        )}
      </div>
      <div
        style={{
          width: "100%",
          marginTop: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20
        }}
      >
        {checkAttributes(globalState, props) ? (
          <Button
            fullWidth
            variant="outlined"
            className={classes.button}
            onClick={printDocument.bind(this, props, globalState, pages)}
          >
            {props.t("Send Document")}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            className={classes.button}
            onClick={saveDocument.bind(this, props, globalState, pages)}
          >
            {props.t("Save Document")}
          </Button>
        )}
      </div>
    </div>
  );
}

function extend(obj, src) {
  Object.keys(src).forEach(function(key) {
    obj[key] = src[key];
  });
  return obj;
}

function checkAttributes(state, props) {
  let keys = Object.keys(props.documentDescriptor);
  let emptyAttributes = keys.filter(
    key => !state[key] && !props.documentValues[key]
  );
  return emptyAttributes.length === 0;
}

function createPage(document, title, props, state, setState, pageNum, render) {
  return (
    <div id={`doc${pageNum}`}>
      {pageNum === 0
        ? pageWithForm(
            document,
            props.documentDescriptor,
            props,
            state,
            setState,
            render
          )
        : replaceValues(
            document,
            props.documentDescriptor,
            props,
            state,
            setState,
            render
          )}
    </div>
  );
}

function replaceValues(
  document,
  documentDescriptor,
  props,
  state,
  setState,
  render
) {
  let keys = Object.keys(documentDescriptor).filter(
    key =>
      document.includes("@@" + key.toUpperCase() + "@@") &&
      documentDescriptor[key].fixed
  );
  document = replaceKeyValues(
    document,
    keys,
    documentDescriptor,
    props.documentValues
  );
  if (document.includes("@@SIGNATURE@@")) {

    
    document = document.replace("@@SIGNATURE@@", "");
    return (
      <div dir="rtl" >
        <div dir="rtl" dangerouslySetInnerHTML={{ __html: document }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            key={"signature"}
            className={getComponentStyle("signature", "", props, state)}
          >
            <GenericSignature
              t={props.t}
              render={render}
              state={state}
              setState={setState.bind(this)}
              fieldKey={"signature"}
              fieldValue={""}
            />
          </div>
          <div style={{ marginTop: 10, height: 80 }}></div>
        </div>
      </div>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: document }} />;
}

function pageWithForm(
  document,
  documentDescriptor,
  props,
  state,
  setState,
  render
) {
  let keys = Object.keys(documentDescriptor).filter(
    key =>
      document.includes("@@" + key.toUpperCase() + "@@") &&
      documentDescriptor[key].fixed
  );
  let formKeys = Object.keys(documentDescriptor).filter(
    key => !documentDescriptor[key].fixed && key !== "signature"
  );
  document = replaceKeyValues(
    document,
    keys,
    documentDescriptor,
    props.documentValues
  );
  let page = document.split("FORM");
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div dir='rtl' dangerouslySetInnerHTML={{ __html: page[0] }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {formKeys &&
          formKeys.length > 0 &&
          formKeys.map(key => (
            <div style={{ marginTop: 15, marginBottom: 15 }}>
              {renderObject(key, props, state, setState, render)}
            </div>
          ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: page[1] }} />
    </div>
  );
}

function replaceKeyValues(document, keys, documentDescriptor, documentValues) {
  let result = document;
  keys.forEach(key => {
    result = document.replace(
      "@@" + key.toUpperCase() + "@@",
      getValue(key, documentValues, documentDescriptor[key])
    );
  });
  return result;
}

function getValue(key, documentValues, descriptor) {
  switch (descriptor.type) {
    case "number":
      return numberUtils.formatNumber(documentValues[key], 0);
    case "date":
      return dateUtils.dateFormater(documentValues[key]);
    default:
      return documentValues[key];
  }
}

function renderObject(key, props, state, setState, render) {
  const { documentDescriptor, documentValues, noFieldLabels } = props;
  if (documentValues[key] && documentDescriptor[key].fixed) {
    if (documentDescriptor[key].type === "text") {
      return (
        <div key={key} className={getComponentStyle(key, "", props, state)}>
          {documentValues[key]}
        </div>
      );
    }
    if (documentDescriptor[key].type === "number") {
      return (
        <div key={key} className={getComponentStyle(key, "", props, state)}>
          {numberUtils.formatNumber(documentValues[key], 0)}
        </div>
      );
    }
    if (documentDescriptor[key].type === "date") {
      return (
        <div key={key} className={getComponentStyle(key, "", props, state)}>
          {dateUtils.dateFormater(documentValues[key])}
        </div>
      );
    }
    if (documentDescriptor[key].type === "image") {
      return (
        <div key={key} className={getComponentStyle(key, "", props, state)}>
          <img width={"280px"} height={"30px"} src={documentValues[key]} />
        </div>
      );
    }
  }
  if (documentDescriptor[key].type === "signature") {
    return (
      <div key={key} className={getComponentStyle(key, "", props, state)}>
        <GenericSignature
          t={props.t}
          render={render}
          state={state}
          setState={setState.bind(this)}
          fieldKey={key}
          fieldValue={""}
        />
      </div>
    );
  }
  if (documentDescriptor[key].type === "date") {
    return (
      <div key={key} className={getComponentStyle(key, "", props, state)}>
        <GenericTextField
          render={render}
          noLabel={noFieldLabels}
          state={state}
          setState={setState.bind(this)}
          t={props.t}
          fieldKey={key}
          fieldValue={documentValues[key]}
          textType={"date"}
        />
      </div>
    );
  }
  if (documentDescriptor[key].type === "number") {
    return (
      <div key={key} className={getComponentStyle(key, "", props, state)}>
        <GenericTextField
          render={render}
          noLabel={noFieldLabels}
          state={state}
          setState={setState.bind(this)}
          t={props.t}
          fieldKey={key}
          fieldValue={documentValues[key]}
          textType={"number"}
        />
      </div>
    );
  }
  if (documentDescriptor[key].type === "selector") {
    return (
      <div key={key} className={getComponentStyle(key, "", props, state)}>
        {createSelector(
          key,
          documentValues[key],
          props,
          state,
          setState,
          render
        )}
      </div>
    );
  }
  return (
    <div key={key} className={getComponentStyle(key, "", props, state)}>
      {renderTextField(
        key,
        documentValues[key],
        false,
        props,
        state,
        setState,
        render
      )}
    </div>
  );
}

function getComponentStyle(fieldKey, fieldValue, props, state) {
  const { classes, documentValues } = props;
  if (documentValues[fieldKey]) {
    return classes.componentBoxValue;
  }
  return state.mandatoryError && !state[fieldKey] && !fieldValue
    ? classes.componentBoxError
    : classes.componentBox;
}

function renderTextField(
  fieldKey,
  fieldValue,
  viewOnly,
  props,
  state,
  setState,
  render
) {
  const { noFieldLabels } = props;
  return (
    <GenericTextField
      render={render}
      noLabel={noFieldLabels}
      state={state}
      setState={setState.bind(this)}
      t={props.t}
      fieldKey={fieldKey}
      fieldValue={fieldValue}
      viewOnly={viewOnly}
    />
  );
}

function createSelector(fieldKey, fieldValue, props, state, setState, render) {
  const { viewOnly, selectorValues, noFieldLabels } = props;
  return (
    <GenericSelector
      t={props.t}
      minWidth={300}
      state={state}
      render={render}
      noLabel={noFieldLabels}
      setState={setState.bind(this)}
      fieldKey={fieldKey}
      fieldValue={fieldValue}
      viewOnly={viewOnly}
      selectorValues={selectorValues}
    />
  );
}

function renderObjects(keys, line, props, state, setState, render) {
  let lineObjects = [];
  let sortedKeys = sortKeys(keys, line);
  let parsedLine = line;
  sortedKeys.forEach(key => {
    let splitLine = parsedLine.split("@@" + key.toUpperCase() + "@@");
    lineObjects.push(
      <Typography align={"left"} variant="body2" gutterBottom>
        {splitLine[0]}
      </Typography>
    );
    lineObjects.push(renderObject(key, props, state, setState, render));
    parsedLine = "";
    for (let i = 1; i < splitLine.length; i++) {
      parsedLine = parsedLine + " " + splitLine[i];
    }
  });
  return lineObjects;
}

function sortKeys(keys, line) {
  return keys;
}

async function printDocument(props, state, pages) {
  const { documentSignedAction, fileName, sendDocumentAction } = props;
  sendDocumentAction();
  const pdf = new JsPDF();
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }
    let text = await html2canvas(document.getElementById(`doc${i}`));
    let pageHTML = document.getElementById('documentHtml').innerHTML;
    const imgData = text.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(
      imgData,
      "PNG",
      5,
      5,
      pdfWidth - 10,
      pdfHeight * 1.4,
      "",
      "MEDIUM"
    );
  }
  let file = pdf.output("blob");
  file.name = fileName || "document1.pdf";
  file.lastModifiedDate = new Date();
  // pdf.save(fileName || 'document1.pdf')
  documentSignedAction(file, state);
  return file;
}

async function saveDocument(props, state, pages) {
  let pageHTML = document.getElementById('documentHtml').innerHTML;
  props.saveDocumentAttributes(state);
}

export default withCusomeStyle(DocumentTemplate);
