import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withCusomeStyle } from "../../UI/warappers/withCusomeStyle";
import { FormGen } from "../../UI/index";
import { save , setLoadingProperties} from "../../redux/actions/loadingProperty";
import { listenForNewProjectss , getParentProjects, getLoadingProperties} from "./propertyUtils";
import ProjectNew from "../projects/ProjectNew";
import ProjectFullDetails from "../projects/ProjectFullDetails";
import Popover from "@material-ui/core/Popover";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LoadingCircular from "../../UI/loading/LoadingCircular";
function PropertyLoader(props) {
  const { user, lang, direction } = props;
  const [state, setState] = useState({});
  const [parentProjects, setParentProject] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState({});
  const [render, setRender] = useState(false);
  const [globalState, setGlobalState] = useState({});
  useEffect(() => {
    let newState = globalState;
    extend(newState, state);
    setGlobalState(newState);
    setRender(!render);
  }, [state]);
  listenForNewProjectss(setProjects);
  initParentProjects(parentProjects, setParentProject)
  const project = itemToProject(props, globalState);
  const entity = projectToState(project, globalState);
  return (
    <div
      style={{
        marginTop: "7%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
      }}
    >
    {saving && createLoading(props, saving, setSaving)}
      <ProjectNew
        subProjects={transformSubProjects(projects, props)}
        showFullDetails={setOpen.bind(this, true)}
        history={props.history}
        lang={lang}
        t={props.t}
        user={user}
        viewOnly
        project={project}
      />
      <FormGen
        entity={entity}
        state={entity}
        setState={setState.bind(this)}
        t={props.t}
        getProjects={getSubProjects.bind(this, projects)}
        getParentProjects={getParentProjectAction.bind(this, parentProjects)}
        entityPath={getGeneralForm(project.structure, project.type)}
        save={saveEntity.bind(this, props, globalState, setSaving, saving)}
        buttonTitle={"Submit Project"}
      />

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
          dir={direction}
          style={{
            width: props.width === "xs" ? 300 : 1400,
            height: "90%",
            marginBottom: 50
          }}
        >
          <ProjectFullDetails
            render={render}
            preview
            projectName={project.name}
            projectDescription={project.description}
            history={props.history}
            lang={lang}
            t={props.t}
            user={user}
            location={props.location}
            viewOnly
            project={project}
            subProjects={transformSubProjects(projects, props)}
          />
        </div>
      </Popover>
    </div>
  );
}

async function initParentProjects(parentProject, setParentProjects){
  if(!parentProject){
   let results =  await getParentProjects()
   setParentProjects(results)
  }
}

function getSubProjects(projects) {
  if (!projects) {
    return [];
  }

  if (projects.length === 0) {
    return [];
  }

  let subProjects = projects.filter(project => project.subProject);
  if (subProjects.length === 0) {
    return [];
  }
  return subProjects.map(project => {
    return { label: project.projectName, value: project.id };
  });
}


function getParentProjectAction(parentProjects) {
  if (!parentProjects) {
    return [];
  }

  if (parentProjects.length === 0) {
    return [];
  }

  return parentProjects.map(project => {
    return { label: project.projectName, value: project.key };
  });
}

function transformSubProjects(projects, props) {
  if (!projects) {
    return [];
  }

  if (!projects.length) {
    return [];
  }

  if (projects.length === 0) {
    return [];
  }

  let subProjects = projects.filter(project => project.subProject);
  if (subProjects.length === 0) {
    return [];
  }
  return subProjects.map(project => itemToProject(props, project));
}

function getGeneralForm(projectStructure, type) {
 
  if (projectStructure === "Apartments") {
    return "propertyLoader/Apartments";
  }

  if (type === "parentProject") {
    return "propertyLoader/Offices";
  }


  if (projectStructure === "Office") {
    return "propertyLoader/office";
  }
  

  if (projectStructure === "Land") {
    return "propertyLoader/land";
  }

  if (projectStructure === "Apartment") {
    return "propertyLoader/appartment";
  }

  return "propertyLoader/default";
}

async function saveEntity(props, globalState, setSaving, saving, entity) {
  if(saving){
    return
  }
  setSaving(true)
  const project = itemToProject(props, globalState);
  let entityFromState = projectToState(project, globalState);
  let item = getItem(props);
  if (item) {
    entityFromState.id = item.id;
  } else {
    entityFromState.id = 0;
  }
  props.save(props.user, entityFromState);
   let list = await  getLoadingProperties()
  props.setLoadingProperties(list)
  setSaving(false)
  props.history.goBack();


}


function createLoading(props, openDialog, setOpenDialog){
  return <Dialog
  open={openDialog}
  onClose={setOpenDialog.bind(this, false)}
  aria-labelledby="form-dialog-title"
>
  <DialogTitle id="form-dialog-title">
    {props.t("Submit Project")}
  </DialogTitle>
 
      <div  style={{ width: 200, marginTop: 10 }}>
        <LoadingCircular open size={30} />
      </div>
    
</Dialog>
}

function extend(obj, src) {
  Object.keys(src).forEach(function(key) {
    obj[key] = src[key];
  });
  return obj;
}

function itemToProject(props, state) {
  const { lang } = props;
  let project = {};
  project.id = state.id;
  project.name = getValueByKey(
    "projectName",
    props.t("Missing Name"),
    props,
    state
  );
  project.maxOwners = getValueByKey(
    "maxOwners",
    props.t("Missing Name"),
    props,
    state
  );
  project.status = 'PlayGround'
  project.target = getValueByKey("targetPrice", 0, props, state);
  project.flowType = getValueByKey("flowType", 0, props, state);
  project.lang = {};
  project.address = "0";
  project.lang[lang] = {};
  project.lang[lang].name = getValueByKey(
    "projectName",
    props.t("Missing Name"),
    props,
    state
  );
  project.symbol = getValueByKey("projectSymbol", props.t("TMP"), props, state);
  project.currency = getValueByKey(
    "projectCurrency",
    props.t("USD"),
    props,
    state
  );
  project.trustee = getValueByKey("trustee", '', props, state);
  project.parentProject = getValueByKey("parentProject", '', props, state);
  project.maxBulkSize = getValueByKey("maxBulkSize", '', props, state);
  project.minBulkSize = getValueByKey("minBulkSize", 1, props, state);
  project.tradeMethod = getValueByKey("tradeMethod", '', props, state);
  project.subProject = project.parentProject ? true : false
  project.description = getValueByKey(
    "description",
    props.t("Missing Description"),
    props,
    state
  );
  project.lang[lang].description = getValueByKey(
    "description",
    props.t("Missing Description"),
    props,
    state
  );
  project.features = {};
  project.secondFeatures = {};
  project.features = getFeatures(state, props);

  project.secondFeatures = getSeconderyFeatures(state, props);
  project.structure = getValueByKey("projectType", '', props, state);
  project.structureType = getValueByKey("structureType", '', props, state);
  project.type =
    getValueByKey("projectType", '', props, state)  === "parentProject" ||
    getValueByKey("projectType", '', props, state)  === "Apartments" 

      ? "parentProject"
      : "";
  project.property = {};
  project.location = {};
  project.youTube = getValueByKey("youTube", '', props, state);
  project.subProjects = {};
  project.subProjects.map = getFileUrl("map", props, state);
  project.subProjects.projects = getValueByKey(
    "projects",
    '',
    props,
    state
  );
  project.projects = getValueByKey("projects", '', props, state);
  project.officials = getOfficials(state, props);
  project.trustee = getOfficialByRole(project.officials, "TRUSTEE");
  project.management = getOfficialByRole(project.officials, "management");
  project.constraction = getOfficialByRole(project.officials, "CONSTRUCTION");
  project.entrepreneur = getOfficialByRole(project.officials, "ENTREPRENEUR");
  project.projectBank = getOfficialByRole(project.officials, "BANK");
  project.projectLawyer = getOfficialByRole(project.officials, "LAWYER");
 
  project.projectMarketing = getOfficialByRole(project.officials, "MARKETING");
 
  project.location.lat = getValueByKey(
    "projectAddressLocationLat",
    '',
    props,
    state
  );
  project.location.lng = getValueByKey(
    "projectAddressLocationLng",
    '',
    props,
    state
  );
  project.location.address = getValueByKey(
    "projectAddress",
    '',
    props,
    state
  );
  project.property.pictures = getPictures(props, state);
  project.property.estimation = {};
  project.property.estimation.pdf = getFileUrl("estimation", props, state);
  project.property.registrar = {};
  project.property.registrar.pdf = getFileUrl("registrar", props, state);
  project.property.manager = {};
  project.property.manager.pdf = getOfficialDocumentByRole(
    project.officials,
    "management"
  );

  project.property.constraction = {};
  project.property.constraction.pdf = getOfficialDocumentByRole(
    project.officials,
    "CONSTRUCTION"
  );

  project.property.entrepreneur = {};
  project.property.entrepreneur.pdf = getOfficialDocumentByRole(
    project.officials,
    "ENTREPRENEUR"
  );

  project.property.projectBank = {};
  project.property.projectBank.pdf = getOfficialDocumentByRole(
    project.officials,
    "BANK"
  );

  project.property.projectLawyer = {};
  project.property.projectLawyer.pdf = getOfficialDocumentByRole(
    project.officials,
    "LAWYER"
  );

  project.property.projectMarketing = {};
  project.property.projectMarketing.pdf = getOfficialDocumentByRole(
    project.officials,
    "MARKETING"
  );

  project.property.pdfMd5 = getValueByKey("rentMd5", '', props, state);
  project.property.pdfFile = getValueByKey("rentFile", '', props, state);
  project.property.pdf = getFileUrl("rent", props, state);
  return project;
}

function projectToState(project, state) {
  let newState = {
    projectType: project.structure,
    structure: project.structure,
    type: project.type,
    projectSymbol: project.symbol,
    structureType: project.structureType,
    projectName: project.name,
    parentProject: project.parentProject,
    flowType: project.flowType,
    maxOwners: project.maxOwners,
    youTube: project.youTube,
    minBulkSize: project.minBulkSize,
    maxBulkSize: project.maxBulkSize,
    tradeMethod: project.tradeMethod, 
    projectAddress: project.location.address,
    projectCurrency: project.currency,
    projectAddressLocationLat: project.location.lat,
    projectAddressLocationLng: project.location.lng,
    targetPrice: project.target,
    subProject: project.parentProject ? true : false,
    subProjects: project.subProjects,
    projects: project.projects,
    features: project.features ? project.features : "",
    officials: project.officials ? project.officials : "",
    secondFeatures: project.secondFeatures ? project.secondFeatures : "",
    trustee: project.trustee,
    description: project.description,
    pictures: state.pictures
      ? state.pictures
      : project.property
      ? project.property.pictures
      : "",
    // idPicture: 'webCap',
    estimation: state.estimation
      ? state.estimation
      : project.property && project.property.estimation
      ? project.property.estimation.pdf
      : "",
    registrar: state.registrar
      ? state.registrar
      : project.property && project.property.registrar
      ? project.property.registrar.pdf
      : "",
    rent: state.rent
      ? state.rent
      : project.property && project.property.pdf
      ? project.property.pdf
      : "",
    map: state.map
      ? state.map
      : project.subProjects && project.subProjects.map
      ? project.subProjects.map
      : "",
    rentMd5: state.rent
      ? state.rent
      : project.property && project.property.pdfMd5
      ? project.property.pdfMd5
      : "",
    rentFile: state.rent
      ? state.rent
      : project.property && project.property.rentFile
      ? project.property.rentFile
      : "",
    management: state.management
      ? state.management
      : project.property && project.property.manager
      ? project.property.manager.pdf
      : "",
      constraction: state.constraction
      ? state.constraction
      : project.property && project.property.constraction
      ? project.property.constraction.pdf
      : ""
      ,
      entrepreneur: state.entrepreneur
      ? state.entrepreneur
      : project.property && project.property.entrepreneur
      ? project.property.entrepreneur.pdf
      : ""
      ,
      projectBank: state.projectBank
      ? state.projectBank
      : project.property && project.property.projectBank
      ? project.property.projectBank.pdf
      : ""
      ,
      projectLawyer: state.projectLawyer
      ? state.projectLawyer
      : project.property && project.property.projectLawyer
      ? project.property.projectLawyer.pdf
      : ""
      ,
      projectMarketing: state.projectMarketing
      ? state.projectMarketing
      : project.property && project.property.projectMarketing
      ? project.property.projectMarketing.pdf
      : ""
  };
  return newState;
}

function getFeatures(state, props) {
  let item = getItem(props);
  if (!state.features) {
    if (item.features) {
      return item.features;
    }
    return "";
  }
  let features = Object.keys(state.features).filter(
    key => state.features[key].value
  );
  if (features.length > 0) {
    let formatedFeatures = {};
    features.forEach(key => {
      let feature = state.features[key];
      formatedFeatures[feature.primaryFeature] = {
        type: feature.type || 'string',
        primaryFeature: feature.primaryFeature,
        value: feature.value,
        order: feature.order ? feature.order : 1
      };
    });

    return formatedFeatures;
  }
  return "";
}

function getOfficialByRole(officials, role) {
  if (officials && Object.keys(officials).length > 0) {
    let result = Object.keys(officials).filter(
      key => officials[key].role === role
    );
    if (result.length > 0) {
      let official = officials[result[0]];
      return {
        user: official.user,
        features:
          official.officialsFeatures &&
          Object.keys(official.officialsFeatures).length > 0
            ? toOfficialsFeatures(official.officialsFeatures)
            : ""
      };
    }
  }
  return {};
}

function getOfficialDocumentByRole(officials, role) {
  if (officials && Object.keys(officials).length > 0) {
    let result = Object.keys(officials).filter(
      key => officials[key].role === role
    );
    if (result.length > 0) {
      let official = officials[result[0]];
      return official.document;
    }
  }
  return '';
}

function toOfficialsFeatures(officialsFeatures) {
  let results = {};
  Object.keys(officialsFeatures).forEach(key => {
    results[officialsFeatures[key].roleFeature] = {
      order: officialsFeatures[key].order ? officialsFeatures[key].order : 1,
      value: officialsFeatures[key].value,
      type: officialsFeatures[key].type
    };
  });
  return results;
}

function getOfficials(state, props) {
  let item = getItem(props);
  if (!state.officials) {
    if (item.officials) {
      return item.officials;
    }
    return "";
  }

  let officials = Object.keys(state.officials).filter(
    key => state.officials[key].role
  );
  if (officials.length > 0) {
    let oficialsFormated = {};
    officials.forEach(key => {
      let official = state.officials[key];
      oficialsFormated[official.role] = {
        role: official.role,
        user: official.user,
        document: official.document ? official.document : "",
        documentMd5: official.documentMd5 ? official.documentMd5 : "",
        documentFile: official.documentFile ? official.documentFile : "",
        officialsFeatures: official.officialsFeatures
          ? official.officialsFeatures
          : ""
      };
    });

    return oficialsFormated;
  }
  return "";
}

function getSeconderyFeatures(state, props) {
  let item = getItem(props);
  if (!state.secondFeatures) {
    if (item.secondFeatures) {
      return item.secondFeatures;
    }
    return "";
    return "";
  }
  let features = Object.keys(state.secondFeatures).filter(
    key => state.secondFeatures[key].type && state.secondFeatures[key].value
  );
  if (features.length > 0) {
    let formatedFeatures = {};
    features.forEach(key => {
      let feature = state.secondFeatures[key];
      formatedFeatures[feature.secondaryFeature] = {
        secondaryFeature: feature.secondaryFeature,
        type: feature.type,
        value: feature.value,
        order: feature.order ? feature.order : 1
      };
    });

    return formatedFeatures;
  }
  return "";
}

function getValueByKey(fieldKey, defaultValue, props, state) {
  let item = getItem(props);
  if (state[fieldKey] || state[fieldKey] === "") {
    return state[fieldKey];
  }
  if (item && item[fieldKey]) {
    return item[fieldKey];
  }
  return defaultValue;
}

function getItem(props) {
  const { list } = props;
  if (!list || list.length === 0) {
    return {};
  }
  const id = props.location.pathname.substring(
    props.location.pathname.lastIndexOf("/") + 1
  );
  const filteredItems = list.filter(item => item.id === id);
  if (filteredItems.length === 0) {
    return {};
  }
  if(filteredItems[0].parentProject){
    filteredItems[0]['subProject'] = true
  }
  return filteredItems[0];
}

function getPictures(props, state) {
  let item = getItem(props);
  if (state.pictures && state.pictures.length > 0) {
    let pictures = state.pictures.map(picture => {
      if (picture.name && picture.name.includes("http")) {
        return picture.name;
      }
      if (picture && typeof picture === "string" && picture.includes("http")) {
        return picture;
      }
      return URL.createObjectURL(picture);
    });
    return pictures;
  }
  if (item && item.pictures) {
    let pictures = item.pictures.map(picture => picture.name);
    return pictures;
  }
  return [];
}

function getFileUrl(fieldKey, props, state) {
  let item = getItem(props);
  if (
    state[fieldKey] &&
    state[fieldKey].includes &&
    state[fieldKey].includes("http")
  ) {
    return state[fieldKey];
  }
  if (state[fieldKey] && state[fieldKey].length > 0) {
    const file = state[fieldKey][0];
    if (file.name.includes("http")) {
      return file.name;
    }
    return URL.createObjectURL(file);
  }
  if (item && item[fieldKey]) {
    return item[fieldKey].name || item[fieldKey][0].name;
  }
  return "";
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  list: state.loadingProperties.list,
  direction: state.userProfileReducer.direction,
  lang: state.userProfileReducer.lang
});
const mapDispatchToProps = {
  save, setLoadingProperties
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(PropertyLoader)
);
