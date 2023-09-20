import React from "react";
import { connect } from "react-redux";
import InvestDialog from "../investDialog/investDialog";
import SellingDialog from "../investDialog/sellingDialog";
import { withProjectTradesStats } from "../warappers/withProjectTradesStats";
import LoginDialog from "../login/loginDiialog";
import Button from "@material-ui/core/Button";
import MortgageInvest from "../../UI/investDialog/mortgageInvest";
import Card from "@material-ui/core/Card";

function GroupsActionDialog(props) {
  const { classes, project, order, user } = props;
  if (order && order.active) {
    return (
      <Card className={classes.investCard}>
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {
            <Button
              variant="outlined"
              fullWidth
              className={classes.button}
              onClick={redirectForTermSheet.bind(this, props)}
            >
              {props.t("buyGroup")}
            </Button>
          }
        </div>
        <MortgageInvest history={props.history} t={props.t} project={project} />
      </Card>
    );
  }
  return (
    <Card className={classes.investCard}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {user ? (
          <InvestDialog
            location={props.location}
            history={props.history}
            project={project}
            t={props.t}
          />
        ) : (
          <LoginDialog
            history={props.history}
            t={props.t}
            className={classes.button}
            variant
            buttonString={
              project.tradeMethod === "auction"
                ? props.t("placeBid")
                : props.t("buy")
            }
            title={props.t("pleaseLoginMessage")}
          />
        )}
        <div>
          <MortgageInvest
            history={props.history}
            t={props.t}
            project={project}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <SellingDialog
            location={props.location}
            history={props.history}
            t={props.t}
          />
        </div>
      </div>
    </Card>
  );
}

function redirectForTermSheet(props) {
  props.history.push(`/groups/${props.project.address}`);
}

const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};
const mapDispatchToProps = {};
export default withProjectTradesStats(
  connect(mapStateToProps, mapDispatchToProps)(GroupsActionDialog)
);
