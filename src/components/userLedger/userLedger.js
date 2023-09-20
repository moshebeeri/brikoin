import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericList } from "../../UI/index";
import { types } from "../../redux/actions/genericList";
const styles = theme => {
  return {};
};

const LIST_DESCRIPTOR = {
  amount: { type: "number", width: 250 },
  projectAddress: { type: "text", width: 300 },
  date: { type: "date", width: 300 },
  isAdd: { type: "checkBox", width: 100 }
};

class Case extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { userLedger, user } = this.props;
    if (!user) {
      return <div />;
    }
    const listPath = "/server/users/" + user.uid + "/ledger";
    const rows = userLedger.map(row => {
      row.date = row.time * 1000;
      row.amount = row.amount / 1000000;
      return row;
    });
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <GenericList
          title={"My Ledger"}
          t={this.props.t}
          pageLength={10}
          saveTypeAction={types.SET_USER_LEDGER}
          sortBy={"time"}
          listPath={listPath}
          columnDescription={LIST_DESCRIPTOR}
          rows={rows}
        />
      </div>
    );
  }
}

Case.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  userLedger: state.userLedger.list,
  loaded: state.userLedger.loaded
});
const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Case)
);
