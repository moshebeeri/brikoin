import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { invest } from "../../redux/actions/contractAbi";
import { SubmitOperation } from "../../UI/index";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import Button from "@material-ui/core/Button";
import { Collapse } from "react-collapse";
import MailSender from "./email";
import Bid from "./bid";
import MortgagerPayment from "./mortgagePayment";
import PayYield from "./payYield";
import DepositPayment from "./depositPayment";
import BrokerPayments from "./brokerPayments";
import DispositionUser from "./dispositionUser";
import TradeFeeManager from "./tradeFeesManegment";
import BrokerManagment from "./brokerManagment";
import AddOrganization from "./addOrganization";
import AssignProjectOrg from "./assignPrjectOrg";
import ClearFees from "./clearFees";
import MdExpandMore from '@material-ui/icons/ExpandMore';
import MdExpandLess from '@material-ui/icons/ExpandLess';

import FeesUser from "./feesUser";

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

// import * as React from 'react'
//
// const Project = ({ match }) => (
//   <div>
//     <h3>Project {match.params.projectId}</h3>
//   </div>
// )
// export default Project

class Developer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openMail: false,
      openRole: false,
      openDeposit: false,
      openSimpleTest: false,
      amount: "",
      accountId: "",
      setValue: "",
      estimatorAccountId: "",
      managerAccountId: ""
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  openRolesCollapse() {
    this.setState({ openRole: true });
  }

  closeRolesCollapse() {
    this.setState({ openRole: false });
  }

  render() {
    const { classes, invest } = this.props;
    return (
      <Draggable enableUserSelectHack={false}>
        <Card className={classes.cardDeveloper}>
          <h3>Admin Functions</h3>
          <CardContent>
            {this.state.openRole ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div>Roles Management</div>
                <Button
                  color={"primary"}
                  onClick={this.closeRolesCollapse.bind(this)}
                >
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
                <div>Roles Management</div>
                <Button
                  color={"primary"}
                  onClick={this.openRolesCollapse.bind(this)}
                >
                  <MdExpandLess />
                </Button>
              </div>
            )}
            {this.rolesManager(classes, invest)}
            <MailSender />
            <Bid />
            <DepositPayment />
            <PayYield />
            <MortgagerPayment />
            <DispositionUser />
            <BrokerManagment />
            <BrokerPayments />
            <FeesUser />
            <ClearFees />
            <TradeFeeManager />
            <AddOrganization />
            <AssignProjectOrg />
          </CardContent>
        </Card>
      </Draggable>
    );
  }

  rolesManager(classes, invest) {
    return (
      <Collapse isOpened={this.state.openRole}>
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
                label="Estimator AccountId"
                id="name"
                className={classes.textField}
                onChange={this.handleChange("estimatorAccountId")}
                margin="normal"
                fullWidth
                type="string"
                value={this.state.estimatorAccountId}
              />
            </div>
            <SubmitOperation
              label={"Add"}
              actionMethod={invest}
              contract="EstimationFactory"
              method="addEstimator"
              request={{ address: this.state.estimatorAccountId }}
            />
          </div>
        </form>
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
                label="Manager AccountId"
                id="name"
                className={classes.textField}
                onChange={this.handleChange("managerAccountId")}
                margin="normal"
                fullWidth
                type="string"
                value={this.state.managerAccountId}
              />
            </div>
            <SubmitOperation
              label={"Add"}
              actionMethod={invest}
              contract="ManagerFactory"
              method="addManager"
              request={{ address: this.state.managerAccountId }}
            />
          </div>
        </form>
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
                label="Trustee AccountId"
                id="name"
                className={classes.textField}
                onChange={this.handleChange("trusteeAccountId")}
                margin="normal"
                fullWidth
                type="string"
                value={this.state.trusteeAccountId}
              />
            </div>
            <SubmitOperation
              label={"Add"}
              actionMethod={invest}
              contract="TrusteeFactory"
              method="addTrustee"
              request={{ address: this.state.trusteeAccountId }}
            />
          </div>
        </form>
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
                label="Registrar AccountId"
                id="name"
                className={classes.textField}
                onChange={this.handleChange("registrarAccountId")}
                margin="normal"
                fullWidth
                type="string"
                value={this.state.registrarAccountId}
              />
            </div>
            <SubmitOperation
              label={"Add"}
              actionMethod={invest}
              contract="RegistrarFactory"
              method="addRegistrar"
              request={{ address: this.state.registrarAccountId }}
            />
          </div>
        </form>
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
                label="Terms AccountId"
                id="name"
                className={classes.textField}
                onChange={this.handleChange("termsAccountId")}
                margin="normal"
                fullWidth
                type="string"
                value={this.state.termsAccountId}
              />
            </div>
            <SubmitOperation
              label={"Add"}
              actionMethod={invest}
              contract="TermsFactory"
              method="addTerms"
              request={{ address: this.state.termsAccountId }}
            />
          </div>
        </form>
      </Collapse>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login.user,
  accounts: state.accounts,
  accountBalances: state.accountBalances,
  drizzleStatus: state.drizzleStatus,
  contracts: state.contracts,
  userAccounts: state.userAccounts.accounts,
  activeAccount: state.userAccounts.activeAccount,
  values: state.blockChainKeys.values
});
const mapDispatchToProps = {
  invest
};
Developer.contextTypes = {
  drizzle: PropTypes.object
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Developer)
);
