import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { ProjectSymbol } from "../../UI/index";
const styles = theme => ({
  card: {
    display: "flex",
    marginTop: "1%",
    boxShadow: "none",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderStyle: "solid"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  button: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 100,
    height: 80
  },
  controls: {
    display: "flex",
    alignItems: "center",
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
});

class ProjecHeadline extends React.Component {
  state = { expanded: false, estimationExpanded: false };
  login() {
    const { email, password } = this.state;
    this.props.login(email, password);
    this.state = {
      email: "",
      password: ""
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
    const { classes, project, lang, direction } = this.props;

    const projectName = lang === "En" ? project.name : project.lang[lang].name;

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cover}
          image={project.property.pictures[0]}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
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
                align={direction === "ltr" ? "left" : "right"}
                variant="h5"
              >
                {projectName}
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
}
ProjecHeadline.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(ProjecHeadline)
);
