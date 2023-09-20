import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { saveNewTerms, terms } from "../../redux/actions/terms";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import { SubmitEntity } from "../../UI/index";
import { saveEntity } from "../../redux/actions/inputForms";

const styles = theme => {
  return {
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
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
const initialState = {
  holdingYears: "",
  name: "",
  Country: "",
  sellPercentage: "",
  rental: ""

  /* etc */
};

class TermsForm extends React.Component {
  state = {
    name: ""
  };

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
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

  terms(entity) {
    this.props.saveNewTerms(entity);
    this.setState({
      holdingYears: "",
      name: "",
      Country: "",
      sellPercentage: "",
      rental: ""
    });
  }

  convertToBlockChainEntity(entity, toBlockChainString) {
    const result = {
      _name: toBlockChainString(entity.name),
      _holdingYears: toBlockChainString(entity.holdingYears),
      _sellPercentage: toBlockChainString(entity.sellPercentage),
      _rental: toBlockChainString(entity.rental),
      _url: toBlockChainString(entity.urlCode),
      _urlMD5: toBlockChainString(entity.urlMD5)
    };

    return result;
  }
  saveTerms() {
    this.props.saveEntity(this.state, "terms");
    this.resetForm();
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
          <h3>Terms</h3>
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
                  <TextField
                    label="name"
                    id="name"
                    className={classes.textField}
                    onChange={this.handleChange("name")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="holdingYears"
                    id="holdingYears"
                    className={classes.textField}
                    onChange={this.handleChange("holdingYears")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="sellPercentage"
                    id="sellPercentage"
                    className={classes.textField}
                    onChange={this.handleChange("sellPercentage")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <TextField
                    label="rental"
                    id="rental"
                    className={classes.textField}
                    onChange={this.handleChange("rental")}
                    margin="normal"
                    fullWidth
                    type="string"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  Attach PDF:
                  <input
                    id="pdf"
                    className={classes.textField}
                    type="file"
                    accept="pdf"
                    onChange={this.handleChangeFile("pdf")}
                  />
                </div>

                {/* <SubmitEntity contract={'TermsFactory'} method={'createTerms'} convertToBlockChainEntity={this.convertToBlockChainEntity.bind(this)} setEntity={this.terms.bind(this)} event={'TermsCreated'} label={'Add Terms'} formName={'terms' } entity={this.state}/> */}
                <Button color={"primary"} onClick={this.saveTerms.bind(this)}>
                  save new terms
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

TermsForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user
});

const mapDispatchToProps = {
  terms,
  saveNewTerms,
  saveEntity
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(TermsForm)
);
