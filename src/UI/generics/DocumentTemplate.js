import React, { useEffect, useReducer, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import GenericTextField from "./GenericTextField";
import GenericSelector from "./GenericSelector";
import GenericSignature from "./GenericSigniture";
import GenericForm from "./genericForm";
import numberUtils from "../../utils/numberUtils";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import dateUtils from "../../utils/dateUtils";
import JsPDF from "jspdf";
import html2canvas from "html2canvas";

function DocumentTemplate(props) {
  const { document, title, classes } = props;
  const [state, setState] = useState({});
  const [globalState, setGlobalState] = useState({});
  const [render, setRender] = useState(false);
  useEffect(() => {
    let newState = globalState;
    extend(newState, state);
    setGlobalState(newState);
    setRender(!render);
  }, [state]);
  const pages = splitDocument(document);
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
        {pages.map((page, index) =>
          createPage(page, title, props, globalState, setState, index, render)
        )}
      </div>
      <div
        style={{
          marginTop: 50,
          marginRight: 10,
          marginLeft: 10,
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
  let entity = { ...props.documentValues, ...state };
  let emptyAttributes = keys.filter(key => !entity[key] && key !== "form");
  return emptyAttributes.length === 0;
}

function createPage(document, title, props, state, setState, pageNum, render) {
  return (
    <div id={`doc${pageNum}`}>
      {title && pageNum === 1 && (
        <Typography align={"left"} variant="h5">
          {props.t(title)}
        </Typography>
      )}
      {document && (
        <div style={{ marginTop: 20 }}>
          {document.map(item => {
            return parseLine(item, props, state, setState, render);
          })}
        </div>
      )}
    </div>
  );
}

function splitDocument(document) {
  let pages = [];
  let pageIndex = 1;
  let numberOfLines = 0;
  document.split("\n").forEach(item => {
    numberOfLines = numberOfLines + 1;
    if (numberOfLines > 300) {
      pageIndex = pageIndex + 1;
      numberOfLines = 0;
    }
    if (!pages[pageIndex]) {
      pages[pageIndex] = [];
    }
    pages[pageIndex].push(item);
  });
  return pages;
}

function parseLine(line, props, state, setState, render) {
  const { documentDescriptor } = props;
  let keys = Object.keys(documentDescriptor).filter(key =>
    line.includes("@@" + key.toUpperCase() + "@@")
  );
  if (keys.length > 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end"
        }}
      >
        {renderObjects(keys, line, props, state, setState, render)}
      </div>
    );
  } else {
    return (
      <Typography align={"left"} variant="body2" gutterBottom>
        {line}
      </Typography>
    );
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
          required={true}
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
          required={true}
          setState={setState.bind(this)}
          t={props.t}
          fieldKey={key}
          fieldValue={documentValues[key]}
          textType={"number"}
        />
      </div>
    );
  }
  if (documentDescriptor[key].type === "form") {
    let entity = { ...props.documentValues, ...state };
    return (
      <GenericForm
        state={state}
        setState={setState}
        entity={entity}
        t={props.t}
        selectorValues={props.selectorValues}
        mandatoryFields={getMandatoryFields(props)}
        entityDescriptor={props.formDescriptor}
      />
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

function getMandatoryFields(props) {
  return Object.keys(props.documentDescriptor).filter(
    key => props.documentDescriptor[key].mandatory
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
      required={true}
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
  for (let i = 1; i < pages.length; i++) {
    if (i > 1) {
      pdf.addPage();
    }
    let text = await html2canvas(document.getElementById(`doc${i}`));
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
  props.saveDocumentAttributes(state);
}

export default withCusomeStyle(DocumentTemplate);
