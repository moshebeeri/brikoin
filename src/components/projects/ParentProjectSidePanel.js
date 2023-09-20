import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import withWidth from "@material-ui/core/withWidth";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import currencyUtils from "../../utils/currencyUtils";
import numberUtils from "../../utils/numberUtils";
import { getProjectMinInvest, getProjectSubProjects } from "./ProjectUtils";

function ParentProjectSidePanel(props) {
  if (!props.project) {
    return <div></div>;
  }
  if (props.project.type !== "parentProject") {
    return <div></div>;
  }
  let subProjects = props.subProjects[props.project.key]
  if(!subProjects){
    return <div></div>;
  }

  if(subProjects.length === 0){
    return <div></div>;
  }
  let investing = getProjectMinInvest(subProjects);
  return (
    <div style={{ width: 400 }}>
      <Card className={props.classes.investCard}>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              borderWidth: 5,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <Typography
              align={props.direction === "ltr" ? "left" : "right"}
              variant={"h6"}
              color="textSecondary"
            >
              {props.project.structure === 'Apartments' ? props.t("Minimum Price") :investing === 0
                ? props.t("Minimum Investment Units")
                : props.t("Minimum Investment")}
            </Typography>
            <Typography
              align={props.direction === "ltr" ? "left" : "right"}
              variant={"h6"}
              color="textSecondary"
            >
              {props.project.currency
                ? currencyUtils.currencyCodeToSymbol(props.project.currency)
                : "$"}{" "}
              {numberUtils.formatNumber(investing, 0)}
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  projectAsks: state.projectTradesStats.projectAsks,
  subProjects: state.projects.subProjectsById,
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {};
export default withWidth()(
  withCusomeStyle(
    connect(mapStateToProps, mapDispatchToProps)(ParentProjectSidePanel)
  )
);
