/* eslint-disable key-spacing */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import MapComponent from "./GoogleMap";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Gallery from "react-grid-gallery";
import { ProjectSymbol, ProjectInvest } from "../../UI/index";
import { pageViewd } from "../../utils/tracker";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import {
  initProjectStats,
  initUserProjectStats
} from "../../redux/actions/trade";
import ProjectStats from "../../UI/project/projecStats";
import LinesEllipsis from "react-lines-ellipsis";
import LoadingCircular from "../../UI/loading/LoadingCircular";
// import 'slick-carousel/slick/slick-theme.css'
import withWidth from "@material-ui/core/withWidth";
const styles = theme => {
  return {
    cardTitle: {
      marginTop: 16,
      display: "flex",
      marginBottom: 16,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },

    details: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexDirection: "column"
    },

    progress: {
      margin: theme.spacing.unit * 2
    }
  };
};

class ProjectFullDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      estimationExpanded: false,
      pageNumber: 1,
      open: false,
      price: 1
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes, projects, lang } = this.props;

    const projectAddress = this.props.projectAddress;

    if (projects && projects.length > 0) {
      const project = projectAddress
        ? projects.filter(project => project.address === projectAddress)[0]
        : "";
      const projectName =
        lang !== "En" && project.lang && project.lang[lang]
          ? project.lang[lang].name
          : project.name;
      const projectDescription =
        lang !== "En" && project.lang && project.lang[lang]
          ? project.lang[lang].description
          : project.description;
      return (
        <div>
          <div
            style={{
              marginRight: "20%",
              marginLeft: "20%",
              width: "100%",
              display: "flex",
              // alignItems: 'center',
              // justifyContent: 'center',
              flexDirection: "column"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column"
              }}
            >
              {project.organization && project.organization.name && (
                <p style={{ fontSize: "1em" }}>
                  {this.props.t("Featured project by")}{" "}
                  {project.organization.name}:
                </p>
              )}
              <p style={{ fontSize: "2em" }}>{projectName}</p>
            </div>
          </div>
          <div style={{ width: "100%" }}>
            {this.projectPictures(project, lang)}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              {this.projectMainPanel(
                classes,
                project,
                projectName,
                projectDescription
              )}
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

  projectMainPanel(classes, project, projectName, projectDescription) {
    return (
      <div
        style={{
          maxWidth: 1140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Grid container direction="row">
          <Grid
            xs={this.props.width === "xs" ? 0 : 8}
            key="99_fullDetails"
            item
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Grid
                container
                direction="column"
                alignItems="flex-start"
                justify="flex-start"
              >
                <Grid key="1_fullDetails" item>
                  <div style={{ marginTop: "30px" }}>
                    {this.projectDescription(
                      classes,
                      project,
                      projectName,
                      projectDescription
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid
            xs={this.props.width === "xs" ? 12 : 4}
            key="5_fullDetails"
            item
          >
            <div style={{ marginTop: "70px", marginLeft: "30px" }}>
              <ProjectInvest
                history={this.props.history}
                t={this.props.t}
                project={project}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  projectDescription(classes, project, projectName, projectDescription) {
    return (
      <div
        style={{
          maxWidth: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Card className={classes.cardTitle}>
          {this.projectNameDescription(
            classes,
            project,
            projectName,
            projectDescription
          )}
        </Card>
      </div>
    );
  }

  projectNameDescription(classes, project, projectName, projectDescription) {
    const { direction } = this.props;
    return (
      <CardContent className={classes.details}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <ProjectSymbol symbol={project.symbol} />
          <Typography
            align={props.direction === "ltr" ? "left" : "right"}
            variant="h5"
          >
            {projectName}
          </Typography>
        </div>
        <ProjectStats project={project} t={this.props.t} />
        <Typography
          align={props.direction === "ltr" ? "left" : "right"}
          variant="h6"
          color="textSecondary"
        >
          {project.property.address1}
        </Typography>
        <div
          style={{
            display: "flex",
            textAlign: direction,
            fontSize: 14,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <LinesEllipsis
            text={projectDescription}
            maxLine="5"
            ellipsis="..."
            basedOn="letters"
          />
        </div>
      </CardContent>
    );
  }

  projectPictures(project, lang) {
    const direction = this.props.width === "xs" ? "column" : "row";
    const height = this.props.width === "xs" ? 820 : 410;
    const width = this.props.width === "xs" ? "100%" : "65%";
    const small = this.props.width !== "xs";
    const lat = project.location ? project.location.lat : 40.738286;
    const lng = project.location ? project.location.lng : -74.243855;
    const style =
      this.props.width === "xs"
        ? {
            height: height,
            alignItems: "center",
            marginTop: 65,
            display: "flex",
            flexDirection: direction
          }
        : {
            height: height,
            marginTop: 65,
            display: "flex",
            flexDirection: direction
          };
    return (
      <div style={style}>
        <div style={{ width: width }}>
          <Gallery
            rowHeight={200}
            maxRows={2}
            images={project.property.pictures
              .map((picture, index) => {
                return {
                  src: Array.isArray(picture) ? picture[0] : picture,
                  thumbnail: Array.isArray(picture) ? picture[0] : picture,
                  thumbnailWidth: 16 + index,
                  thumbnailHeight: 9
                };
              })
              .filter(pic => pic)}
          />
        </div>
        <MapComponent lat={lat} lng={lng} small={small} lang={lang} />
      </div>
    );
  }

  componentDidUpdate() {
    const { user, init } = this.props;
    if (user && !init) {
      this.props.initUserProjectStats(user.uid);
    }
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.initUserProjectStats(user.uid);
    }
    this.props.initProjectStats();
    window.scrollTo(0, 0);
    const projectAddress = this.props.location.pathname.substring(14)
      ? this.props.location.pathname.substring(14)
      : "";

    pageViewd("/project/" + projectAddress);
  }
}

const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  changed: state.trades.change,
  topAsks: state.trades.topAsks,
  direction: state.userProfileReducer.direction,
  update: state.userAccounts.update,
  userProjectPosition: state.trades.userProjectPosition,
  lang: state.userProfileReducer.lang,
  user: state.login.user,
  init: state.trades.init
});

const mapDispatchToProps = {
  initProjectStats,
  initUserProjectStats
};

ProjectFullDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withRouter(
    withStyles(styles)(
      connect(mapStateToProps, mapDispatchToProps)(ProjectFullDetails)
    )
  )
);
