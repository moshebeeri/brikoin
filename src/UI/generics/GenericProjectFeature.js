import React, { useEffect, useReducer, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Done from "@material-ui/icons/Done";
import Close from "@material-ui/icons/Close";
import numberUtils from "../../utils/numberUtils";
import currencyUtils from "../../utils/currencyUtils";
import { connect } from "react-redux";

function ProjectFeature(props) {
  const { featureKey, value } = props;
  if (!featureKey) {
    return <div />;
  }
  if (!value) {
    return <div />;
  }
  if (typeof value === "boolean") {
    return (
      <Grid key={featureKey} item>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            margin: 10
          }}
        >
          <div>{props.t(featureKey)}</div>
          <div style={{ fontWeight: "bold", color: "black" }}>
            {value ? <Done color="primary" /> : <Close color="secondary" />}
          </div>
        </div>
      </Grid>
    );
  }
  if (value.value) {
    return (
      <Grid key={featureKey} item>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            margin: 10
          }}
        >
          <div>{props.t(featureKey)}</div>
          {renderByType(value.type, value.value, props)}
        </div>
      </Grid>
    );
  }
  return (
    <Grid key={featureKey} item>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          margin: 10
        }}
      >
        <div>{props.t(featureKey)}</div>
        <div style={{ fontWeight: "bold", color: "black" }}>
          {props.t(value)}
        </div>
      </div>
    </Grid>
  );
}

function renderByType(type, value, props) {
  const { project } = props;
  switch (type) {
    case "number":
      return (
        <div style={{ fontWeight: "bold", color: "black" }}>
          {numberUtils.formatNumber(value, 0)}
        </div>
      );
    case "percent":
      return (
        <div style={{ fontWeight: "bold", color: "black" }}>
          {numberUtils.formatNumber(value, 1)}%
        </div>
      );
    case "currency":
      return props.direction === "ltr" ? (
        <div
          style={{
            fontWeight: "bold",
            color: "black"
          }}
        >
          {" "}
          {numberUtils.formatNumber(value, 0)}{" "}
          {currencyUtils.currencyCodeToSymbol(project.currency)}
        </div>
      ) : (
        <div
          style={{
            fontWeight: "bold",
            color: "black"
          }}
        >
          {" "}
          {currencyUtils.currencyCodeToSymbol(project.currency)}{" "}
          {numberUtils.formatNumber(value, 0)}{" "}
        </div>
      );
    case "currencyPrecise":
      return props.direction === "ltr" ? (
        <div
          style={{
            fontWeight: "bold",
            color: "black"
          }}
        >
          {" "}
          {numberUtils.formatNumber(value, 2)}{" "}
          {currencyUtils.currencyCodeToSymbol(project.currency)}
        </div>
      ) : (
        <div
          style={{
            fontWeight: "bold",
            color: "black"
          }}
        >
          {" "}
          {currencyUtils.currencyCodeToSymbol(project.currency)}{" "}
          {numberUtils.formatNumber(value, 2)}{" "}
        </div>
      );
    case "list":
      return (
        <div style={{ fontWeight: "bold", color: "black" }}>
          {renderList(value, props)}
        </div>
      );
    default:
      return (
        <div style={{ fontWeight: "bold", color: "black" }}>
          {props.t(value)}
        </div>
      );
  }
}

function renderList(jsonList, props) {
  let listValues = Object.keys(jsonList).map(key => props.t(jsonList[key]));
  let result = "";
  listValues.forEach(value => {
    result = result.concat(value).concat(", ");
  });
  return result.substr(0, result.length - 2);
}

const mapStateToProps = state => {
  return {
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ProjectFeature);
