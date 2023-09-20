import React, {
  useEffect,
  useReducer,
  useState,
  SuspenseList,
  Suspense
} from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ProjectInvest } from "../../UI/index";
import numberUtils from "../../utils/numberUtils";
import ProjectPreviewDetails from "./ProjectPreviewDetails";
import ParentProjectActions from "./ParentProjectActions";
import currencyUtils from "../../utils/currencyUtils";
import { NavLink } from "react-router-dom";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import Button from "@material-ui/core/Button";
import ReactImageAppear from 'react-image-appear';
import { getProjectMinInvest, getSubProjectsByid } from "./ProjectUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";
function ProjectNew(props) {
  const { classes, project, viewOnly, showFullDetails, direction ,subProjects} = props;
  const [showProject, setShowProject] = useState(false);
  if (!project) {
    return null;
  } else {
    
    let investing =
      project.type === "parentProject"
        ? getProjectMinInvest(subProjects ? subProjects : [])
        : 0;
    if(!viewOnly && !showProject){
      return <Card className={classes.projectCardEmpty}>
      <Suspense fallback={<LoadingCircular />}>
        <ProjectInvest
          history={props.history}
          t={props.t}
          initDoneFunction={initDone.bind(this,props.initDoneFunction,setShowProject)}
          project={project}
        />
      </Suspense>
      </Card>
    }
    return (
      <div style={{ minWidth: 300, maxWidth: 1140, marginTop: 16 }}>
        <Card className={classes.projectCard}>
         
          <Grid
            container
            direction="row"
            alignItems="stretch"
            alignContent="space-between"
            justify="space-between"
          >
         
            <Grid key="1" item>
              {projectThumbnail(props)}
            </Grid>
            <Grid key="2" item>
              <Suspense fallback={<LoadingCircular />}>
                <ProjectPreviewDetails project={project} t={props.t} />
              </Suspense>
            </Grid>
            {!viewOnly ? (
              <Grid key="3" item>
                <Suspense fallback={<LoadingCircular />}>
                  <ParentProjectActions
                    history={props.history}
                    t={props.t}
                    initDoneFunction={initDone.bind(this,props.initDoneFunction,setShowProject)}
                    project={project}
                  />
                 
                </Suspense>
                <div style={{ height: 10 }} />
                <Suspense fallback={<LoadingCircular />}>

                  <ProjectInvest
                    history={props.history}
                    t={props.t}
                    initDoneFunction={initDone.bind(this,props.initDoneFunction,setShowProject)}
                    project={project}
                  />
                </Suspense>
              </Grid>
            ) : (
              <Grid key="3" item>
                <div style={{ height: 10 }} />
                {project.type !== "parentProject" ? (
                  <div className={classes.projectControlPreview}>
                    <CardContent className={classes.projectContent}>
                      <Typography
                        align={direction === "ltr" ? "left" : "right"}
                        variant={"h6"}
                        color="textSecondary"
                      >
                        {project.structure === 'Apartment' ? props.t("price"): props.t("targetPrice")}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          color: "green",
                          fontSize: 24,
                          marginBottom: 2,
                          marginTop: 2
                        }}
                      >
                        <Typography
                          align={direction === "ltr" ? "left" : "right"}
                          variant={"h5"}
                        >
                          {project.currency
                            ? currencyUtils.currencyCodeToSymbol(
                                project.currency
                              )
                            : "$"}{" "}
                          {numberUtils.formatNumber(project.target, 0)}{" "}
                        </Typography>
                      </div>
                      <Button
                        onClick={showFullDetails}
                        fullWidth
                        variant="outlined"
                        className={classes.buttonRegular}
                      >
                        {props.t("readMore")}
                      </Button>
                    </CardContent>
                  </div>
                ) : (
                  <div className={classes.projectControlPreview}>
                    <CardContent className={classes.projectContent}>
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
                            align={direction === "ltr" ? "left" : "right"}
                            variant={"h6"}
                            color="textSecondary"
                          >
                            {project.structure !== 'Apartments' ? props.t("Minimum Investment") :  props.t("Minimum Price")}
                          </Typography>
                          <Typography
                            align={direction === "ltr" ? "left" : "right"}
                            variant={"h6"}
                            color="textSecondary"
                          >
                            {props.project.currency
                              ? currencyUtils.currencyCodeToSymbol(
                                  props.project.currency
                                )
                              : "$"}{" "}
                            {numberUtils.formatNumber(investing, 0)}

                            lallalal
                          </Typography>
                        </div>
                      </div>
                      <Button
                        onClick={showFullDetails}
                        fullWidth
                        variant="outlined"
                        className={classes.buttonRegular}
                      >
                        {props.t("readMore")}
                      </Button>
                    </CardContent>
                  </div>
                )}
              </Grid>
            )}
          </Grid>
        </Card>
      </div>
    );
  }
}

function initDone(initDoneFunction, setShowProject,status){
  setShowProject(status)
  if(initDoneFunction){
    initDoneFunction(status)
  }

}

async function getSubProjects(project, setSubProjects){
  let subProjects = await getSubProjectsByid(project.id)
  setSubProjects(subProjects)
}

function projectThumbnail(props) {
  const { classes, project } = props;
  const link = "/projectsView/" + project.address
  return project.property &&
    project.property.pictures &&
    project.property.pictures.length > 0 ? (
      <NavLink
      style={{
        textDecoration: "none",
        marginLeft: 10,
        color:'black',
        marginRight: 10,
        fontSize: 16
      }}
      
      to={link}
    >
    <div style={{width: 300}}>
    <ReactImageAppear 
                src= {Array.isArray(project.property.pictures[0])
                ? project.property.pictures[0][0]
                : project.property.pictures[0]}
                animationDuration="1s"
                showLoader={false}
                className={classes.projectCover}
            />  
            </div>
    </NavLink>
  ) : (
    <div />
  );
}
function LoadDone(){
  console.log('IMAGE LOADING DONE')

}

export default withCusomeStyle(ProjectNew);
