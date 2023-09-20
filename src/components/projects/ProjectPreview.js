import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import red from "@material-ui/core/colors/red";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { connect } from 'react-redux';
import CardMedia from "@material-ui/core/CardMedia";
const styles = theme => ({
  card: {
    maxWidth: "2000"
  },
  media: {
    height: 50,
    paddingTop: 100 // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

class ProjectPreview extends React.Component {
  render() {
    const { classes, project } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <div style={{ position: "relative" }}>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                  NY
                </Avatar>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title={project.name}
              subheader={project.description}
            />
            <CardMedia
              className={classes.media}
              image={project.property.pictures[0]}
              title=""
            />
          </div>
        </Card>
      </div>
    );
  }
}

ProjectPreview.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = {};

export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(ProjectPreview))