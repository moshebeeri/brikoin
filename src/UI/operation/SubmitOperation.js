import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { connect } from 'react-redux'
import Button from "@material-ui/core/Button";
import { setTransaction } from "../../redux/actions/submitForm";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
const styles = theme => ({
  card: {
    maxWidth: "2000",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "1%"
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

class SubmitOperation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stackId: "" };
  }

  handleSubmit() {
    const { request, drizzleStatus, onSuccess } = this.props;

    if (drizzleStatus.initialized) {
      let stackId = this.context.drizzle.contracts[this.props.contract].methods[
        this.props.method
      ].cacheSend(...Object.values(request));
      if (onSuccess) {
        onSuccess(request, stackId);
      }
    }
  }

  render() {
    const {
      userAccounts,
      label,
      icon,
      fullWidth,
      variant,
      className,
      noColor
    } = this.props;
    if (icon === "delete") {
      return (
        <IconButton onClick={this.handleSubmit.bind(this)} aria-label="Delete">
          <DeleteIcon />
        </IconButton>
      );
    }

    if (noColor) {
      return (
        <div>
          {userAccounts && userAccounts.length > 0 && (
            <Button
              className={className}
              fullWidth={fullWidth}
              variant={variant}
              onClick={this.handleSubmit.bind(this)}
            >
              {label || "Submit"}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div>
        {userAccounts && userAccounts.length > 0 && (
          <Button
            color={"primary"}
            className={className}
            fullWidth={fullWidth}
            variant={variant}
            onClick={this.handleSubmit.bind(this)}
          >
            {label || "Submit"}
          </Button>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userAccounts: state.userAccounts.accounts,
    activeAccount: state.userAccounts.activeAccount,
    drizzleStatus: state.drizzleStatus,
    contracts: state.contracts,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
    executedTransactions: state.submitForm.transactions
  };
};

SubmitOperation.contextTypes = {
  drizzle: PropTypes.object
};

const mapDispatchToProps = {
  setTransaction
};

export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(SubmitOperation))
