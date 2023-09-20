
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { connect } from "react-redux";
import { trade, tradeExternalRequest } from "../../redux/actions/trade";
import Grid from "@material-ui/core/Grid";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import NotificationsFooter from "./footerNotifications";
import ProjectsLogs from "../projectsLog/projectsLogsFun";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";

var style = {
  backgroundColor: "black",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  display:'flex',
  alignItems:'space-betwean',
  justifyContent:'space-betwean',
  bottom: "0",
  flexDirection:'row',
  height: "60px",
  width: "100%",
}

var phantom = {
display: 'block',
padding: '20px',
height: '100px',
width: '100%',
}

function Footer(props) {
  return (
      <div>
          <div style={phantom} />
          <div style={style}>
         
          <div style={{width:'100%', display:'flex', alignItems:'center', flexDirection:'column' ,justifyContent:'center'}}>
          <div   style={{width: 200, display:'flex', alignItems:'flex-start', justifyContent:'flex-start'}}>
          <NavLink
          style={{
            textDecoration: "none",
            color: "white",
            fontSize: 12,
          }}
          to="/projects"
        >
          {props.t("projects")}
        </NavLink>
        </div>
        <div   style={{width: 200, display:'flex', alignItems:'flex-start', justifyContent:'flex-start'}}>
        
        <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    fontSize: 12,
                    color: "white"
                  }}
                >
                  {props.t("privatePolicy")}
                </div>
       
        </div>
        </div>
        <div
        style={{
          width: "100%",
          display: "flex",
          margin: 10,
          justifyContent: "flex-end",
          alignItems: "center",
          fontSize: 10,
          color: "white"
        }}
      >
        @copyright BriKoin LTD 2018 v1,.0
      </div>
          </div>
          <NotificationsFooter history={props.history} t={props.t} />
          <ProjectsLogs />
      </div>
  )
}

export default Footer