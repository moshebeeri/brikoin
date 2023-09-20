import React, { useEffect, useReducer, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import withWidth from "@material-ui/core/withWidth";
import { withRouter } from "react-router-dom";
import { config } from "../../conf/config";
import { NavLink } from "react-router-dom";
import { LanguageSelector, LoginDialog, UserAvatar } from "../../UI/index";
import NotificationsHeader from "./headerNotifications";
import EmailVerifiedMessage from "./emailVerifedMessage";
import Divider from "@material-ui/core/Divider";
import { withUserLedger } from "../../UI/warappers/withUserLedger";
import { showMyLoans } from "../../redux/selectors/tradesSelector";
import SearchBar from "../searchBar/searchBar";
import { withStyles } from "@material-ui/core/styles";
import numberUtils from "../../utils/numberUtils";
import UserBalance from "./userBalance"
import  homeBackground from "../../assets/brikoinHome.jpeg";
import {
  getAccounts,
  listenForAccount,
  setActiveAccount
} from "../../redux/actions/accounts";
import { login, logout, syncUserState } from "../../redux/actions/login";
import { getMortgages, listenForMortgage } from "../../redux/actions/mortgage";
import logo from '../../assets/logo.png';
import whiteLogo from '../../assets/whiteLogo.png';
const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: '#ebedf0',
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

function AppHeader(props) {
  const { classes, activeAccount, user, mortgages, admin } = props;
  const [anchorEl, setEnchorEl] = useState("");
  useEffect(() => {
    if (user) {
      props.syncUserState(user);
      props.listenForAccount(user);
    }
  }, [user]);
  if (!props.location || props.location.pathname.indexOf("singleProject") > 0) {
    return <div />;
  }
  const {pathname} = props.location;
  let headerStyle = pathname === ('/') ? {backgroundImage:`url(${homeBackground})` } :  {backgroundColor:`white` }
  let fontColor = pathname === ('/') ?  'white' : 'black'
  return (
    <div className={classes.appHeader}>
      <AppBar position="fixed" style={headerStyle}>
        {createMenu(
          user,
          classes,
          anchorEl,
          activeAccount,
          mortgages,
          props,
          setEnchorEl,
          fontColor
        )}
      </AppBar>
    </div>
  );
}

function createMenu(
  user,
  classes,
  anchorEl,
  activeAccount,
  mortgages,
  props,
  setEnchorEl,
  fontColor
) {
  return (
    <Toolbar>
      <div style={{width:'100%', display:'flex', alignItems: "center",
      justifyContent: "space-between", flexDirection:'row'}}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >

        <div style={{display:'flex', flexDirection:'row'}}>
        { fontColor === 'white' && <div style={{width: 10}}></div>}
          <IconButton
            onClick={redirectToHome.bind(this, props)}
            className={classes.menuButton}
            color="default"
          >
            <img style={{ width: fontColor === 'white' ? 30 : 50 }} src={fontColor === 'white' ? whiteLogo : logo } />
          </IconButton>
          {(props.width === "xs" || (user && user.admin)) && (
            <IconButton
              onClick={handleClick.bind(this, setEnchorEl)}
              className={classes.menuButton}
              color="default"
              aria-label="Menu"
            >
              <MenuIcon  color="primary" style={{color: fontColor}}/>
            </IconButton>
          )}
          
          {(props.width === "xs" || (user && user.admin)) &&
            popupMenu(
              anchorEl,
              user,
              mortgages,
              activeAccount,
              props,
              setEnchorEl,
            )}
            </div>
          
            <div style={{display:'flex', flexDirection:'row'}}>
          {props.width !== "xs" && (
            <NavLink
              style={{
                textDecoration: "none",
                color: fontColor,
                marginLeft: 10,
                marginRight: 10,
                fontSize: 16
              }}
              
              to="/projects"
            >
              <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
                {props.t("projects")}
              </StyledMenuItem>
            </NavLink>
          )}
         
          {user &&
            props.width !== "xs" &&
            user &&
            user.emailVerified &&
            props.loggedIn && (
              <NavLink
                style={{
                  textDecoration: "none",
                  color: fontColor,
                  marginRight: 10
                }}
                to="/operationHubList"
              >
                <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
                  {props.t("operationHub")}
                </StyledMenuItem>
              </NavLink>
            )}

            {user &&
              props.width !== "xs" &&
              user &&
              user.emailVerified &&
              props.loggedIn && (
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: fontColor,
                    marginRight: 10
                  }}
                  to="/propertyLoader"
                >
                  <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
                    {props.t("propertyLoader")}
                  </StyledMenuItem>
                </NavLink>
              )}
            {user &&
              props.width !== "xs" &&
              user &&
              user.emailVerified &&
              props.loggedIn && (
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: fontColor,
                    marginRight: 10
                  }}
                  to="/myGroups"
                >
                  <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
                    {props.t("myGroups")}
                  </StyledMenuItem>
                </NavLink>
              )}
           
          {user &&
            props.width !== "xs" &&
            user &&
            user.emailVerified &&
            props.loggedIn && (
              <NavLink
                style={{
                  textDecoration: "none",
                  color: fontColor,
                  marginRight: 10
                }}
                to="/holdings"
              >
                <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
                  {props.t("myHoldings")}
                </StyledMenuItem>
              </NavLink>
            )}
          {user &&
            props.width !== "xs" &&
            (user.lawyer || user.trustee) &&
            props.loggedIn && (
              <NavLink
                style={{
                  textDecoration: "none",
                  color: fontColor,
                  marginRight: 10
                }}
                to="/operationManagement"
              >
                <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
                  {props.t("operations")}
                </StyledMenuItem>
              </NavLink>
            )}
            </div>
          {/*<DispositionMessage />*/}
          <EmailVerifiedMessage />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <LanguageSelector t={props.t} />
          <NotificationsHeader
          locationPath={window.location.pathname}
          t={props.t}
        />
          {user &&
            user.emailVerified &&
            props.loggedIn &&
            activeAccount &&
            <UserBalance t={props.t} user={user} fontColor={fontColor}/>
          }         
          {loginLogout(props)}
        </div>

        </div>
    </Toolbar>
  );
}

function handleClose(setEnchorEl) {
  setEnchorEl("");
}

function handleClick(setEnchorEl, event) {
  setEnchorEl(event.currentTarget);
}

function popupMenu(
  anchorEl,
  user,
  mortgages,
  activeAccount,
  props,
  setEnchorEl, 
) {
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose.bind(this, setEnchorEl)}
    >
      <NavLink
        style={{
          textDecoration: "none",
          color: "black",
          marginLeft: 10,
          marginRight: 10,
          fontSize: 16
        }}
        to="/projects"
      >
    
        <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
          {props.t("projects")}
        </StyledMenuItem>
      </NavLink>
      <Divider />
      {user && user.emailVerified && props.loggedIn && (
          <NavLink
            style={{
              textDecoration: "none",
              color: "black",
              marginRight: 10
            }}
            to="/myGroups"
          >
            <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
              {props.t("myGroups")}
            </StyledMenuItem>
          </NavLink>
        )}
      {user && user.emailVerified && props.loggedIn && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginRight: 10
          }}
          to="/holdings"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("myHoldings")}
          </StyledMenuItem>
        </NavLink>
      )}
      {/*{user && user.emailVerified && props.loggedIn && <NavLink style={{*/}
      {/*textDecoration: 'none',*/}
      {/*color: 'black',*/}
      {/*marginRight: 10*/}
      {/*}} to='/myLoans'><StyledMenuItem*/}
      {/*onClick={handleClose.bind(this, setEnchorEl)}>{props.t('myLoans')}</StyledMenuItem></NavLink>}*/}
      {user && user.emailVerified && props.loggedIn && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginRight: 10
          }}
          to="/operationHubList"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("operationHub")}
          </StyledMenuItem>
        </NavLink>
      )}

      {mortgages &&
        mortgages.length > 0 &&
        user &&
        user.emailVerified &&
        props.loggedIn && (
          <NavLink
            style={{
              textDecoration: "none",
              color: "black",
              marginRight: 10
            }}
            to="/mortgages"
          >
            <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
              {props.t("myMortgages")}
            </StyledMenuItem>
          </NavLink>
        )}
      {user && user.emailVerified && props.loggedIn && activeAccount.broker && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginRight: 10
          }}
          to="/fees"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("fees")}
          </StyledMenuItem>
        </NavLink>
      )}

      {user && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginLeft: 10,
            marginRight: 10,
            fontSize: 16
          }}
          to="/operationOwnedAsset"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("ownedAssets")}
          </StyledMenuItem>
        </NavLink>
      )}
      {user && (user.lawyer || user.trustee) && props.loggedIn && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginRight: 10
          }}
          to="/operationManagement"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("operations")}
          </StyledMenuItem>
        </NavLink>
      )}
      {user && user.emailVerified && props.loggedIn && activeAccount.broker && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginRight: 10
          }}
          to="/fees"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("fees")}
          </StyledMenuItem>
        </NavLink>
      )}
      {user && user.lawyer && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginLeft: 10,
            marginRight: 10,
            fontSize: 16
          }}
          to="/operationLawyerManagement"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("operationsLawyer")}
          </StyledMenuItem>
        </NavLink>
      )}

      {user && user.admin && <Divider />}
      {user && user.admin && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginRight: 10,
            fontSize: 16
          }}
          to="/mortgage"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("mortgage")}
          </StyledMenuItem>
        </NavLink>
      )}

      {user && user.emailVerified  && props.loggedIn && (
        <NavLink
          style={{
            textDecoration: "none",
            color: "black",
            marginRight: 10
          }}
          to="/propertyLoader"
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("propertyLoader")}
          </StyledMenuItem>
        </NavLink>
      )}

      {props.loggedIn && user && user.admin && (
        <NavLink
          to="/adminManageProjects"
          activeStyle={{ textDecoration: "none" }}
          style={{
            textDecoration: "none"
          }}
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("Manasge Projects")}
          </StyledMenuItem>
        </NavLink>
      )}
      {props.loggedIn && user && user.admin && (
        <NavLink
          to="/adminRoles"
          activeStyle={{ textDecoration: "none" }}
          style={{
            textDecoration: "none"
          }}
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("Manasge Role")}
          </StyledMenuItem>
        </NavLink>
      )}
      {props.loggedIn && user && user.admin && (
        <NavLink
          to="/admin"
          activeStyle={{ textDecoration: "none" }}
          style={{
            textDecoration: "none"
          }}
        >
          <StyledMenuItem onClick={handleClose.bind(this, setEnchorEl)}>
            {props.t("Admin")}
          </StyledMenuItem>
        </NavLink>
      )}
    </Menu>
  );
}

function redirectToHome(props) {
  props.history.push("/");
}

// function userBalance(props, fontColor) {
//   const { totalBalance } = props;
//   return (
//     <div
//       style={{
//         color:fontColor,
//         marginLeft: 10,
//         marginRight: 10,
//         flex: "display",
//         flexDirection: "colummn"
//       }}
//     >
//       <div style={{ marginTop: 20 }}>{props.t("balance")}</div>
//       <div>{numberUtils.formatNumber(totalBalance, 2)}</div>
//     </div>
//   );
// }

function feeBalance(admin, props) {
  return (
    <div style={{ color: "black", flex: "display", flexDirection: "colummn" }}>
      <div style={{ marginTop: 20, marginRight: 5, marginLeft: 5 }}>
        {props.t("totalFees")}
      </div>
      {admin.totalFees && (
        <div>
          {numberUtils.formatNumber(admin.totalFees / config.stoneRatio, 2)}
        </div>
      )}
    </div>
  );
}

function loginLogout(props) {
  return (
    <div>
      {!props.loggedIn && <LoginDialog cookies={props.cookies} history={props.history} t={props.t} />}
      {props.loggedIn && <UserAvatar t={props.t} history={props.history} />}
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  loggedIn: state.login.loggedIn,
  user: state.login.user,
  showMyLoan: showMyLoans(state, props),
  mortgages: state.mortgage.myMortgages,
  admin: state.userAccounts.admin,
  activeAccount: state.userAccounts.activeAccount,
  update: state.userAccounts.update,
  language: state.userProfileReducer.lang,
  values: state.blockChainKeys.values
});
const mapDispatchToProps = {
  syncUserState,
  listenForAccount
};
export default withWidth()(
  withRouter(
    withUserLedger(connect(mapStateToProps, mapDispatchToProps)(AppHeader))
  )
);
