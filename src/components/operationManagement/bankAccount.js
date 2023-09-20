import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericForm } from "../../UI/index";
import { saveCase, listenCases } from "../../redux/actions/case";

import Typography from "@material-ui/core/Typography";
const styles = theme => {
  return {};
};

const BANK_DESCRIPTOR = {
  bankNumber: "text-number",
  bankBranch: "text-number",
  accountNumber: "text-number"
  // idPicture: 'webCap',
};

class BankAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  saveAccount(entity) {
    const { user, cases } = this.props;
    const caseId = this.getCaseId();
    const caseView = cases.filter(currentCase => currentCase.id === caseId);
    caseView[0].bankAccount = entity;
    let updatedEntity = {};
    updatedEntity.id = caseView[0].id;
    updatedEntity.bankAccount = entity;
    this.props.saveCase(user, updatedEntity);
    this.props.history.goBack();
  }

  render() {
    const { cases, loaded, direction } = this.props;
    if (!loaded) {
      return <div />;
    }
    const caseId = this.getCaseId();
    const caseView = cases.filter(currentCase => currentCase.id === caseId);

    return (
      <div
        style={{
          marginTop: "10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ width: 800 }}>
          <Typography
            aalign={direction === "ltr" ? "left" : "right"}
            variant="h4"
          >
            {this.props.t("Project Bank Account")}
          </Typography>
        </div>

        <div style={{ marginTop: 30 }}>
          {" "}
          <GenericForm
            entity={
              caseView && caseView[0] && caseView[0].bankAccount
                ? caseView[0].bankAccount
                : {}
            }
            t={this.props.t}
            entityDescriptor={BANK_DESCRIPTOR}
            save={this.saveAccount.bind(this)}
          />
        </div>
      </div>
    );
  }

  getCaseId() {
    return this.props.location.pathname.substring(19)
      ? this.props.location.pathname.substring(19)
      : "";
  }

  componentDidMount() {
    const { user, loaded } = this.props;
    if (user && !loaded) {
      // listenCases(user)
    }
  }
}

BankAccount.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  loggedIn: state.login.loggedIn,
  cases: state.cases.list,
  lang: state.userProfileReducer.lang,
  loaded: state.cases.loaded
});
const mapDispatchToProps = {
  saveCase
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(BankAccount)
);
