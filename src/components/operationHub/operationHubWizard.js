import React, { useEffect, useReducer, useState } from "react";
import {
  listenForDocumentAttributes,
  listenForDocuments,
  listenForOperations,
  getUserFlowWizards
} from "./operationUtils";
import { getProject, getProjectName } from "../../UI/project/projectUtils";
import { withUser } from "../../UI/warappers/withUser";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import SubmitOfferOperation from './submitOfferOperationForm'
import Typography from '@material-ui/core/Typography';
import NextOperation from './nextOperationForm'
import StepButton from '@material-ui/core/StepButton';
import UploadSalesDocument from './uploadSaleDocumentForm'
import SimpleAggrement from './simpleSignAggrement'
import TransferFundForm from './transferFundsForm'
import SelectLawyerForm from './selectLawyerForm'
import UserPhoneForm from "../../UI/user/UserPhoneForm";
import { connect } from "react-redux";
import PageLaoding from "../../UI/loading/pageLoading";

import ProjectNew from "../projects/ProjectNew";


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      marginTop: '5%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    completed: {
      display: 'inline-block',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }));
  
 
  
  function getStepContent(step, instances, props) {
   return props.t(instances[step].name)
  }



export function OperationHubV2(props) {
  const [operations, setOperations] = useState([]);
  const [loadingOperations, setLoadingOperations] = useState(true);
  const [instances, setWizardInstances] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [documents, setDocuments] = useState([]);
  const [documentsAttributes, setDocumentsAttributes] = useState([]);
  const [filter, setFilter] = useState("");
  const [init, setInit] = useState(false);

  const [redirectFilter, setRedirectFilter] = useState(false);
  const flowId = props.location.pathname.substring(
    props.location.pathname.lastIndexOf("/") + 1
  )
  
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  

  
  const completedSteps = () => {
    return Object.keys(completed).length;
  };


  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  if(flowId && !redirectFilter &&  flowId != 'operationHubV2'){
    if(!instances){
        setInstances(flowId, setWizardInstances, setProjectAddress)
    }
    setRedirectFilter(true)
    setFilter(projectAddress)
  }
       
  listenForOperations(setOperations, setLoadingOperations, props);
  listenForDocuments(setDocuments, props);
  listenForDocumentAttributes(setDocumentsAttributes, props);
  if(!instances){
    return <PageLaoding  />
  }

  if(!init && operations && operations.length > 0){
    setActiveStep(getCurrentStep(instances, operations))
    setInit(true)
  }

  return (
    <div dir={props.direction} style={{ marginTop: '5%',display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"}}>
    <Typography variant="h3" >{props.t('purchasePhases')}</Typography>
    <ProjectNew
    showFullDetails={goToProject.bind(this, props)}
    tory={props.history}
    viewOnly
    t={props.t}
    project={getProject(props.projects, projectAddress)}
  />
 
    <Stepper nonLinear activeStep={activeStep}>
      {instances.map((operation, index) => (
        <Step key={operation.operationId}>
          <StepButton style={{fontSize: 20}} onClick={handleStep(index)} completed={isStepCompleted(operations, index, instances)}>
            <div style={{ marginLeft: 5, marginRight: 10, fontSize: 14}}>{props.t(operation.name)} - {props.t(operation.type)}</div>
          </StepButton>
        </Step>
      ))}
    </Stepper>
    <div>
    
        <div dir={props.direction}>
          <Typography className={classes.instructions}>{getStepContent(activeStep, instances, props)}</Typography>
          {getOperationStep(props, operations, activeStep, instances, documents, setActiveStep)}
        
        </div>
    </div>
   
  </div>
);
}

function getCurrentStep(instances, operations){
    let activeStep = 0
    let operation =  getCurrentOperation(operations, activeStep, instances)
    if(!operation){
        return activeStep
    }
    while(operation.status !== 'waiting' || activeStep < instances.lenght){
        activeStep = activeStep + 1
        operation =  getCurrentOperation(operations, activeStep, instances)
        if(!operation){
            return activeStep
        }
    }
    return activeStep
  
}

function goToProject(props) {
    props.history.push(`/projectsView/${props.project.address}`);
  }
async function setInstances(flowId, setWizardInstances, setProjectAddress){
    let instance = await getUserFlowWizards(flowId)
    setWizardInstances(instance && instance.steps ? instance.steps : [])
    setProjectAddress(instance.project)
}

function isStepCompleted(operations, activeStep, instances){
   let operation =  getCurrentOperation(operations, activeStep, instances)
   if(!operation){
       return  false
   }

   if(operation.status === 'operationDone'){
       return true
   }

   return false

}
function getCurrentOperation(operations, activeStep, instances){
    let currentStep = instances[activeStep]
    if(currentStep && operations && operations.length > 0){
       let result =  operations.filter(operation => operation.operationId === currentStep.operationId )
        if(result && result.length > 0){
            return result[0]
        }
    }
 
    return ''
    

}
function getOperationStep(props, operations, activeStep, instances, documents, setActiveStep){
    let operation = getCurrentOperation(operations, activeStep, instances)
    if(!operation){
        return <div>{props.t('operationNotAvalibale')}</div>
    }
    switch (operation.type){
        case 'submitOffer':
          return  <SubmitOfferOperation
          t={props.t}
          address={operation ? operation.project : ""}
          operation={operation}
          history={props.history}
          location={props.location}
          project={getProject(props.projects, operation.project)}
          close={closeTask.bind(this,setActiveStep, activeStep, instances)}
          open={true}
        />
        case 'validateSmsOperation':
            return  <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <UserPhoneForm
              operation={operation}
              t={props.t}
              open={true}
              closeTask={closeTask.bind(this, setActiveStep, activeStep, instances)}
            />
          </div>
          case 'signDocument':
              switch (operation.name){
                case 'saleSimpleDealAgrement':
                    return <div style={{marginRight: 50, marginLeft: 50}}><SimpleAggrement
                    documentsAttributes={props.documentsAttributes}
                    close={closeTask.bind(this,setActiveStep,  activeStep, instances)}
                    operation={operation}
                    document={getDocument(operation.documentId, documents, instances)}
                    t={props.t}
                    hideClose={true}
                    history={props.history}
                  /></div>
            }
            case 'transferReserved':    
            case 'transferFirstPayment':
            case 'transferLastPayment':
                    return <div><TransferFundForm 
                    close={closeTask.bind(this,setActiveStep, activeStep, instances)}
                    operation={operation}
                    document={getDocument(operation.document, documents, instances)}
                    address={operation ? operation.project : ""}
                    t={props.t}
                    history={props.history}
                    /></div>
            case 'uploadDocument':
                return  <UploadSalesDocument
                t={props.t}
                operation={operation}
                document={getDocument(operation.document, documents, instances)}
                history={props.history}
                location={props.location}
                close={closeTask.bind(this,setActiveStep, activeStep, instances)}
                open={true}
              />
            case 'selectLawyer':
                return  <SelectLawyerForm
                t={props.t}
                address={operation ? operation.project : ""}
                operation={operation}
                history={props.history}
                location={props.location}
                close={closeTask.bind(this,setActiveStep, activeStep, instances)}
                open={true}
              />
            case 'aproveOperation':
            case 'dealTransaction':
            case 'validateTransfer':
                return  <NextOperation
                t={props.t}
               
                operation={operation}
                history={props.history}
                location={props.location}
                close={closeTask.bind(this,setActiveStep, activeStep,instances)}
                open={true}
              />
    defualt:
          return <div>{props.t('operationNotAvalibale')}</div>
    }
}

function closeTask(setActiveStep, activeStep, instances){
    if(activeStep + 1 < instances.length){
         setActiveStep(activeStep + 1)
    }
}

function getDocument(documentId, documents) {
    if (!documentId) {
      return "";
    }
    let filtered = documents.filter(
      document => document.id === documentId.toString()
    );
    if (filtered.length > 0) {
      return filtered[0];
    }
    return {};
  }

const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(OperationHubV2)
);
