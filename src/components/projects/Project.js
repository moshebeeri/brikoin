import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import { SubmitOperation } from "../../UI/index";
import MortgagePreview from "../mortgage/MortgagePreview";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Button from "@material-ui/core/Button";
import Gallery from "react-grid-gallery";
import { config } from "../../conf/config";
const NumberFormat = require("react-number-format");

const styles = theme => ({
  card: {
    maxWidth: "2000",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "1%"
  },
  textField: {
    width: 200
  },
  media: {
    width: 500,
    height: 500
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

class Project extends React.Component {
  state = { expanded: false, estimationExpanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleEstimationExpandedClick = () => {
    this.setState({ estimationExpanded: !this.state.estimationExpanded });
  };

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }
  invest() {
    const { trade, activeAccount, project, user } = this.props;
    if (this.state.amount > 0) {
      let bid = {
        name: project.name,
        price: 1,
        projectId: project.address,
        side: "bid",
        userAccount: activeAccount.accountId,
        size: this.state.amount,
        state: "initial",
        time: new Date().getTime(),
        user: user.uid,
        status: "pending"
      };
      trade(bid, "bid");
    }
  }

  investExternal(request, stackId) {
    const { tradeExternalRequest, activeAccount, user, project } = this.props;
    if (this.state.amount > 0) {
      let bid = {
        name: project.name,
        price: request.limit,
        projectId: project.address,
        side: "bid",
        userAccount: activeAccount.accountId,
        size: request.amount,
        state: "initial",
        time: new Date().getTime(),
        user: user.uid,
        status: "pending"
      };
      tradeExternalRequest(bid, activeAccount, stackId);
    }
  }
  render() {
    const {
      classes,
      projectIndex,
      project,
      projectLength,
      topAsks,
      activeAccount
    } = this.props;
    const projectAsks = topAsks[project.address];
    const filteredAsks = projectAsks
      ? projectAsks.filter(ask => ask.state === "initial")
      : [];
    const projectInitialAsk = filteredAsks.length > 0 ? filteredAsks[0] : "";
    const map = (
      <iframe
        width="600"
        height="450"
        frameborder="0"
        style={{ topMargin: 10, border: 0 }}
        src="https://www.google.com/maps/embed/v1/place?q=E+17th+St,+Union+Sq+West&key=AIzaSyAkQNcIfydNvelf5DFFcRPi5buoXtPl8LE"
        allowfullscreen
      />
    );
    const PDF = (
      <div>
        <Card className={classes.card}>
          <CardHeader
            title={"legal documents"}
            subheader="Legals and other project related..."
          />
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton
              onClick={this.handleEstimationExpandedClick}
              aria-expanded={this.state.estimationExpanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <div className={classes.details}>
            <h4 style={{ color: "green" }}>
              MD5 (p1090514-01.pdf) = 0ca3c6e0dcfa20b1136fd5685899c85f |
              Contract 0ca3c6e0dcfa20b1136fd5685899c85f
            </h4>
            {project && (
              <a href={project.pdf} download>
                download
              </a>
            )}
            {project && (
              <Collapse
                in={this.state.estimationExpanded}
                timeout="auto"
                unmountOnExit
              >
                <CardContent className={classes.content}>
                  <object
                    type="application/pdf"
                    data={project.pdf}
                    width="100%"
                    height="650"
                  />
                </CardContent>
              </Collapse>
            )}
          </div>
        </Card>
      </div>
    );

    let rowHeight = 400;
    if (project && project.property && project.property.pictures.length > 4) {
      rowHeight = 200;
    }
    return (
      <div>
        <Card className={classes.card}>
          <div style={{ position: "relative" }}>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                  R
                </Avatar>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title={project ? project.name : "no content"}
              subheader={project ? project.description : "no content"}
            />
            <div style={{ marginBottom: 20 }}>
              The project is now for sell. target price is{" "}
              <NumberFormat
                value={project.target}
                displayType={"text"}
                thousandSeparator
                suffix={"$"}
              />
            </div>
            {projectInitialAsk && (
              <div style={{ marginBottom: 20 }}>
                Current target status{" "}
                <NumberFormat
                  value={projectInitialAsk.size}
                  displayType={"text"}
                  thousandSeparator
                  suffix={"$"}
                />
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <form className={classes.container} noValidate autoComplete="off">
                <TextField
                  label="amount"
                  id="amount"
                  className={classes.textField}
                  onChange={this.handleChange("amount")}
                  margin="normal"
                  fullWidth
                  type="number"
                  value={this.state.amount}
                />
                {activeAccount.type === "EXTERNAL" ? (
                  <SubmitOperation
                    onSuccess={this.investExternal.bind(this)}
                    request={{
                      projectId: project.address,
                      amount: this.state.amount,
                      limit: 1 * config.stoneRatio
                    }}
                    label={"Invest"}
                    contract={"CornerStone"}
                    event={"BidCreated"}
                    method={"bid"}
                  />
                ) : (
                  <Button color={"primary"} onClick={this.invest.bind(this)}>
                    Invest
                  </Button>
                )}
              </form>
            </div>
            <div>
              {project.mortgages && project.mortgages.length > 0 && (
                <div>Available Mortgages</div>
              )}
              {project.mortgages &&
                project.mortgages.length > 0 &&
                project.mortgages.map(mortgage => (
                  <MortgagePreview
                    projectAddress={project.address}
                    mortgageCondition={mortgage}
                  />
                ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              {project &&
                project.property &&
                project.property.pictures.length > 1 && (
                  <Gallery
                    rowHeight={rowHeight}
                    images={project.property.pictures
                      .map(picture => {
                        return {
                          src: picture,
                          thumbnail: picture,
                          thumbnailWidth: 16,
                          thumbnailHeight: 9
                        };
                      })
                      .filter(pic => pic)}
                  />
                )}
            </div>
            {projectIndex > 0 && (
              <IconButton
                onClick={() => {
                  this.props.onBefore();
                }}
                style={{
                  position: "absolute",
                  color: "blue",
                  backgroundColor: "#ccc",
                  top: 200,
                  left: "5%"
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
            )}
            {projectLength > projectIndex + 1 && (
              <IconButton
                onClick={() => {
                  this.props.onNext();
                }}
                style={{
                  position: "absolute",
                  color: "blue",
                  backgroundColor: "#ccc",
                  top: 200,
                  right: "5%"
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            )}
            {map}
          </div>
          <CardContent>
            <Typography component="p">
              This impressive paella is a perfect party dish and a fun meal to
              cook together with your guests. Add 1 cup of frozen peas along
              with the mussels, if you like.
            </Typography>
          </CardContent>

          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {PDF}
              <Typography paragraph variant="body2">
                Method:
              </Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron
                and set aside for 10 minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep
                skillet over medium-high heat. Add chicken, shrimp and chorizo,
                and cook, stirring occasionally until lightly browned, 6 to 8
                minutes. Transfer shrimp to a large plate and set aside, leaving
                chicken and chorizo in the pan. Add pimentón, bay leaves,
                garlic, tomatoes, onion, salt and pepper, and cook, stirring
                often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a
                boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes
                and peppers, and cook without stirring, until most of the liquid
                is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add
                reserved shrimp and mussels, tucking them down into the rice,
                and cook again without stirring, until mussels have opened and
                rice is just tender, 5 to 7 minutes more. (Discard any mussels
                that don’t open.)
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then
                serve.
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
}

Project.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Project);
