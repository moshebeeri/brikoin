import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ProjectSymbol } from "../../UI/index";
import ProjectInvest from "./projectInvest";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ParentProjectActions from "../../components/projects/ParentProjectActions";
const styles = theme => {
  return {
    card: {
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    details: {
      display: "flex",
      maxWidth: 600,
      flexDirection: "row"
    },
    button: {
      marginTop: 10,
      display: "flex",
      color: "white",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#004466"
    },
    buttonRegular: {
      marginTop: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    content: {
      flex: "1 0 auto"
    },
    cover: {
      width: 300,
      height: 250
    },
    controls: {
      display: "flex",
      alignItems: "center",
      minWidth: 200,
      paddingLeft: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    playIcon: {
      height: 38,
      width: 38
    },
    progress: {
      margin: theme.spacing.unit * 2
    }
  };
};

class ProjectRecommendation extends React.Component {
  render() {
    const { project, lang, direction } = this.props;
    const projectName =
      lang !== "En" && project.lang && project.lang[lang]
        ? project.lang[lang].name
        : project.name;

    return (
      <div dir={direction} style={{ height: 400, display:'flex', flexDirection:'column',alignItems:"space-between",justifyContent:'space-between', backgroundColor: "white" }}>
        <img style={{ height: 170 }} src={project.property.pictures[0]} />
        <div
          dir={direction}
          style={{
            height: 40,
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
            display: "flex",
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <ProjectSymbol symbol={project.symbol} />
          {projectName}
        </div>
        <div
          dir={direction}
          style={{
            height: 200,
            marginTop: -22,
            backgroundColor: "white",
            width: 250
          }}
        >
        {project.type !== "parentProject"  ? <ProjectInvest
            small
            project={project}
            t={this.props.t}
            history={this.props.history}
          /> :
          <div style={{}}>
          <ParentProjectActions
            small
            project={project}
            t={this.props.t}
            history={this.props.history}
          />
          </div>}
        
        </div>
      </div>
    );
  }
}
ProjectRecommendation.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, props) => ({
  lang: state.userProfileReducer.lang,
  direction: state.userProfileReducer.direction
});

const mapDispatchToProps = {};
export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(ProjectRecommendation)
  )
);
