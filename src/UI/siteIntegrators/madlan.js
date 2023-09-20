// import React from 'react'
// import PropTypes from 'prop-types'
// import { withStyles } from '@material-ui/core/styles'
// import withWidth from '@material-ui/core/withWidth'
// import {withProject} from '../warappers/withProject'
// import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
// import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
// import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
// import Typography from '@material-ui/core/Typography'
// const styles = theme => {
//   return ({
//     heading: {}
//   })
// }
//
// const ExpansionPanel = withStyles({
//   root: {
//     border: '1px solid rgba(0,0,0,.125)',
//     boxShadow: 'none',
//     '&:not(:last-child)': {
//       borderBottom: 0
//     },
//     '&:before': {
//       display: 'none'
//     }
//   },
//   expanded: {
//     margin: 'auto'
//   }
// })(MuiExpansionPanel)
//
// const ExpansionPanelSummary = withStyles({
//   root: {
//     backgroundColor: 'rgba(0,0,0,.03)',
//     borderBottom: '1px solid rgba(0,0,0,.125)',
//     marginBottom: -1,
//     minHeight: 56,
//     '&$expanded': {
//       minHeight: 56
//     }
//   },
//   content: {
//     '&$expanded': {
//       margin: '12px 0'
//     }
//   },
//   expanded: {}
// })(props => <MuiExpansionPanelSummary {...props} />)
//
// ExpansionPanelSummary.muiName = 'ExpansionPanelSummary'
//
// const ExpansionPanelDetails = withStyles(theme => ({
//   root: {
//     padding: theme.spacing.unit * 2
//   }
// }))(MuiExpansionPanelDetails)
//
// class Madlan extends React.Component {
//   render () {
//     const {project, classes} = this.props
//     if (!project.madlan) {
//       return <div />
//     }
//     return <ExpansionPanel>
//         <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
//           <Typography className={classes.heading}>מידע על הסביבה אתר מדל״ן</Typography>
//         </ExpansionPanelSummary>
//         <ExpansionPanelDetails>
//
//           <iframe src={project.madlan} height={800} width={'100%'} />
//         </ExpansionPanelDetails>
//       </ExpansionPanel>
//   }
// }
// Madlan.propTypes = {
//   classes: PropTypes.object.isRequired
// }
//
// export default withProject(withWidth()(withStyles(styles)(Madlan)))
import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import CardActionArea from "@material-ui/core/CardActionArea";
import { withProject } from "../warappers/withProject";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";

class Madlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  openPopup() {
    this.setState({ open: true });
  }
  closePopup() {
    this.setState({ open: false });
  }
  render() {
    const { project, classes } = this.props;
    if (!project.madlan) {
      return <div />;
    }

    return (
      <div>
        <div style={{}}>
          <CardActionArea onClick={this.openPopup.bind(this)}>
            <div
              style={{
                marginTop: 16,
                marginBottom: 16,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }}
            >
              <RemoveRedEye className={classes.madlanIcon} />
              <div
                style={{
                  display: "flex",
                  marginLeft: 16,
                  marginRight: 16,
                  flexDirection: "column"
                }}
              >
                <Typography className={classes.madlanHeaderTitle}>
                  {this.props.t("Madlan")}
                </Typography>
                <Typography
                  align="left"
                  variant="h6"
                  color="textSecondary"
                  className={classes.heading}
                >
                  {this.props.t("Show Details From Madlan")}
                </Typography>
              </div>
            </div>
          </CardActionArea>
        </div>

        <Popover
          id="render-props-popover"
          open={this.state.open}
          // anchorEl={anchorEl}
          onClose={this.closePopup.bind(this)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <div
            style={{
              width: this.props.width === "xs" ? 300 : 1100,
              height: "90%"
            }}
          >
            <iframe src={project.madlan} height={800} width={"100%"} />
          </div>
        </Popover>
      </div>
    );
  }
}

Madlan.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withProject(Madlan);
