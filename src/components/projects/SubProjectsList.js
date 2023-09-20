import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import ProjectNew from "./ProjectNew";
import { getAllProject } from "../../redux/selectors/projectsSelector";
import withWidth from "@material-ui/core/withWidth";
import ProjectFullDetails from "../projects/ProjectFullDetails";
import Popover from "@material-ui/core/Popover";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from '@material-ui/icons/FilterList';
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
function SubProjectList(props) {
  const [visibleProject, setVisibleProject] = useState({});
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [anchorEl, setEnchorEl] = useState("");
  if (!props.project) {
    return <div></div>;
  }
  if (props.project.type !== "parentProject") {
    return <div></div>;
  }

  
  let subProjects = props.subProjects[props.project.key]
  if(!subProjects){
    return <div></div>;
  }

  if(subProjects.length === 0){
    return <div></div>;
  }

  const projectList = subProjects.map((project, index) => (
    <ProjectNew
      showFullDetails={setOpenAsPopover.bind(
        this,
        setOpen,
        setVisibleProject,
        project,
        setRender,
        render
      )}
      viewOnly={props.viewOnly}
      key={index + "-project"}
      history={props.history}
      lang={props.lang}
      t={props.t}
      user={props.user}
      project={project}
    />
  ));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        marginTop: props.width === "xs" ? "6%" : "3%",
        backgroundColor: "white"
      }}
    >
    <div style={{display:'flex', width: '80%', marginRight: 3, marginLeft:3 , flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start'}}>
       
    <IconButton
    onClick={handleClick.bind(this, setEnchorEl)}
    className={props.classes.menuButton}
    color="default"
    aria-label="Menu"
  >
    <FilterListIcon  color="primary" />
  
</IconButton>
<div style={{display:'flex', marginRight: 3, marginLeft:3 , flexDirection:'row', justifyContent:'center', alignItems:'center'}}>

{filter && ` - ${filter}` }
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
    {createFilter(props, anchorEl, setEnchorEl, subProjects, setFilter)}
      {projectList}
      <Popover
        id="render-props-popover"
        open={open}
        // anchorEl={anchorEl}
        onClose={setOpen.bind(this, false)}
        anchorOrigin={{
          // vertical: 'bottom',
          horizontal: "center"
        }}
        transformOrigin={{
          // vertical: 'top',
          horizontal: "center"
        }}
      >
        <div
          dir={props.direction}
          style={{
            width: props.width === "xs" ? 300 : 1400,
            height: "90%",
            marginBottom: 50
          }}
        >
     
          <ProjectFullDetails
            render={render}
            preview
            projectName={visibleProject.name}
            projectDescription={visibleProject.description}
            history={props.history}
            lang={props.lang}
            t={props.t}
            user={props.user}
            viewOnly
            project={visibleProject}
          />
        </div>
      </Popover>
    </div>
  );
}
const unique = (value, index, self) => {
  return self.indexOf(value) === index
}
function createFilter(
  props,
  anchorEl,
  setEnchorEl,
  subProjects,
  setFilter
) {
  if(subProjects && subProjects.length > 0){
      let filters = subProjects.map(project => project.structureType).filter(unique)
      return (
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose.bind(this, setEnchorEl)}
        >
        
          {filters.map(filter => {
           return  (<StyledMenuItem onClick={handleClose.bind(this, setEnchorEl, setFilter, filter)}>
            {filter}
          </StyledMenuItem>)
          })}
           
            </Menu>
        )
  }
  return <div></div>
}


function handleClose(setEnchorEl, setFilter, filterValue) {
  setEnchorEl("");
  if(setFilter){
    setFilter(filterValue)
  }
}

function handleClick(setEnchorEl, event) {
  setEnchorEl(event.currentTarget);
}


function setOpenAsPopover(setOpen, setProject, project, setRender, render) {
  setOpen(true);
  setProject(project);
  setRender(!render);
}

const mapStateToProps = (state, props) => ({
  projects: getAllProject(state, props),
  user: state.login.user,
  subProjects: state.projects.subProjectsById,
  lang: state.userProfileReducer.lang
});

const mapDispatchToProps = {};
export default withWidth()(
  connect(mapStateToProps, mapDispatchToProps)(SubProjectList)
);
