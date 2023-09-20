import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import withWidth from "@material-ui/core/withWidth";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import currencyUtils from "../../utils/currencyUtils";
import numberUtils from "../../utils/numberUtils";
import { getProjectMinInvest } from "./ProjectUtils";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import {getSubProjectsByid} from './ProjectUtils'
import {setSubProjects}from "../../redux/actions/projects"

function ParentProjectActions(props) {
  if (!props.project) {
    return <div></div>;
  }
  if (props.project.type !== "parentProject") {
    return <div></div>;
  }
  let projectId = props.project.id || props.project.key
  let subProjects = props.subProjects[projectId]
  if(!subProjects || (subProjects && subProjects.length === 0)){
    let id = props.project.key || props.project.id
    initSubProject(props, id)
  }
  let investing = subProjects && subProjects.length > 0 ? getProjectMinInvest(subProjects) : 0;
  return (
    <div className={props.classes.projectControl}>
      <CardContent className={props.classes.projectContent}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
        <Typography
          align={props.direction === "ltr" ? "left" : "right"}
          variant={props.small ? "subtitle1" : "h6"}
          color="textSecondary"
        >
          {props.t("pricingStartFrom")}
        </Typography>
        <Typography
          align={props.direction === "ltr" ? "left" : "right"}
          variant={props.small ? "subtitle1" : "h5"}
        >
          {props.project.currency
            ? currencyUtils.currencyCodeToSymbol(props.project.currency)
            : "$"}{" "}
          {numberUtils.formatNumber(investing, 0)}{" "}
        </Typography>
        <Button
          fullWidth
          onClick={redirectToProjectDetails.bind(this, props)}
          variant="outlined"
          className={props.classes.buttonRegular}
        >
          {props.t("readMore")}
        </Button>
        </div>
      </CardContent>
    </div>
  );
}

async function initSubProject(props, projectId){
   let subProjects =  await getSubProjectsByid(projectId)
   props.setSubProjects(projectId, subProjects)
}
function redirectToProjectDetails(props) {
  const { project } = props;
  props.history.push("/projectsView/" + project.address);
}
const mapStateToProps = (state, props) => ({
  user: state.login.user,
  projects: getAllProject(state, props),
  subProjects: state.projects.subProjectsById,
  lang: state.userProfileReducer.lang,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  setSubProjects

};
export default withWidth()(
  withCusomeStyle(
    connect(mapStateToProps, mapDispatchToProps)(ParentProjectActions)
  )
);
