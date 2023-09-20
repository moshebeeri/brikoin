import React, { useEffect, useReducer, useState } from "react";
import {
  getUserFlowsWizard
} from "./operationUtils";
import { getProject, getProjectName } from "../../UI/project/projectUtils";
import { withUser } from "../../UI/warappers/withUser";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import Typography from '@material-ui/core/Typography';
import { GenericList } from "../../UI/index";
import { connect } from "react-redux";
import PageLaoding from "../../UI/loading/pageLoading";
import Grid from "@material-ui/core/Grid";



const LIST_DESCRIPTOR = {
  relatedProject: {
    type: "redirectLink",
    width: 200,
    linkParam: "project",
    labelField: "relatedProject",
    redirectLink: `/projectsView/`
  },
  currentStep: {
    type: "redirectLink",
    width: 200,
    linkParam: "flowId",
    labelField: "stepName",
    redirectLink: `/operationHubV2/`
  },
  dealPrice: { type: "number", width: 100 },
  buyer: { type: "user", width: 100 },
  seller: { type: "user", width: 100 },
  lawyerBuyer: { type: "user", width: 100 },
  lawyerSeller: { type: "user", width: 100 }

};

export function OperationHubList(props) {
  
  const [loadingInstances, setLoadingInstances] = useState(true);
  const [init, setInit] = useState(false);
  const [instances, setInstances] = useState([]);
  if(!init && instances.length === 0){
    initInstances(setInit, setInstances, setLoadingInstances)
  }
  
       
  if(loadingInstances){
    return <PageLaoding  />
  }
  return ( <div
      style={{
        display: "flex",
        minHeight: 500,
        marginTop: "3%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
    
        <div
          style={{
            display: "flex",
            margin: 5,
            maxWidth: 1140,
            flexDirection: "column"
          }}
        >

        <Typography variant="h3" >{props.t('Open Deals')}</Typography>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            justify="center"
            spacing={16}
          >
          <Grid key="20" item>
          
          </Grid>
            <Grid key="1" item>
              <GenericList
                title={"System Operations"}
                t={props.t}
                columnDescription={LIST_DESCRIPTOR}
                rows={instances && instances.length > 0 ? instances.map(instance => createRow(instance, props)) : []}
              />
            </Grid>
          </Grid>
        </div>

    </div>)
}
function createRow(instance, props){
  instance.relatedProject = instance.project
      ? getProjectName(
          getProject(props.projects, instance.project),
          props.lang
        )
      : "";
  instance.dealPrice = instance.order ? instance.order.amount : ''
  instance.stepName = getCurrentStep(props, instance.steps)
  return instance

}

function getCurrentStep(props, steps){
  let processSteps = steps.filter(step => step.status === 'PROCESS')
  if(processSteps.length > 0){
    return props.t(processSteps[0].name)
  }

  let newSteps = steps.filter(step => step.status === 'new')
  if(newSteps.length > 0){
    return props.t(newSteps[0].name)
  }

  return props.t('completed')

}
async function initInstances(setInit, setInstances, setLoadingInstances){
  setInit(true)
  let instances = await getUserFlowsWizard()
  setLoadingInstances(false)
  setInstances(instances)

}


const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(OperationHubList)
);
