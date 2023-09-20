import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { format } from "../../utils/stringUtils";
const styles = theme => ({
  card: {
    maxWidth: "2000",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "1%"
  },
  button: {
    width: 100,
    height: 30
  },

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

class NoFundDialog extends React.Component {
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    return this.renderDialog();
  }

  renderDialog() {
    const { open, handleClose, funds } = this.props;

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.props.t("NoFunds")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {format(this.props.t("NoFundsMsg"), [funds])}
            </DialogContentText>
          </DialogContent>
          <DialogActions />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};

NoFundDialog.contextTypes = {
  drizzle: PropTypes.object
};

const mapDispatchToProps = {};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(NoFundDialog)
);
