import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import { uploadLogo } from "../../redux/actions/mortgage";
import Button from "@material-ui/core/Button";
const styles = theme => {
  return {
    button: {
      margin: theme.spacing.unit
    },
    input: {
      display: "none"
    },
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    formControl: {
      margin: theme.spacing.unit * 3
    },
    group: {
      margin: `${theme.spacing.unit}px 0`
    },
    menu: {
      width: 200
    },
    card: {
      maxWidth: 275,
      marginTop: "10%"
    },
    grid: {
      flex: 1
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
    },
    title: {
      marginBottom: 16,
      fontSize: 14
    },
    pos: {
      marginBottom: 12
    }
  };
};

class MortgageeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  uploadLogo() {
    this.props.uploadLogo(this.props.user, this.state.logo_file);
  }

  handleChangeFile(name) {
    let file = name + "_file";
    return event => {
      this.setState({
        [name]: event.target.value,
        [file]: event.target.files
      });
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "center"
        }}
      >
        <Card className={classes.card}>
          <h3>Add Mortgagee Logo</h3>
          <CardContent>
            <form className={classes.container} noValidate autoComplete="off">
              <div
                style={{
                  alignItems: "center",
                  flexDirection: "col",
                  justifyContent: "center"
                }}
              >
                <div style={{ flex: 1 }}>
                  Attach Logo:
                  <input
                    id="jpg"
                    value={this.state.logo}
                    className={classes.textField}
                    type="file"
                    accept="jpg"
                    onChange={this.handleChangeFile("logo")}
                  />
                </div>

                <label htmlFor="outlined-button-file">
                  <Button
                    color={"outlined"}
                    onClick={this.uploadLogo.bind(this)}
                  >
                    upload logo
                  </Button>
                </label>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

MortgageeForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  activeAccount: state.userAccounts.activeAccount,
  mortgagee: state.userAccounts.mortgagee
});

const mapDispatchToProps = {
  uploadLogo
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MortgageeForm)
);
