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
import {searchUser} from "./groupsUtils"
import Button from "@material-ui/core/Button";
import {inviteUser} from "./groupsUtils"
import LoadingCircular from "../../UI/loading/LoadingCircular";

export function GroupInvite(props) {
  const [search, setSearch] = useState("");
  const [inviting, setInviting] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    searchUserAction(props, search, setUsers);
  }, [search]);
  useEffect(() => {
    if(!inviting && search){
      setSearch("");
    }
  }, [inviting]);
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
          height: props.width === "xs" ? 300 : 350,
          width: props.width === "xs" ? 400 : 500,
          display: "flex",
          flexDirection: "column"
        }}
      >
      
            <Grid
              container
              direction="column"
              alignItems="center"
              alignContent="center"
              justify="center"
              spacing={0}
            >
              <Grid key="searchMessage-searchBar" item>
                <Typography
                  align={props.direction === "ltr" ? "left" : "right"}
                  variant="subtitle1"
                >
                  {props.t("searchUserMessage")}
                </Typography>
              </Grid>

              <Grid key="SearchAddress-searchBar" item>
                
                  <GenericTextField
                    state={search}
                    noLabel
                    textArea={false}
                    setState={setSearch}
                    t={props.t}
                    fieldKey={"searchText"}
                    fieldValue={search.searchText}
                    viewOnly={inviting}
                  />
              </Grid>
            </Grid>
          <div style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
             <LoadingCircular open={inviting}/>
         </div>
        {users.map(user => (
          <div
            style={{
              display: "flex",
              alignItems:'space-betwean',
              justifyContent:'space-betwean',
              flexDirection: "row",
              marginLeft: 10,
              marginRight: 10,
              marginTop: 25
            }}
          >
            <UserEntity user={user} />
            <div
            style={{
              width: 250,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start"
            }}
          >
            <Button
            onClick={invitePerson.bind(
              this,
              props,
              user,
              setUsers, 
              setInviting
            )}
              fullWidth
              disabled={inviting}
              className={props.classes.button}
              variant="outlined"
            >
            {props.t("invite")}
            </Button>
          </div>
            
          </div>
        ))}
      </div>
    </Dialog>
  );
}

async function invitePerson(props, user, setUsers, setInviting) {
  setInviting(true)
  await inviteUser(props.group.id, user.objectID);
  setInviting(false)
  setUsers([]);
  props.close()
}

async function searchUserAction(props, search, setUsers) {
  if (search.searchText && search.searchText.trim()) {
    let users = await searchUser(search.searchText)
    if (users.length > 0) {
      let members = Object.keys(props.group.members).map(
        memberKey => props.group.members[memberKey].userId
      );
      users = users.filter(user => !members.includes(user.userId));
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
};
export default withWidth()(
  withUser(connect(mapStateToProps, mapDispatchToProps)(GroupInvite))
);
