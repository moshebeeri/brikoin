import React, { useEffect, useReducer, useState } from "react";
import { withUser } from "../../UI/warappers/withUser";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withWidth from "@material-ui/core/withWidth";
import UserEntity from "../../UI/user/UserEntity";
import GenericTextField from "../../UI/generics/GenericTextField";
import Button from "@material-ui/core/Button";
import { addGroupRepresentative } from "../../redux/actions/groups";

export function GroupAddRepresntative(props) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    searchUser(props, search, setUsers);
  }, [search]);
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.group.name}</DialogTitle>
      <div
        dir={props.direction}
        style={{
          height: props.width === "xs" ? 600 : 300,
          width: props.width === "xs" ? 500 : 400,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            display: "flex",
            height: props.width === "xs" ? 120 : 55,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <div
            style={{
              display: "flex",
              boxShadow: "none"
            }}
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              alignContent="center"
              justify="center"
              spacing={8}
            >
              <Grid key="searchMessage-searchBar" item>
                <Typography
                  align={props.direction === "ltr" ? "left" : "right"}
                  variant="subtitle1"
                >
                  {props.t("addRepMsg")}
                </Typography>
              </Grid>

              <Grid key="SearchAddress-searchBar" item>
                <div
                  style={{
                    display: "flex",
                    marginBottom: 9,
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <GenericTextField
                    state={search}
                    textArea={false}
                    setState={setSearch}
                    t={props.t}
                    fieldKey={"searchText"}
                    fieldValue={search.searchText}
                    viewOnly={false}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        {users.map(user => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: 10,
              marginRight: 10,
              marginTop: 25
            }}
          >
            <UserEntity user={user} />

            <Button
              onClick={addRep.bind(this, props, user, setSearch, setUsers)}
              fullWidth
              variant="outlined"
            >
              {props.t("addRep")}
            </Button>
          </div>
        ))}
      </div>
    </Dialog>
  );
}

function addRep(props, user, setSearch, setUsers) {
  props.addGroupRepresentative(
    user.userId,
    props.group.id,
    props.group.creator
  );
  setSearch("");
  setUsers([]);
  props.close();
}

function searchUser(props, search, setUsers) {
  if (search.searchText && search.searchText.trim()) {
    let users = props.users.filter(user =>
      user.name.includes(search.searchText)
    );
    if (users.length > 0) {
      let members = Object.keys(props.group.members).map(
        memberKey => props.group.members[memberKey].userId
      );
      users = users.filter(user => members.includes(user.userId));
      setUsers(users);
      return;
    }
    setUsers([]);
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  addGroupRepresentative
};
export default withWidth()(
  withUser(connect(mapStateToProps, mapDispatchToProps)(GroupAddRepresntative))
);
