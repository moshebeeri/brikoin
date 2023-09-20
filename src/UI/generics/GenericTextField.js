import React, { useEffect, useReducer, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { withCusomeStyle } from "../warappers/withCusomeStyle";

function GenericTextField(props) {
  const {
    fieldKey,
    fieldValue,
    classes,
    viewOnly,
    textType,
    noLabel,
    textArea,
    required,
    setState
  } = props;
  const [currentValue, setCurrentValue] = useState("");

  const defaultType = textType || "string";
  if (textArea) {
    return (
      <TextField
        id={fieldKey}
        label={noLabel ? "" : props.t(fieldKey)}
        className={
          props.width === "xs" ? classes.textAreaSmall : classes.textArea
        }
        value={currentValue ? currentValue : fieldValue}
        onChange={handleChange.bind(this, setCurrentValue, setState, fieldKey)}
        margin="normal"
        rowsMax="4"
        multiline
        required={required}
        type={defaultType}
        disabled={viewOnly}
        fullWidth
      />
    );
  }
  return (
    <div style={{ width: 200, flex: 1 }}>
      <TextField
        id={fieldKey}
        label={noLabel ? "" : props.t(fieldKey)}
        className={classes.textField}
        value={currentValue ? currentValue : fieldValue}
        onChange={handleChange.bind(this, setCurrentValue, setState, fieldKey)}
        margin="normal"
        rowsMax="4"
        required={required}
        multiline={textArea}
        // variant={textArea ? 'outlined' : ''}
        type={defaultType}
        disabled={viewOnly}
        fullWidth
      />
    </div>
  );
}

function handleChange(setCurrentValue, setState,fieldKey, event) {
  setCurrentValue(event.target.value);
  setState({ [fieldKey]: event.target.value });
}


export default withCusomeStyle(GenericTextField);
