import React from "react";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import LoginDialog from "../login/loginDiialog";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import SingleApartmentDialog from "./singleApartmentDialog";
import GroupsActionDialog from "./groupsActionDialog";
import ProjectNewActions from "./projectNewActions"
import OfficeActionDialog from "./officeActionDialog";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import {
  cancelOrder,
  cancelOrderExternal,
  trade,
  tradeExternalRequest
} from "../../redux/actions/trade";

function ProjectActions(props) {
  const { project } = props;
  if (!project) {
    return <div />;
  }

  if (project.type === "parentProject") {
    return <div />;
  }
  if(project.flowType && project.flowType !== 'standartOffice' && project.flowType !== 'office' ){
    return <ProjectNewActions
    project={project}
    t={props.t}
    history={props.history}x
    location={props.location}
  />
  }
  if (project.structure === "SingleApartment") {
    return apartmentAction(props);
  }
  if (project.tradeMethod === "GROUP") {
    return (
      <GroupsActionDialog
        project={project}
        t={props.t}
        history={props.history}
        location={props.location}
      />
    );
  }
  return officeAction(props);
}

function officeAction(props) {
  const { user, classes } = props;
  return (
    <Card className={classes.investCardOrder}>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            borderWidth: 5,
            borderColor: "red",
            flexDirection: "row"
          }}
        >
          {user ? (
            <OfficeActionDialog
              location={props.location}
              history={props.history}
              t={props.t}
            />
          ) : (
            <LoginDialog
              history={props.history}
              t={props.t}
              className={classes.fundButton}
              variant
              buttonString={props.t("placeOffer")}
              title={props.t("pleaseLoginMessage")}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

function apartmentAction(props) {
  const { user, classes, project, order } = props;
  return (
    <Card className={classes.investCardOrder}>
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            borderWidth: 5,
            borderColor: "red",
            flexDirection: "row"
          }}
        >
          {user ? (
            <SingleApartmentDialog
              history={props.history}
              order={order}
              project={project}
              t={props.t}
            />
          ) : (
            <LoginDialog
              history={props.history}
              t={props.t}
              className={classes.fundButton}
              variant
              buttonString={props.t("placeOffer")}
              title={props.t("pleaseLoginMessage")}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  topAsks: state.trades.topAsks,
  userProjectPosition: state.trades.userProjectPosition,
  activeAccount: state.userAccounts.activeAccount,
  update: state.userAccounts.update,
  lang: state.userProfileReducer.lang,
  user: state.login.user
});
const mapDispatchToProps = {
  trade,
  tradeExternalRequest,
  cancelOrder,
  cancelOrderExternal
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(ProjectActions)
);
