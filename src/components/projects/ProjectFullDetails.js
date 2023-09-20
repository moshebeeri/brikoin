/* eslint-disable key-spacing */
import React, { useEffect, useReducer, useState } from "react";
import MapComponent from "./GoogleMap";
import Grid from "@material-ui/core/Grid";
import Gallery from "react-grid-gallery";
import { connect } from "react-redux";
import SubProjectList from "./SubProjectsList";
import ParentProjectMap from "./ParentProjectMap";
import ProjectDocuments from "../../UI/project/projecDocuments";
import ProjectSidePanel from "../../UI/project/projectSidePanel";
import ProjectPreviewDetails from "./ProjectPreviewDetails";
import ProjectTeam from "../../UI/user/ProjectTeam";
import ProjectViewScheduling from "../../UI/project/scheduler";
import ParentProjectSidePanel from "./ParentProjectSidePanel";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {getProjectByAddress, listenForProject, getSubProjectsByid} from './ProjectUtils'
import PageLaoding from "../../UI/loading/pageLoading";
import {setProject, setSubProjects}from "../../redux/actions/projects"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#004466" }
  },
  typography: { useNextVariants: true }
});

function mapLoadedEvent(onMapleaded){
  onMapleaded(true)
  console.log('MAP LOADED')
}

function ProjectFullDetails(props) {
  const { lang , dataIsLoading} = props;
  const [tab, setTab] = useState(0);
  const [mapLoaded, onMapleaded] = useState(false);
  const [loading , setLoading] = useState(false);
  const [projectUpdated , setProjectUpdated] = useState(false);
  const [project , setProject] = useState('');
  const [show, showSceen] = useState(false);
  listenForProject(setProjectUpdated)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  useEffect(() => {
   if(projectUpdated){
    setProjectUpdated(false)
    updateProject(props,setProject)
    setProjectUpdated(false)
   }
  }, [projectUpdated]);
  useEffect(() => {
      setTimeout(() => {
        showSceen(true);
      }, 5000);
  }, [mapLoaded]);
  const projectAddress = props.location.pathname.substring(props.location.pathname.lastIndexOf("/") + 1)
  if(project && project.address !== '0' && projectAddress !== project.address){
    setProject('')
  }
  if(!project){
    if(props.project){
      setProject(props.project)
      setLoading(false)
    }else{
      initProject(props, setProject, setLoading, loading)
    }
  }
  if(loading || !project){
    return <PageLaoding />
  }

  
  let component = getMainComponent(project, lang, props, mapLoadedEvent, tab, setTab, onMapleaded)

  return  <div>
  {!show && <div style={{position: 'relative', width:'100%', height: 10000}}>
  <PageLaoding />
  </div>}
 
  {component}
  </div>
}

function getMainComponent(project, lang, props, mapLoadedEvent, tab, setTab, onMapleaded){
  return (
    <div style={{ width: "100%"  }}>
      {projectPictures(project, lang, props, mapLoadedEvent.bind(this,onMapleaded))}
      {project.youTube && (
        <iframe
          width="560" 
          height="315"
          src={`https://www.youtube.com/embed/${project.youTube}`}
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      )}
      <div
        style={{
          width: "100%",
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start"
        }}
      >
        {projectMainPanel(project, lang, props, tab, setTab)}
      </div>
      <div
        style={{
          width: "100%",
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start"
        }}
      >
        <ParentProjectMap
          project={project}
          history={props.history}
          t={props.t}
        />
      </div>
      <div
        style={{
          width: "100%",
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start"
        }}
      >
        <SubProjectList
          {...props}
          project={project}
          history={props.history}
          t={props.t}
        />
      </div>
    </div>
  );
}
function projectPictures(project, lang, props, onMapleaded) {
  const direction = props.width === "xs" ? "column" : "row";
  const width = props.width === "xs" ? "100%" : "65%";
  const small = props.width !== "xs";
  const lat = project.location ? project.location.lat : 40.738286;
  const lng = project.location ? project.location.lng : -74.243855;
  const style =
    props.width === "xs"
      ? {
          alignItems: "center",
          marginTop: 45,
          display: "flex",
          flexDirection: direction
        }
      : { marginTop: 45, display: "flex", flexDirection: direction };
  return (
    <div style={style}>
      <div style={{ width: width }}>
        <Gallery
          rowHeight={200}
          maxRows={2}
          images={project.property.pictures
            .map((picture, index) => {
              return {
                src: Array.isArray(picture) ? picture[0] : picture,
                thumbnail: Array.isArray(picture) ? picture[0] : picture,
                thumbnailWidth: 16 + index,
                thumbnailHeight: 9
              };
            })
            .filter(pic => pic)}
        />
      </div>
      <MapComponent onMapLoad={onMapleaded} lat={lat} lng={lng} small={small} lang={lang} />
    </div>
  );
}

function projectMainPanel(project, lang, props, tab, setTab) {
  const { classes } = props;
  const projectDocumentStyle =
    props.width === "xs"
      ? {
          flexDirection: "column",
          width: 450,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      : {};
  return (
    <div
      style={{
        maxWidth: 1140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Grid container direction="row">
        <Grid xs={props.width === "xs" ? 0 : 8} key="99_fullDetails" item>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              justify="flex-start"
            >
              <Grid key="1_fullDetails" item>
                <div>
                  <ProjectPreviewDetails
                    showSecondery
                    project={project}
                    lang={lang}
                    t={props.t}
                  />
                </div>
              </Grid>
              <Grid key="2_fullDetails" item>
                <ProjectViewScheduling project={project} t={props.t} />
              </Grid>
              <Grid key="3_fullDetails" item>
                {(project.type !== "parentProject" || project.structure ==='Apartments') && (
                  <div style={projectDocumentStyle}>
                    <div
                      className={
                        props.width === "xs"
                          ? classes.tabBackgroundSmall
                          : classes.tabBackground
                      }
                    >
                      <MuiThemeProvider theme={theme}>
                        <Tabs
                          value={tab}
                          onChange={handleChangeTab.bind(this, setTab)}
                          // indicatorColor='#004466'
                          // textColor='primary'
                          indicatorColor="primary"
                          textColor="secondary"
                          variant="fullWidth"
                        >
                          <Tab
                            classes={{
                              root: classes.tabRoot,
                              selected: classes.tabSelected
                            }}
                            label={props.t("Documents")}
                          />
                          <Tab
                            classes={{
                              root: classes.tabRoot,
                              selected: classes.tabSelected
                            }}
                            label={props.t("Team")}
                          />
                        </Tabs>
                      </MuiThemeProvider>
                    </div>
                    {tab === 0 && (
                      <div
                        style={{
                          width: props.width === "xs" ? 450 : 650,
                          minHeight: 400
                        }}
                      >
                        <ProjectDocuments
                          project={project}
                          history={props.history}
                          location={props.location}
                          t={props.t}
                        />
                      </div>
                    )}
                    {tab === 1 && (
                      <div
                        style={{
                          width: props.width === "xs" ? 450 : 650,
                          minHeight: 400
                        }}
                      >
                        <ProjectTeam project={project} t={props.t} />
                      </div>
                    )}
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid xs={props.width === "xs" ? 12 : 4} key="5_fullDetails" item>
          {!props.preview && (
            <ProjectSidePanel
              location={props.location}
              history={props.history}
              project={project}
              t={props.t}
            />
          )}
          <ParentProjectSidePanel
            {...props}
            location={props.location}
            history={props.history}
            project={project}
            t={props.t}
          />
        </Grid>
      </Grid>
    </div>
  );
}

function handleChangeTab(setTab, event, value) {
  setTab(value);
}

async function initProject(props, setProject, setLoading, loading){
  if(!loading){
    setLoading(true)
  
    const projectAddress = props.location.pathname.substring(props.location.pathname.lastIndexOf("/") + 1)
    if(props.projects[projectAddress]){
      setProject(props.projects[projectAddress])
      setLoading(false)
    }

    let project = await getProjectByAddress(projectAddress)
    props.setProject(projectAddress, project)
    if(project.type === 'parentProject'){
      let subProjects = await getSubProjectsByid(project.id)
      props.setSubProjects(project.key, subProjects)
    }
    setProject(project)
    setLoading(false)
  }
  
}

async function updateProject(props, setProject){
    const projectAddress = props.location.pathname.substring(props.location.pathname.lastIndexOf("/") + 1)
    let project = await getProjectByAddress(projectAddress)
    props.setProject(projectAddress, project)
    if(project.type === 'parentProject'){
      let subProjects = await getSubProjectsByid(project.id)
      props.setSubProjects(project.key, subProjects)
    }
    setProject(project)
}


const mapStateToProps = (state, props) => ({
  lang: state.userProfileReducer.lang,
  user: state.login.user,
  projects: state.projects.projectByAddress,
  subProjects: state.projects.subProjectsById,

});
const mapDispatchToProps = {
  setSubProjects, setProject
};

export default 
withCusomeStyle(connect(mapStateToProps, mapDispatchToProps)(ProjectFullDetails));
