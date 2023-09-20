import React, { useEffect, useReducer, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import { GenericFormV2 } from "../../UI/index";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

function DynamicForm(props) {
  const { title, setState, classes, form, selectorValues, dynamicForm } = props;
  const [render, setRender] = useState(false);
  const [init, setInit] = useState(false);
  const [entity, setEntity] = useState({});
  const [forms, setForms] = useState([]);
  if (!init) {
    initForm(
      setInit,
      props.state,
      title,
      setForms,
      setEntity,
      entity,
      setState
    );
  }

  if (!dynamicForm) {
    return <div></div>;
  }

  return (
    <div
      dir={props.direction}
      style={{
        display: "flex",
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
          marginRight: 5,
          marginLeft: 5,
          maxWidth: props.width === "xs" ? 450 : 1140,
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "flex-start"
        }}
      >
        <Typography align={"left"} variant="h5">
          {props.t(title)}
        </Typography>
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          onClick={addForm.bind(
            this,
            forms,
            setForms,
            setRender,
            render,
            setEntity,
            entity
          )}
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
      </div>
      <div
        style={{
          marginTop: 50,
          marginRight: 10,
          marginLeft: 10,
          marginBottom: 20
        }}
      >
        {forms.map(key => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <GenericFormV2
              {...props}
              entity={entity[key]}
              save={false}
              state={entity[key]}
              setState={saveEntityDate.bind(
                this,
                entity,
                key,
                setEntity,
                setRender,
                render,
                selectorValues,
                setState,
                title
              )}
              t={props.t}
              dynamicForm={dynamicForm}
              selectorValues={selectorValues}
              title={""}
              entityDescriptor={getForm(form, entity[key])}
            />
            <div style={{ width: 40 }}>
              <IconButton
                aria-label="delete"
                onClick={deleteForm.bind(
                  this,
                  entity,
                  key,
                  setEntity,
                  setRender,
                  render,
                  setState,
                  title,
                  forms,
                  setForms
                )}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getForm(form, entity) {
  let newForm = JSON.parse(JSON.stringify(form));
  if (newForm && newForm.rules) {
    let rule = getRuleResult(form, entity);
    if (rule) {
      newForm[rule.field.key].type = rule.field.type;
      newForm[rule.field.key].path = rule.fieldSelectorName;
      return newForm;
    }
  }

  return form;
}

function getRuleResult(form, entity) {
  if (form && form.rules) {
    let rules = form.rules.conditions.filter(
      rule => entity[rule.condition.key] === rule.condition.value
    );
    if (rules.length > 0) {
      return rules[0].result;
    }
  }
  return "";
}

function saveEntityDate(
  entity,
  key,
  setEntity,
  setRender,
  render,
  selectorValues,
  setState,
  title,
  currentValue
) {
  if (!entity[key]) {
    entity[key] = {};
  }
  setRender(!render);
  let objectKey = Object.keys(currentValue)[0];
  entity[key][objectKey] = currentValue[objectKey];
  if (selectorValues[objectKey] && selectorValues[objectKey].length > 0) {
    let currentField = selectorValues[objectKey].filter(
      field => field.label === currentValue[objectKey]
    )[0];
    entity[key]["type"] = currentField.type;
  }
  setEntity(entity);
  setState({ [title]: entity });
}

function initForm(
  setInit,
  state,
  title,
  setForms,
  setEntity,
  entity,
  setState
) {
  setInit(true);
  if (state[title] && Object.keys(state[title]).length > 0) {
    setForms(Object.keys(state[title]));
    Object.keys(state[title]).forEach(key => {
      entity[key] = state[title][key];
    });
    setState({ [title]: entity });
    setEntity(entity);
  }
}

function deleteForm(
  entity,
  key,
  setEntity,
  setRender,
  render,
  setState,
  title,
  forms,
  setForms
) {
  entity[key] = {};
  setRender(!render);
  setEntity(entity);
  forms = forms.filter(formKey => formKey !== key);
  setForms(forms);
  setState({ [title]: entity });
}

function addForm(forms, setForms, setRender, render, setEntity, entity) {
  let key = new Date().getTime();
  forms.push(key);
  entity[key] = {};
  setEntity(entity);
  setForms(forms);
  setRender(!render);
}

export default withCusomeStyle(DynamicForm);
