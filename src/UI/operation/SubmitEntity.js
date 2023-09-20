import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { connect } from 'react-redux';
import { ReactSpinner } from "react-spinning-wheel";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  resetFormState,
  setTransactionState,
  uploadPDF,
  fetchAddress
} from "../../redux/actions/inputForms";
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
    this.state = { stackId: 99999, message: "", location: "" };
  }

  uploadPdf(pdf) {
    const { formName, uploadPDF } = this.props;
    uploadPDF(pdf, formName);
  }

  handleSubmit() {
    const {
      entity,
      checkAddress,
      setTransactionState,
      formName,
      fetchAddress
    } = this.props;
    if (checkAddress && !this.state.location) {
      const state = entity.state ? entity.state : "";
      fetchAddress(
        entity.country + " " + state + " " + entity.address1,
        formName
      );
      setTransactionState("FETCH_ADDRESS", formName);
      return;
    }
    if (entity.pdf) {
      this.uploadPdf(entity);
      return;
    }
    this.updateBlockChain();
  }

  updateBlockChain() {
    const {
      actionMethod,
      activeAccount,
      drizzleStatus,
      user,
      entity,
      setTransactionState,
      formName,
      pdf,
      convertToBlockChainEntity,
      pdfCode,
      pdfMd5,
      addresses
    } = this.props;
    if (entity.pdf) {
      entity.url = pdf[formName];
      entity.urlCode = pdfCode[formName];
      entity.urlMD5 = pdfMd5[formName];
    }
    if (addresses[formName]) {
      const location = addresses[formName].singleResult
        ? addresses[formName]
        : this.state.location;
      if (location) {
        entity.lat = location.lat;
        entity.lng = location.lng;
      }
    }
    if (activeAccount.length === "INTERAL") {
      actionMethod(activeAccount.accountId, user, ...Object.values(entity));
    } else {
      if (drizzleStatus.initialized) {
        const blockChainEntity = convertToBlockChainEntity(
          entity,
          this.context.drizzle.web3.utils.fromAscii
        );
        const stackId = this.context.drizzle.contracts[
          this.props.contract
        ].methods[this.props.method].cacheSend(
          ...Object.values(blockChainEntity)
        );
        setTransactionState("UPDATING_BLOCKCHAIN", formName);
        this.setState({ stackId: stackId });
      }
    }
  }

  updateFirebaseStorage(address) {
    const { setEntity, entity, resetFormState, formName, pdf } = this.props;
    resetFormState(formName);
    this.setState({ stackId: 99999 });
    entity.pdf_file = "";
    entity.address = address;
    entity.pdf = pdf[formName];
    setEntity(entity);
  }

  sendError(message) {
    this.setState({ message: message });
  }

  handleAddressResults() {
    const { entity, formName, addresses } = this.props;

    if (addresses[formName]) {
      if (addresses[formName].singleResult) {
        if (entity.pdf) {
          this.uploadPdf(entity);
          return;
        }
        this.updateBlockChain();
      } else {
        console.log("handle error");
      }
    }
  }

  componentWillUpdate(props) {
    const {
      transactions,
      transactionStack,
      formState,
      formName,
      event,
      resetFormState
    } = this.props;

    switch (formState[formName]) {
      case "FETCH_ADDRESS":
        this.handleAddressResults();
        break;

      case "PDF_UPLOADED":
        this.updateBlockChain();
        break;
      case "UPDATING_BLOCKCHAIN":
        if (
          (transactionStack.length > this.state.stackId) &
          (Object.keys(transactions).length > this.state.stackId)
        ) {
          let transactionResult =
            transactions[transactionStack[this.state.stackId]];
          if (!transactionResult) {
            return;
          }
          if (transactionResult.status !== "success") {
            return;
          }
          let eventValue = transactionResult.receipt.events[event];
          if (eventValue) {
            this.updateFirebaseStorage(eventValue.returnValues[0]);
          } else {
            this.sendError("rejected");
            this.setState({ stackId: 99999 });
            resetFormState(formName);
          }
        }
        break;
    }
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    const { userAccounts, label, formState, formName, addresses } = this.props;
    let result = "";

    return (
      <div>
        {formState[formName] && <ReactSpinner />}
        {addresses[formName] && addresses[formName].error && (
          <div>{addresses[formName].error}</div>
        )}
        {addresses[formName] && addresses[formName].multipleResults && (
          <FormControl>
            <Select
              value={this.state.location}
              onChange={this.handleChange("location")}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {addresses[formName].addresses.map(address => (
                <MenuItem value={address.location}>{address.address}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {this.state.message && <div>{this.state.message}</div>}
        <div>{result}</div>
        {userAccounts && userAccounts.length > 0 && (
          <Button color={"primary"} onClick={this.handleSubmit.bind(this)}>
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
    formState: state.inputForms.formTransactionState,
    changed: state.inputForms.changed,
    pdf: state.inputForms.pdf,
    pdfCode: state.inputForms.pdfCode,
    pdfMd5: state.inputForms.pdfMd5,
    addresses: state.inputForms.addresses
  };
};

SubmitOperation.contextTypes = {
  drizzle: PropTypes.object
};
const mapDispatchToProps = {
  setTransactionState,
  resetFormState,
  uploadPDF,
  fetchAddress
};

export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(SubmitOperation))