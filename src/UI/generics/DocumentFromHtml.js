import React, { useEffect, useReducer, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import GenericSignature from "./GenericSigniture";
import numberUtils from "../../utils/numberUtils";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import dateUtils from "../../utils/dateUtils";

String.prototype.replaceAt=function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


const onlyOneSignitureHtml = `<div align="@@ALIGNDIRECTION@@" dir="@@DIRECTION@@">
<table class="MsoNormalTable" dir="rtl" style="border-collapse: collapse;" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr style="height: 58.8px;">
<td style="width: 141.55pt; border: none; padding: 0in 5.4pt; height: 58.8px;" valign="top" width="189">
<p class="a4" dir="RTL" style="margin: 0in; margin-bottom: .0001pt; text-align: center;" align="center">&nbsp;</p>
<p class="a4" dir="RTL" style="margin: 0in 0in 0.0001pt; text-align: right;" align="center"><strong><span lang="HE"><img src=@@SIGNITURE@@ alt="" width="175" height="52" /></span></strong></p>
</td>
<td style="width: 141.55pt; padding: 0in 5.4pt; height: 58.8px;" valign="top" width="189">&nbsp;</td>
<td style="width: 141.55pt; border: none; padding: 0in 5.4pt; height: 58.8px;" valign="top" width="189">
<p>&nbsp;</p>
</td>
</tr>
<tr style="height: 18px;">
<td style="width: 141.55pt; border-right: none; border-bottom: none; border-left: none; border-image: initial; border-top: 1pt solid windowtext; padding: 0in 5.4pt; height: 18px;" valign="top" width="189">
<p class="a4" dir="RTL" style="margin: 0in; margin-bottom: .0001pt; text-align: center;" align="center"><strong><span lang="HE" style="font-family: 'David',sans-serif;">@@SIDE@@</span></strong></p>
</td>
<td style="width: 141.55pt; padding: 0in 5.4pt; height: 18px;" valign="top" width="189">
<p class="a4" dir="RTL" style="margin: 0in; margin-bottom: .0001pt; text-align: center;" align="center"><strong><span lang="HE" style="font-family: 'David',sans-serif;">&nbsp;</span></strong></p>
</td>
<td style="width: 141.55pt; border-right: none; border-bottom: none; border-left: none; border-image: initial; windowtext; padding: 0in 5.4pt; height: 18px;" valign="top" width="189"><br />
<p class="a4" dir="RTL" style="margin: 0in; margin-bottom: .0001pt; text-align: center;" align="center">&nbsp;</p>
</td>
</tr>
</tbody>
</table>
</div>
`


function SimpleSignitureDocument(props) {
  const { signatureTitle, classes, pages, legalDocument, hideClose} = props;
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
          {createPage(pages[0], props, globalState, setState, render, signatureTitle)}
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
            onClick={printDocument.bind(this, props, globalState)}
          >
            {props.t("Send Document")}
          </Button>
        ) : (hideClose ? <div></div> :
          <Button
            fullWidth
            variant="outlined"
            className={classes.button}
            onClick={saveDocument.bind(this, props, globalState)}
          >
            {props.t("Close")}
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
 
  return state['signature'];
}

function createPage(document, props, state, setState, render, signatureTitle) {
  return (
    <div>
      
    <div dir="rtl" >
    <div   id={'documentHtml'} dir="rtl" dangerouslySetInnerHTML={{ __html: document }} />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }}
    >
    
     {!props.operationDone && <div
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
      </div>}
   
      <div style={{ marginTop: 5, height: 20 }}></div>
      {!props.operationDone &&  <div style={{width: 360,  display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"}}>
      <Typography variant="h5" gutterBottom>
      {signatureTitle ? props.t(signatureTitle) : props.t('BUYER')}
    </Typography>
      
    </div>}
    </div>
  </div>
    </div>
  );
}


function replaceKeyValues(document, keys, documentDescriptor, documentValues) {
  let result = document;
  keys.forEach(key => {
    result = result.replace(
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

function getComponentStyle(fieldKey, fieldValue, props, state) {
  const { classes, documentValues } = props;
  if (documentValues[fieldKey]) {
    return classes.componentBoxValue;
  }
  return state.mandatoryError && !state[fieldKey] && !fieldValue
    ? classes.componentBoxError
    : classes.componentBox;
}


async function printDocument(props, state) {
  const { documentSignedAction, fileName, sendDocumentAction, signatureTitle } = props;
  sendDocumentAction();
  let pageHTML = document.getElementById('documentHtml').innerHTML;
  let signatureHtml = signitureToHtml(props, state, signatureTitle)
  pageHTML = pageHTML + signatureHtml
  console.log(pageHTML)
  let file = new Blob([pageHTML], {type: 'data:attachment/html,'});
  file.name = fileName || "document1.pdf";
  file.lastModifiedDate = new Date();
  documentSignedAction(file, state);
  return file;
}

function signitureToHtml(props, state, signatureTitle){
    let values = {
      'SIGNITURE':`"${state.signature}"`,
      "SIDE": props.t(signatureTitle),
      "ALIGNDIRECTION": props.direction === 'rtl' ? 'right' : 'left',
      "DIRECTION":props.direction === 'rtl' ? 'rtl' : 'ltr'
    }
    return replaceKeyValues(onlyOneSignitureHtml,['SIGNITURE',"SIDE","ALIGNDIRECTION",  "DIRECTION"], {'ALIGNDIRECTION': {type: 'default'},'DIRECTION': {type: 'default'}, 'SIGNITURE': {type: 'default'},  'SIDE':{type:'default'}}, values)
}
async function saveDocument(props, state) {
  props.saveDocumentAttributes(state);
}

export default withCusomeStyle(SimpleSignitureDocument);
