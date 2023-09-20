import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { setFeesState } from "../../redux/actions/admin";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Collapse } from "react-collapse";
import MdExpandMore from '@material-ui/icons/ExpandMore';
import MdExpandLess from '@material-ui/icons/ExpandLess';

import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import Select from "@material-ui/core/es/Select/Select";
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";
import FormControl from "@material-ui/core/es/FormControl/FormControl";

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

class FeesUser extends React.Component {
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

  selectProject(event) {
    this.setState({
      feesState: event.target.value
    });
  }

  disposition() {
    const { setFeesState } = this.props;
    setFeesState(this.state.userId, this.state.feesState);
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
            <div>User Fees State</div>
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
            <div>User Fees State</div>
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
                  label="User Id"
                  id="userId"
                  className={classes.textField}
                  onChange={this.handleChange("userId")}
                  margin="normal"
                  fullWidth
                  type="string"
                  value={this.state.userId}
                />

                <FormControl className={classes.textField}>
                  <InputLabel htmlFor="age-simple">Fees State</InputLabel>
                  <Select
                    value={this.state.feesState}
                    onChange={this.selectProject.bind(this)}
                  >
                    <MenuItem key={1} value>
                      True
                    </MenuItem>
                    <MenuItem key={2} value={false}>
                      False
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button color={"primary"} onClick={this.disposition.bind(this)}>
                  Change State
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
  setFeesState
};
FeesUser.contextTypes = {
  drizzle: PropTypes.object
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(FeesUser)
);
