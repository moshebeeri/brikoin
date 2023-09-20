import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import TextField from "@material-ui/core/TextField";
import { connect } from 'react-redux'
import { assignProjectOrganization } from "../../redux/actions/admin";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Collapse } from "react-collapse";
import MdExpandMore from '@material-ui/icons/ExpandMore';
import MdExpandLess from '@material-ui/icons/ExpandLess';

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  cardDeveloper: {
    maxWidth: 400,
    position: "absolute",
    bottom: 0,
    right: 0
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
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

class AssignnProjectOrg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      initial: false
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  openCollapse() {
    this.setState({ open: true });
  }

  closeCollapse() {
    this.setState({ open: false });
  }

  assignProjectOrg() {
    const { assignProjectOrganization } = this.props;
    assignProjectOrganization(
      this.state.projectAddress,
      this.state.organization
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.open ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div>Assign Organization to Project</div>
            <Button color={"primary"} onClick={this.closeCollapse.bind(this)}>
              <MdExpandMore />
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div>Assign Organization to Project</div>
            <Button color={"primary"} onClick={this.openCollapse.bind(this)}>
              <MdExpandLess />
            </Button>
          </div>
        )}

        <Collapse isOpened={this.state.open}>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                width: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  width: 100,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TextField
                  label="Project Address"
                  id="projectAddress"
                  className={classes.textField}
                  onChange={this.handleChange("projectAddress")}
                  margin="normal"
                  fullWidth
                  type="string"
                  value={this.state.projectAddress}
                />
                <TextField
                  label="Organization"
                  id="organization"
                  className={classes.textField}
                  onChange={this.handleChange("organization")}
                  margin="normal"
                  fullWidth
                  type="string"
                  value={this.state.organization}
                />

                <Button
                  color={"primary"}
                  onClick={this.assignProjectOrg.bind(this)}
                >
                  Assign Organization To Project
                </Button>
              </div>
            </div>
          </form>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user
});

const mapDispatchToProps = {
  assignProjectOrganization
};
AssignnProjectOrg.contextTypes = {
  drizzle: PropTypes.object
};


export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(AssignnProjectOrg))