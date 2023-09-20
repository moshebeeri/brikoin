import React, { useEffect, useReducer, useState } from "react";
import { withUser } from "../../UI/warappers/withUser";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import withWidth from "@material-ui/core/withWidth";
import { GenericForm } from "../../UI/index";
import {createGroup } from "./groupsUtils"
import LoadingCircular from "../../UI/loading/LoadingCircular";

const GROUP_CREATOR = {
  groupName: "text",
  type: "selector"
};
const SELECTORS = {
  type: [
    { label: "OpenGroup", value: "OPEN" },
    { label: "ClosedGroup", value: "CLOSED" }
  ]
};

export function GroupCreate(props) {
  const [creatingGroup, setCreatingGroup] = useState(false);

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.t("createGroup")}</DialogTitle>
      <div
        dir={props.direction}
        style={{
          height: props.width === "xs" ? 600 : 300,
          width: props.width === "xs" ? 500 : 400,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <div style={{ width: 320 }}>
          <GenericForm
            mandatoryFields={["groupName", "type"]}
            buttonTitle={"createGroup"}
            entity={{}}
            t={props.t}
            selectorValues={SELECTORS}
            entityDescriptor={GROUP_CREATOR}
            save={createGroupAction.bind(this, props, setCreatingGroup)}
          />
          {creatingGroup && <LoadingCircular open/>}
        </div>
      </div>
    </Dialog>
  );
}

async function createGroupAction(props, setCreatingGroup, entity) {
  setCreatingGroup(true)
   await createGroup( {
    userId: props.user.uid,
    type: entity.type,
    project: props.project.address,
    name: entity.groupName
   }
  );
  setCreatingGroup(false)
  props.close();
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
};
export default withWidth()(
  withUser(connect(mapStateToProps, mapDispatchToProps)(GroupCreate))
);
