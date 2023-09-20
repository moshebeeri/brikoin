import { connect } from "react-redux";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { ApproveDialog, GenericList } from "../../UI/index";
import React, { useState } from "react";
import {
  setLoadingProperties
} from "../../redux/actions/loadingProperty";
import {getLoadingProperties, deleteProject, duplicateProperty, projectReviewed, approveProject} from './propertyUtils'
import Button from "@material-ui/core/Button";
import PageLoading from "../../UI/loading/pageLoading";
import LoadingCircular from "../../UI/loading/LoadingCircular";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
const LIST_DESCRIPTOR = {
  projectName: {
    type: "redirectLink",
    width: 200,
    linkParam: "id",
    labelField: "projectName",
    noTitle: true,
    redirectLink: `/editPropertyLoader/`
  },
  reviewed: { type: "checkBox", width: 50 },
  approved: { type: "checkBox", width: 50 },
  comment: { type: "text", width: 200 },
  actions: {
    type: "action",
    param: "user",
    width: 400,
    noTitle: true,
    actions: ["deleteRow", "duplicateRow"]
  }
};

const LIST_DESCRIPTOR_ADMIN = {
  projectName: {
    type: "redirectLink",
    width: 200,
    linkParam: "id",
    labelField: "projectName",
    noTitle: true,
    redirectLink: `/editPropertyLoader/`
  },
  reviewed: { type: "checkBox", width: 50 },
  approved: { type: "checkBox", width: 50 },
  comment: { type: "text", width: 200 },
  actions: {
    type: "action",
    param: "user",
    width: 400,
    noTitle: true,
    actions: ["projectReviewed", "projectApproved", "deleteRow","duplicateRow"]
  }
};
function PropertyLoaderList(props) {
  const { classes, list, user } = props;
 
  const [loadingList, setListLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [listLoadeded, setListLoaded] = useState(false);
  const [approveDelete, setApproveDelete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [duplicate, setDuplictate] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const projectReviewedAction = showAction.bind(this,setSelectedProject, setReviewed);
  const projectApprovedAction = showAction.bind(this,setSelectedProject, setApproved);
  const addCommentAction = addComment.bind(this);
  const deleteRowAction = showAction.bind(this,setSelectedProject, setApproveDelete);
  const duplicateRowAction = duplicateRow.bind(this, props, setProcessing, setDuplictate);
  if(!listLoadeded && !loadingList){
    setListLoading(true)
    loadList(props, setListLoaded, setListLoading)
  }

  if(loadingList && list.length === 0){
    return <PageLoading />
  }
  let rows = list && list.length > 0 ? list.map(row => {
    row.projectReviewed = projectReviewedAction;
    row.projectApproved = projectApprovedAction;
    row.addComment = addCommentAction;
    row.deleteRow = deleteRowAction;
    row.duplicateRow = duplicateRowAction;
    row.hideActions = getRowActions(props, row);
    return row;
  }) : [];
  return (
    <div
      style={{
        marginTop: "7%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: props.width === "xs" ? 300 : 1020
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          className={classes.button}
          onClick={add.bind(this, props)}
        >
          {props.t("Add Property")}
        </Button>
      </div>
      {user && (
        <GenericList
          title={"Properties in Progress"}
          t={props.t}
          columnDescription={
            user.admin ? LIST_DESCRIPTOR_ADMIN : LIST_DESCRIPTOR
          }
          rows={rows}
        />
      )}

      {duplicate && createLoading(props, duplicate, setDuplictate )}

      <ApproveDialog
        t={props.t}
        cancelAction={closeDialog.bind(this, setApproveDelete)}
        openDialog={approveDelete}
        processDone={actionDone.bind(this)}
        process={processing}
        title={props.t("ApproveProjectDelete")}
        approveAction={deleteRowApproved.bind(this, props, setProcessing, setApproveDelete,selectedProject )}
        approveMessage={props.t("ApproveProjectDeleteMsg")}
      />

      <ApproveDialog
        t={props.t}
        cancelAction={closeDialog.bind(this, setReviewed)}
        openDialog={reviewed}
        processDone={actionDone.bind(this)}
        process={processing}
        title={props.t("Project Reviewed")}
        approveAction={reviewedProject.bind(this,  props, setProcessing, setReviewed, selectedProject)}
        approveMessage={props.t("ProjectReviewedMsg")}
      />

      <ApproveDialog
        t={props.t}
        cancelAction={closeDialog.bind(this, setApproved)}
        openDialog={approved}
        processDone={actionDone.bind(this)}
        process={processing}
        title={props.t("Project Approved")}
        approveAction={projectApproved.bind(this, props, setProcessing, setApproved, selectedProject)}
        approveMessage={props.t("ProjectApprovedMsg")}
      />
    </div>
  );
}

function createLoading(props, openDialog, setOpenDialog){
  return <Dialog
  open={openDialog}
  onClose={setOpenDialog.bind(this, false)}
  aria-labelledby="form-dialog-title"
>
  <DialogTitle id="form-dialog-title">
    {props.t("duplicateRow")}
  </DialogTitle>
 
      <div  style={{ width: 200, marginTop: 10 }}>
        <LoadingCircular open size={30} />
      </div>
    
</Dialog>
}

async function loadList(props, setListLoaded, setListLoading){
 let list = await  getLoadingProperties()
 props.setLoadingProperties(list)
 setListLoaded(true)
 setListLoading(false)
}


async function updateList(props){
  let list = await  getLoadingProperties()
  props.setLoadingProperties(list)
 }
 
function closeDialog(setShowDialog) {
  setShowDialog(false)
}

function showAction( setSelectedProject, setShowDialog, project){
  setSelectedProject(project)
  setShowDialog(true)
}

async function projectApproved(props, setProcessing, setShowDialog, selectedProject){
  setProcessing(true)
  console.log(selectedProject)
  await approveProject(selectedProject)
  await updateList(props)
  setProcessing(false)
  setShowDialog(false)
}

async function deleteRowApproved(props, setProcessing, setShowDialog, selectedProject){
  setProcessing(true)
  console.log(selectedProject)
  await deleteProject(selectedProject)
  await updateList(props)
  setProcessing(false)
  setShowDialog(false)
}


function addComment(){

}

async function duplicateRow( props, setProcessing, setDuplictate,project){
  console.log('what')
  setProcessing(true)
  setDuplictate(true)
  await duplicateProperty(project)
  await updateList(props)
  setDuplictate(false)
  setProcessing(false)
}

function getRowActions(props, row){
  if(!props.user.admin){
    return ["projectReviewed", "projectApproved"]
  }

  if(row.reviewed){
    if(row.approved){
      return ["projectReviewed", "projectApproved"]
    }
    return ["projectReviewed"]
  }
  return [ "projectApproved"]
}

async function reviewedProject(props, setProcessing, setShowDialog, selectedProject){
  setProcessing(true)
  console.log(selectedProject)
  await projectReviewed(selectedProject)
  await updateList(props)
  setProcessing(false)
  setShowDialog(false)
}
function add(props){
  props.history.push("/addPropertyLoader/");
}

function  actionDone(){

}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  list: state.loadingProperties.list
});
const mapDispatchToProps = {
  setLoadingProperties,
};

export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(PropertyLoaderList)
);
