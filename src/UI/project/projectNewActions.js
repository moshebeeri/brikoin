import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import InvestDialog from "../investDialog/newInvesting";
import { withProject } from "../warappers/withProject";
import {getProjectStatus, getOrder} from './projectUtils'
import LoginDialog from "../login/loginDiialog";
import Button from "@material-ui/core/Button";
import MortgageInvest from "../../UI/investDialog/mortgageInvest";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import LoadingCircular from "../../UI/loading/LoadingCircular";

function ProjectNewActions(props) {
  const { classes, project,  user } = props;
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [projectStatus, setProjectStatus] = useState({});
  const [userOrder, setUserOrder] = useState({});
  if(!loading){
     setLoading(true)
     getProjectStatus(project, setProjectStatus, setLoadingStatus)
     getOrder(project, setUserOrder, setLoadingOrder)
  }
  if(loadingStatus || loadingOrder){
    return (
        <Card className={classes.investCard}>
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
          <LoadingCircular open/>
          </div>
        </Card> 
        )
  }

  if(projectStatus === 'CLOSED'){
      return (
        <Card className={classes.investCard}>
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
              color:'green',
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
          <Typography align="center" variant="h6" color="inherit">
         
            {props.t("Project Sold")}
        </Typography>
             
          </div>
        </Card>
      )
  }

  if(projectStatus === 'REJECTED'){
    return (
      <Card className={classes.investCard}>
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            color:'red',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
        <Typography align="center" variant="h6" color="inherit">
       
          {props.t("Project Offers Rejected")}
      </Typography>
           
        </div>
      </Card>
    )
}

  if (userOrder && userOrder.active) {
    return (
      <Card className={classes.investCard}>
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {
            <Button
              variant="outlined"
              fullWidth
              className={classes.button}
              onClick={redirectForOperationHub.bind(this, props)}
            >
              {props.t("inProccess")}
            </Button>
          }
        </div>
      </Card>
    );
  }
  return (
    <Card className={classes.investCard}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {user ? (
          <InvestDialog
            location={props.location}
            history={props.history}
            project={project}
            t={props.t}
          />
        ) : (
          <LoginDialog
            history={props.history}
            t={props.t}
            className={classes.button}
            variant
            buttonString={
              project.tradeMethod === "auction"
                ? props.t("placeBid")
                : props.t("buy")
            }
            title={props.t("pleaseLoginMessage")}
          />
        )}
        <div>
          <MortgageInvest
            history={props.history}
            t={props.t}
            project={project}
          />
        </div>
      </div>
    </Card>
  );
}

function redirectForTermSheet(props) {
  props.history.push(`/groups/${props.project.address}`);
}

function redirectForOperationHub(props) {
    const {project} = props
    props.history.push(`/operationHub/${project.address}`);
}

const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};
const mapDispatchToProps = {};
export default  withProject(connect(mapStateToProps, mapDispatchToProps)(ProjectNewActions))
