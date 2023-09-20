import React, { useEffect, useReducer, useState } from "react";
import ProjectRecommendation from "../../UI/project/ProjectRecommendation";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { withRouter } from "react-router-dom";
import ProjectCarusel from "./projectCarusel"
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import GenericTextField from "../../UI/generics/GenericTextField";
import ApproveDialog from "../../UI/messageBox/ApproveDialog";
import Grid from "@material-ui/core/Grid";
import { filterProjects } from "../../redux/actions/userProfile";
import withWidth from "@material-ui/core/withWidth";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import  homeBackground from "../../assets/brikoinHome.jpeg";

let sliderManner = {
  autoSliding: { interval: "5s" },
  duration: "2s"
};

function loadingImageDone(setLoadingImage) {
  setLoadingImage(false);
}

function Home(props) {
  const {  direction, projects, cookies } = props;
  window.scrollTo(0, 0);
  const [state, setState] = useState({});
  const [render, setRender] = useState(false);
  const [openStackPrice, setOpenStackPrice] = useState(false);
  const [automatedMortgage, setAutomatedMortgage] = useState(false);
  const [openBetter, setOpenBetter] = useState(false);
  const [globalState, setGlobalState] = useState({});
  useEffect(() => {
    let newState = globalState;
    extend(newState, state);
    setGlobalState(newState);
    setRender(!render);
    
  }, [state]);
 
  const brokerToken = props.location.pathname.substring( props.location.pathname.lastIndexOf("/") + 1)
  if(brokerToken){
    let brokerCookie = cookies.get("brokerToken");
        if (!brokerCookie || brokerCookie !== brokerToken) {
          cookies.set("brokerToken", brokerToken,{
            path: "/",
            expires: new Date(new Date().getTime() + 432000000)
          });
        }
      }
  if (projects && projects.length > 0) {
    const recommendedProjectsBatch = projects.map((project, index) => (
      <div style={{display:'flex', flexDirection:'row'}}>
     
      {index > 0 ? 
        <ProjectRecommendation
        project={projects[index - 1]}
        history={props.history}
        t={props.t}
      /> : <div></div>
      }
      <div style={{marginLeft: 50, marginRight: 50}}>
      <ProjectRecommendation
        project={project}
        history={props.history}
        t={props.t}
      />
      </div>
      
      {index + 1 <  projects.length ? 
        <div style={{ marginRight: 50}}>
        <ProjectRecommendation
        project={projects[index + 1]}
        history={props.history}
        t={props.t}
      /> </div>: <div></div>
      }


      {index === 0 &&  index + 2 < projects.length ? 
        <ProjectRecommendation
        project={projects[index + 2]}
        history={props.history}
        t={props.t}
      /> : <div></div>
      }
      {index + 1 === projects.length &&  projects.length - 2 >= 0? 
        <div style={{ marginRight: 50}}>
        <ProjectRecommendation
        project={projects[0]}
        history={props.history}
        t={props.t}
      /> </div>: <div></div>
      }
      </div>
    ));
    return (
      <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          minHeight: 500,
          flex: 1,
          backgroundImage:`url(${homeBackground})`,
        }}
      >
        <Grid
          container
          style={{
            dispay: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginRight: direction ==='rtl' ? props.width === "xs" ? 30: 240 : 0,
            marginLeft: direction ==='ltr' ?  props.width === "xs" ? 30 : 240 : 0,
            maxWidth: 700,
            minWidth: 300,
            marginTop: 100,
          }}
        >
          <Grid item key="1">
            <div   style={{
              dispay: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            
              justifyContent: "flex-start"}}>
            <div style={{display: 'flex', color:'white', marginBottom: 10  ,  alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "flex-start"}}>
            <h1>{props.t("BriKoin Easy")}</h1>
            </div> 
            <div style={{display: 'flex',  color:'white', marginBottom: 10  , alignItems: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'flex-start'}}>
            <h2>{props.t("Secured By")}</h2>
            </div> 
            <div style={{display: 'flex', color:'white', marginBottom: 5  , alignItems: "flex-start",
            flexDirection: "row",justifyContent: "flex-start"}}>
            <h3>{props.t("Find Projects")}</h3>
            </div> 
            </div>
          </Grid>
          <div style={{ width: direction ==='ltr' ? 20 : 10 }}></div>
          <Grid item key="2">
            <div
            dir={direction}
              style={{
                maxWidth: 300,
                minWidth: 300,
                marginBottom: 5,
                display: "flex",
                backgroundColor:'white',
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GenericTextField
                render={render}
                direction={direction}
                state={globalState}
                textArea={false}
                setState={setState.bind(this)}
                t={props.t}
                noLabel
                fieldKey={"searchText"}
                fieldValue={globalState.searchText}
                viewOnly={false}
              />
           
              <IconButton aria-label="delete"   onClick={redirectToProject.bind(this, props, globalState)}>
          <SearchIcon fontSize="small" />
        </IconButton>
          
          </div>
          </Grid>
        
        </Grid>
     

        <ApproveDialog
          t={props.t}
          cancelAction={setAutomatedMortgage.bind(this, false)}
          processDone={setAutomatedMortgage.bind(this, false)}
          process={false}
          hideAction
          direction={direction}
          paragraph
          processNow={false}
          openDialog={automatedMortgage}
          title={props.t("AutomatedMortgageHomePageTitle")}
          approveMessage={props.t("AutomatedMortgageHomePage")}
        />

        <ApproveDialog
          t={props.t}
          cancelAction={setOpenStackPrice.bind(this, false)}
          processDone={setOpenStackPrice.bind(this, false)}
          process={false}
          hideAction
          direction={direction}
          paragraph
          processNow={false}
          openDialog={openStackPrice}
          title={props.t("StockPriceRealEstateTitle")}
          approveMessage={props.t("StockPriceRealEstate")}
        />

        <ApproveDialog
          t={props.t}
          cancelAction={setOpenBetter.bind(this, false)}
          processDone={setOpenBetter.bind(this, false)}
          process={false}
          hideAction
          direction={direction}
          paragraph
          processNow={false}
          openDialog={openBetter}
          title={props.t("BetterTitle")}
          approveMessage={props.t("Better")}
        />
      </div>
       <div style={{backgroundColor:'white', marginTop: 20}}>
      <h3>{props.t("Recommended Projects")}</h3>
    
      <div style={{display: 'flex', width: '100%', alignItems:'center','justifyContent':'center'}}>
      <ProjectCarusel projects ={recommendedProjectsBatch} />
      </div>
      </div>
      
        
      </div>
    );
  }
  return (
    <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
      <LoadingCircular open />
    </div>
  );
}


function extend(obj, src) {
  Object.keys(src).forEach(function(key) {
    obj[key] = src[key];
  });
  return obj;
}

function redirectToProject(props, state) {
  props.filterProjects(state.investType, state.searchText);
  props.history.push("/projects");
}

const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  user: state.login.user,
  lang: state.userProfileReducer.lang,
  direction: state.userProfileReducer.direction,
  init: state.trades.init,
  loaded: state.projectTradesStats.loaded,
});
const mapDispatchToProps = {
  filterProjects,
  
};

export default withRouter(
  withWidth()(connect(mapStateToProps, mapDispatchToProps)(Home))
);
