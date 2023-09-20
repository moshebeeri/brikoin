import React, { useEffect, useReducer, useState } from "react";
import {
  listenForDocumentAttributes,
  listenForDocuments,
  listenForOperations
} from "./operationUtils";
import { getProject, getProjectName } from "../../UI/project/projectUtils";
import { withUser } from "../../UI/warappers/withUser";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import SignDocumentOperation from "./signDocumentOperation";
import SelectLawyerOperation from "./selectLawyerOperation"
import CheckDependencies from "./checkDependencies";
import ValidateSMSOperation from "./validateSmsOperation";
import TransferFundOperation from "./transferFundsOperation";
import AttachDocument from "./attachDocumentOperation";
import UploadSalesDocument from "./uploadSalesDocOperation";
import SubmitOfferOperation from './submitOfferOperation'
import SimpleNegotiation from './simpleNegotiation'
import NextOperation from './nextOperation'
import FilterListIcon from '@material-ui/icons/FilterList';
import MortgageRequest from "./mortgageRequest";
import OpenHoursTask from "./openHoursTask";
import OrderAppointmentTask from "./orderAppointmentTask";
import VideoCall from "./videoCall";
import { GenericList } from "../../UI/index";
import { connect } from "react-redux";
import PageLaoding from "../../UI/loading/pageLoading";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: '#ebedf0',
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const LIST_DESCRIPTOR = {
  relatedProject: {
    type: "redirectLink",
    width: 200,
    linkParam: "project",
    labelField: "relatedProject",
    redirectLink: `/projectsView/`
  },
  operationName: { type: "text", width: 150 },
  operationType: { type: "text", width: 220 },
  operationStatus: { type: "checkBox", width: 100 },
  actions: {
    type: "action",
    param: "user",
    width: 250,
    noTitle: true,
    actions: [
      "showDocument",
      "downloadDocument",
      "transferFunds",
      "showMortgageRequest",
      "videoCall",
      "attachDocument",
      "scheduleOpenHours",
      "orderAppointment",
      "validatePhone",
      "next",
      "submitOffer",
      "selectLawyer",
      "uploadLegalDocument",
      "negotiation"
    ],
    actionType: {
      downloadDocument: "href"
    }
  }
};

export function OperationHub(props) {
  const [operations, setOperations] = useState([]);
  const [showDocument, setShowDocument] = useState(false);
  const [showDependenciesMessage, setShowDependenciesMessage] = useState(false);
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [showSubmitOfferDialog, setSubmitOfferdDialog] = useState(false);
  const [showAttachDialog, setShowAttachDialog] = useState(false);
  const [showMortgageDialog, setShowMortgageDialog] = useState(false);
  const [showValidatePhoneDialog, setShowValidatePhoneDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showOpenHoursDialog, setOpenHoursDialog] = useState(false);
  const [showNextDialog, setshowNextDialog] = useState(false);
  const [showUploadLegalDialog, setshowUploadLegalDialog] = useState(false);
  const [showLawyerDialog, setshowLawyerDialog] = useState(false);
  const [showNegotiationialog, setshowNegotiationDialog] = useState(false);
  const [showOrderAppointmentDialog, setOrderAppointmentDialog] = useState(
    false
  );
  const [selectedOperation, setSelectedOperation] = useState(false);
  const [loadingOperations, setLoadingOperations] = useState(true);
  const [documentId, setDocumentId] = useState("");
  const [documents, setDocuments] = useState([]);
  const [dependencies, setDependencies] = useState("");
  const [documentsAttributes, setDocumentsAttributes] = useState([]);

  const [anchorEl, setEnchorEl] = useState("");
  const [filter, setFilter] = useState("");
  const [redirectFilter, setRedirectFilter] = useState(false);
  const projectAddress = props.location.pathname.substring(
    props.location.pathname.lastIndexOf("/") + 1
  )
  if(projectAddress && !redirectFilter &&  projectAddress != 'operationHub'){
    setRedirectFilter(true)
    setFilter(projectAddress)
  }
       
  listenForOperations(setOperations, setLoadingOperations, props);
  listenForDocuments(setDocuments, props);
  listenForDocumentAttributes(setDocumentsAttributes, props);
  if(loadingOperations){
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
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            justify="center"
            spacing={16}
          >
          <Grid key="20" item>
          <div style={{display:'flex', marginRight: 3, marginLeft:3 , flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
       
              <IconButton
              onClick={handleClick.bind(this, setEnchorEl)}
              className={props.classes.menuButton}
              color="default"
              aria-label="Menu"
            >
              <FilterListIcon  color="primary" />
            
          </IconButton>
          <div style={{display:'flex', marginRight: 3, marginLeft:3 , flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
       
          {filter && ` - ${getProjectName(
            getProject(props.projects, filter),
            props.lang
          )}` }
          {filter && 
            <div style={{display:'flex', marginRight: 3, marginLeft:3 , justifyContent:'center', alignItems:'center'}}>
            <IconButton
            onClick={setFilter.bind(this, '')}
            className={props.classes.menuButton}
            color="default"
            aria-label="Menu"
          >
            <HighlightOffIcon />
            </IconButton>
            </div>}
            </div>
            </div>
          {createFilter(props, anchorEl, setEnchorEl, operations, setFilter)}
          </Grid>
            <Grid key="1" item>
              <GenericList
                title={"System Operations"}
                t={props.t}
                columnDescription={LIST_DESCRIPTOR}
                rows={operationsRows(
                  props,
                  filter ? operations.filter(operattion => operattion.project === filter) : operations,
                  setShowDocument,
                  setDocumentId,
                  setSelectedOperation,
                  documents,
                  setDependencies,
                  setShowDependenciesMessage,
                  setShowFundDialog,
                  setShowMortgageDialog,
                  setShowVideoDialog,
                  setShowAttachDialog,
                  setOpenHoursDialog,
                  setOrderAppointmentDialog,
                  setShowValidatePhoneDialog,
                  setSubmitOfferdDialog,
                  setshowNextDialog,
                  setshowLawyerDialog,
                  setshowUploadLegalDialog,
                  setshowNegotiationDialog
                )}
              />
            </Grid>
          </Grid>
        </div>

      <SignDocumentOperation
        documentsAttributes={documentsAttributes}
        document={getDocument(documentId, documents)}
        operation={selectedOperation}
        t={props.t}
        history={props.history}
        location={props.location}
        close={setShowDocument.bind(this, false)}
        open={showDocument}
        documentId={documentId}
      />
      <CheckDependencies
        dependencies={dependencies}
        t={props.t}
        history={props.history}
        location={props.location}
        close={setShowDependenciesMessage.bind(this, false)}
        open={showDependenciesMessage}
      />

      {selectedOperation && showFundDialog && (
        <TransferFundOperation
          t={props.t}
          address={selectedOperation ? selectedOperation.project : ""}
          operation={selectedOperation}
          history={props.history}
          location={props.location}
          close={setShowFundDialog.bind(this, false)}
          open={showFundDialog}
        />
      )}

      {selectedOperation && showLawyerDialog && (
        <SelectLawyerOperation
          t={props.t}
          address={selectedOperation ? selectedOperation.project : ""}
          operation={selectedOperation}
          history={props.history}
          location={props.location}
          close={setshowLawyerDialog.bind(this, false)}
          open={showLawyerDialog}
        />
      )}
      {selectedOperation && showSubmitOfferDialog && (
        <SubmitOfferOperation
          t={props.t}
          address={selectedOperation ? selectedOperation.project : ""}
          project={
            selectedOperation
              ? getProject(props.projects, selectedOperation.project)
              : {}
          }
          operation={selectedOperation}
          history={props.history}
          location={props.location}
          close={setSubmitOfferdDialog.bind(this, false)}
          open={showSubmitOfferDialog}
        />
      )}

      {selectedOperation && showUploadLegalDialog && (
     <UploadSalesDocument
     t={props.t}
     operation={selectedOperation}
     history={props.history}
     location={props.location}
     close={setshowUploadLegalDialog.bind(this, false)}
     open={showUploadLegalDialog}
   />)}
   {selectedOperation && showNegotiationialog && (
    <SimpleNegotiation
    t={props.t}
    project={
      selectedOperation
        ? getProject(props.projects, selectedOperation.project)
        : {}
    }
    operation={selectedOperation}
    history={props.history}
    location={props.location}
    close={setshowNegotiationDialog.bind(this, false)}
    open={showNegotiationialog}
  />)}
   

      {selectedOperation && showNextDialog && (
        <NextOperation
          t={props.t}
         
          operation={selectedOperation}
          history={props.history}
          location={props.location}
          close={setshowNextDialog.bind(this, false)}
          open={showNextDialog}
        />
      )}
      

      
      
      <AttachDocument
        t={props.t}
        address={selectedOperation ? selectedOperation.project : ""}
        operation={selectedOperation}
        history={props.history}
        location={props.location}
        close={setShowAttachDialog.bind(this, false)}
        open={showAttachDialog}
      />
      <MortgageRequest
        t={props.t}
        project={
          selectedOperation
            ? getProject(props.projects, selectedOperation.project)
            : {}
        }
        operation={selectedOperation}
        history={props.history}
        location={props.location}
        close={setShowMortgageDialog.bind(this, false)}
        open={showMortgageDialog}
      />
      <VideoCall
        t={props.t}
        project={
          selectedOperation
            ? getProject(props.projects, selectedOperation.project)
            : {}
        }
        operation={selectedOperation}
        history={props.history}
        location={props.location}
        close={setShowVideoDialog.bind(this, false)}
        open={showVideoDialog}
      />

      <OpenHoursTask
        t={props.t}
        project={
          selectedOperation
            ? getProject(props.projects, selectedOperation.project)
            : {}
        }
        operation={selectedOperation}
        history={props.history}
        location={props.location}
        close={setOpenHoursDialog.bind(this, false)}
        open={showOpenHoursDialog}
      />
      <OrderAppointmentTask
        t={props.t}
        project={
          selectedOperation
            ? getProject(props.projects, selectedOperation.project)
            : {}
        }
        operation={selectedOperation}
        history={props.history}
        location={props.location}
        close={setOrderAppointmentDialog.bind(this, false)}
        open={showOrderAppointmentDialog}
      />
      <ValidateSMSOperation
        t={props.t}
        project={
          selectedOperation
            ? getProject(props.projects, selectedOperation.project)
            : {}
        }
        operation={selectedOperation}
        history={props.history}
        location={props.location}
        close={setShowValidatePhoneDialog.bind(this, false)}
        open={showValidatePhoneDialog}
      />
    </div>)
}

function handleClick(setEnchorEl, event) {
  setEnchorEl(event.currentTarget);
}

function operationsRows(
  props,
  operations,
  setShowDocument,
  setDocumentId,
  setSelectedOperation,
  documents,
  setDependencies,
  setShowDependenciesMessage,
  setShowFundDialog,
  setShowMortgageDialog,
  setShowVideoDialog,
  setShowAttachDialog,
  setOpenHoursDialog,
  setOrderAppointmentDialog,
  setShowValidatePhoneDialog,
  setSubmitOfferdDialog,
  setshowNextDialog,
  setshowLawyerDialog,
  setshowUploadLegalDialog,
  setshowNegotiationDialog
) {
  return operations.map(operation => {
    let document = getDocument(operation.document, documents);
    operation.relatedProject = operation.project
      ? getProjectName(
          getProject(props.projects, operation.project),
          props.lang
        )
      : "";
    operation.operationName = props.t(operation.name);
    operation.operationStatus = operation.status === "waiting" ? false : true;
    operation.operationType = props.t(operation.type);
    operation.hideActions = getRowAction(operation, documents);
    operation.showDocument = showCurrentDocument.bind(
      this,
      setShowDocument,
      setDocumentId,
      operation.document,
      operation,
      setSelectedOperation,
      props,
      setDependencies,
      setShowDependenciesMessage,
      operations
    );
    operation.downloadDocument = document ? document.signedDocument : "";
    operation.transferFunds = transferFunds.bind(
      this,
      props,
      operation,
      operations,
      setDependencies,
      setShowDependenciesMessage,
      setShowFundDialog,
      setSelectedOperation
    );
    operation.showMortgageRequest = showTaskDialog.bind(
      this,
      operation,
      setShowMortgageDialog,
      setSelectedOperation
    );
    operation.videoCall = showTaskDialog.bind(
      this,
      operation,
      setShowVideoDialog,
      setSelectedOperation
    );
    operation.attachDocument = showTaskDialog.bind(
      this,
      operation,
      setShowAttachDialog,
      setSelectedOperation
    );
    operation.scheduleOpenHours = showTaskDialog.bind(
      this,
      operation,
      setOpenHoursDialog,
      setSelectedOperation
    );
    operation.orderAppointment = showTaskDialog.bind(
      this,
      operation,
      setOrderAppointmentDialog,
      setSelectedOperation
    );
    operation.validatePhone = showTaskDialog.bind(
      this,
      operation,
      setShowValidatePhoneDialog,
      setSelectedOperation
    );
    operation.submitOffer = showTaskDialog.bind(
      this,
      operation,
      setSubmitOfferdDialog,
      setSelectedOperation
    );

    operation.next = showTaskDialog.bind(
      this,
      operation,
      setshowNextDialog,
      setSelectedOperation
    );

    operation.selectLawyer = showTaskDialog.bind(
      this,
      operation,
      setshowLawyerDialog,
      setSelectedOperation
    );

    operation.uploadLegalDocument = showTaskDialog.bind(
      this,
      operation,
      setshowUploadLegalDialog,
      setSelectedOperation
    );

    
    operation.negotiation = showTaskDialog.bind(
      this,
      operation,
      setshowNegotiationDialog,
      setSelectedOperation
    );

    

    

    
    return operation;
  });
}

function showTaskDialog(operation, setShowDialog, setSelectedOperation) {
  setSelectedOperation(operation);
  setShowDialog(true);
}

function transferFunds(
  props,
  operation,
  operations,
  setDependencies,
  setShowDependenciesMessage,
  setShowFundDialog,
  setSelectedOperation
) {
  if (
    !checkDependencies(
      props,
      operations,
      operation,
      setShowDependenciesMessage,
      setDependencies
    )
  ) {
    return;
  }
  setSelectedOperation(operation);
  setShowFundDialog(true);
}

function checkDependencies(
  props,
  operations,
  operation,
  setShowDependenciesMessage,
  setDependencies
) {
  if (operation.dependsOn) {
    let dependencies = parseDependencies(operation);
    let dependsOn = operations.filter(
      operation =>
        dependencies.includes(operation.id) && operation.status === "waiting"
    );
    if (dependsOn.length > 0) {
      setShowDependenciesMessage(true);
      setDependencies(
        dependsOn.map(dependsOnOperation =>
          getDependenciesMessage(props, dependsOnOperation)
        )
      );
      return false;
    }
  }
  return true;
}

function getDependenciesMessage(props, operation) {
  if (operation.type === "signDocument") {
    return props.t(operation.type) + " " + props.t(operation.name);
  }
  if (operation.name === "investment") {
    return props.t(operation.type);
  }
  return "";
}

function parseDependencies(operation) {
  if (operation.dependsOn.toString().includes(",")) {
    return operation.dependsOn.split(",");
  }
  return [operation.dependsOn.toString()];
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

function getRowAction(operation, documents) {
  if (operation.type === "videoOperation") {
    if (operation.status === "operationDone") {
      let document = getDocument(operation.document, documents);
      if (document.signedDocument) {
        return showAction(["downloadDocument"]);
      }
      return showAction(["attachDocument"]);
    }
    return showAction(["videoCall"]);
  }
  if (operation.type === "openHours") {
    // if (operation.status === 'operationDone') {
    //     return showAction([])
    // }
    return showAction(["scheduleOpenHours"]);
  }
  if (operation.type === "submitOffer") {
    // if (operation.status === 'operationDone') {
    //     return showAction([])
    // }
    return showAction(["submitOffer"]);
  }
  

  if (operation.type === "validateSmsOperation") {
    if (operation.status === "operationDone") {
      return showAction([]);
    }
    return showAction(["validatePhone"]);
  }
  if (operation.type === "orderAppointment") {
    // if (operation.status === 'operationDone') {
    //     return showAction([])
    // }
    return showAction(["orderAppointment"]);
  }
  if (operation.type === "mortgageRequest") {
    if (operation.status === "operationDone") {
      return showAction([]);
    }
    return showAction(["showMortgageRequest"]);
  }

  
  if (operation.type === "signDocument") {
    let document = getDocument(operation.document, documents);
    if (document.signedDocument) {
      return showAction(["downloadDocument"]);
    }
    return showAction(["showDocument"]);
  }
  if (operation.name === "investment") {
    let document = getDocument(operation.document, documents);
    if (document.signedDocument) {
      return showAction(["downloadDocument", "transferFunds"]);
    }
    return showAction(["transferFunds"]);
  }
  if(operation.type === "selectLawyer"){
    return showAction(["selectLawyer"]);
  }

  if(operation.type === "simpleNegotiation"){
    return showAction(["negotiation"]);
  }
  

  if(operation.name === "salePropertyDocument"){
    return showAction(["uploadLegalDocument"]);
  }

  
  return showAction(["next"]);
}

function showAction(actions) {
  return LIST_DESCRIPTOR.actions.actions.filter(
    action => !actions.includes(action)
  );
}

function showCurrentDocument(
  setShowDocument,
  setDocumentId,
  documentId,
  operation,
  setSelectedOperation,
  props,
  setDependencies,
  setShowDependenciesMessage,
  operations
) {
  if (
    !checkDependencies(
      props,
      operations,
      operation,
      setShowDependenciesMessage,
      setDependencies
    )
  ) {
    return;
  }
  setDocumentId(documentId);
  setSelectedOperation(operation);
  setShowDocument(true);
}

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

function createFilter(
  props,
  anchorEl,
  setEnchorEl,
  operations,
  setFilter
) {
  if(operations && operations.length > 0){
    let projectOperations = operations.filter(operation => operation.project)
    if(projectOperations.length > 0){
      projectOperations = projectOperations.map(operation => operation.project).filter(unique).map(project => {
        return projectOperations.filter(operation =>operation.project === project) [0]
      })
      return (
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose.bind(this, setEnchorEl)}
        >
        
          {projectOperations.map(operation => {
            let projectName = operation.project
            ? getProjectName(
                getProject(props.projects, operation.project),
                props.lang
              )
            : "";
           return  (<StyledMenuItem onClick={handleClose.bind(this, setEnchorEl, setFilter, operation.project)}>
            {projectName}}
          </StyledMenuItem>)
          })}
           
            </Menu>
        )
    }
  }
  return <div></div>
}



function handleClose(setEnchorEl, setFilter, filterValue) {
  setEnchorEl("");
  if(setFilter){
    setFilter(filterValue)
  }
}

const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(OperationHub)
);
