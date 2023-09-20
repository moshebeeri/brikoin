import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import BidAndAsk from "../trade/bidAndAsk";
import MortgagePreview from "../mortgage/MortgagePreview";
import ProjectStats from "../trade/propertyStats";
import { getProjectStats } from "../../redux/actions/trade";
import LastDeals from "../trade/lastDeals";
import TradeRates from "../trade/tradeRates";
import TradeStats from "../trade/tradesStats";
import ProjectPreview from "../projects/ProjectPreview";
import Developer from ".././developer/developer";
import YiledStats from "../trade/yieldStats";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";

const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: "center",
      color: theme.palette.text.secondary
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
      height: 40
    },
    control: {
      padding: theme.spacing.unit * 2
    }
  };
};

class Trade extends React.Component {
  state = {
    spacing: "16",
    project: ""
  };

  handleChange = key => (event, value) => {
    this.setState({
      [key]: event.target.value
    });
  };

  componentWillMount() {
    const projectAddress = this.props.location.pathname.substring(8)
      ? this.props.location.pathname.substring(8)
      : this.state.projectId;
    if (projectAddress) {
      this.props.getProjectStats(projectAddress);
    }
  }

  selectProject(event) {
    let projectId = event.target.value;
    this.setState({
      projectId: projectId
    });
    this.props.getProjectStats(projectId);
  }

  render() {
    const { classes, projects } = this.props;
    const projectAddress = this.props.location.pathname.substring(8)
      ? this.props.location.pathname.substring(8)
      : this.state.projectId;
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    const projectStats = project
      ? {
          estimation: project.property.estimation
            ? project.property.estimation.price$
            : 0,
          target: project.target
        }
      : "";
    return (
      <div style={{ marginTop: "5%" }}>
        {projects && (
          <div style={{ flex: 1, backgroundColor: "white" }}>
            <FormControl className={classes.textField}>
              {!projectAddress && (
                <InputLabel htmlFor="age-simple">Choose Projects</InputLabel>
              )}
              <Select
                value={projectAddress || "None"}
                onChange={this.selectProject.bind(this)}
              >
                <MenuItem value="None">
                  <em>None</em>
                </MenuItem>
                {projects.map(project => (
                  <MenuItem key={project.address} value={project.address}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
        {projectAddress && <ProjectPreview project={project} />}

        {projectAddress && project && (
          <div>
            {project.mortgages && project.mortgages.length > 0 && (
              <div>Available Mortgages</div>
            )}
            {project.mortgages &&
              project.mortgages.length > 0 &&
              project.mortgages.map(mortgage => (
                <MortgagePreview
                  showBid
                  projectAddress={project.address}
                  mortgageCondition={mortgage}
                />
              ))}
          </div>
        )}
        {projectAddress && <BidAndAsk projectId={projectAddress} />}
        {projectAddress && <ProjectStats projectStats={projectStats} />}
        {projectAddress && <LastDeals projectId={projectAddress} />}
        {projectAddress && <TradeRates projectId={projectAddress} />}
        {projectAddress && <TradeStats projectId={projectAddress} />}
        {projectAddress && <YiledStats projectId={projectAddress} />}
        <Developer />
      </div>
    );
  }
}

Trade.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  selectedProject: state.admin.selectedProject,
  projects: getPopulatedProjects(state, props),
  change: state.trades.change
});

const mapDispatchToProps = {
  getProjectStats
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Trade)
);
