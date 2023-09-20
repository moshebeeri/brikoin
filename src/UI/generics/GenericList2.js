import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import withWidth from "@material-ui/core/withWidth";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";
import Group from "@material-ui/icons/Group";
import CollectionsBookmark from "@material-ui/icons/CollectionsBookmark";
import LegalDocument from "./LegalDocument";
import UserEntity from "../../UI/user/UserEntity";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import numberUtils from "../../utils/numberUtils";
import dateUtils from "../../utils/dateUtils";
import { NavLink } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  }
});

function CheckFormater(value) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14
      }}
    >
      {value === true ? (
        <CheckBoxIcon style={{ fontSize: 30 }} color="primary" />
      ) : (
        <CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />
      )}
    </div>
  );
}

function UserFormater(value) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        fontSize: 14
      }}
    >
      {value ? value.userId ? <UserEntity user={value} /> : value : ""}
    </div>
  );
}

function ButtonFormater(value) {
  let menuActions =
  value.menuActions.length > 0 && value.menuActions.filter(menu => !menu.hide).length > 0
      ? value.menuActions.map(action => {
          if (action.hide) {
            return <div />;
          }
          if (!action.action) {
            return <div />;
          }
          return (
            <MenuItem
              onClick={action.action.bind(
                this,
                value.menuOpenAction.bind(this, null)
              )}
              key={action.title}
            >
              {action.title}
            </MenuItem>
          );
        })
      : [];
  return (
    <div key={"tableActions"} style={{ display: "flex", flexDirection: "row" }}>
      {value.actions.map(action => {
        if (action.hide) {
          return <div />;
        }
        if (!action.action) {
          return <div />;
        }
        if (action.href) {
          return (
            <div
              key={action.title}
              style={{
                margin: 5,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                fontSize: 14
              }}
            >
              <Button fullWidth variant="outlined">
                <a href={action.action} target="_blank">
                  {action.title}
                </a>
              </Button>
            </div>
          );
        }
        // if(action.action)
        return (
          <div
            key={action.title}
            style={{
              margin: 5,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              fontSize: 14
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={action.action.bind(this, action.rowId)}
            >
              {action.title}
            </Button>
          </div>
        );
      })}

      {menuActions.length > 0 && (
        <div dir={value.direction}>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={value.menuOpenAction.bind(this)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={value.isMenuOpen}
            keepMounted
            open={Boolean(value.isMenuOpen)}
            onClose={value.menuOpenAction.bind(this, null)}
          >
            {menuActions}
          </Menu>
        </div>
      )}
    </div>
  );
}
function TextFormater(value) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        fontSize: 14
      }}
    >
      {value}
    </div>
  );
}

function NativeNumberFormater(value) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14
      }}
    >
      {numberUtils.formatNumber(value, 0)}
    </div>
  );
}

function NumberFormater(value) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14
      }}
    >
      {numberUtils.formatNumber(value, 2)}
    </div>
  );
}
function dateFormater(value) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14
      }}
    >
      {dateUtils.messageFormater(value)}
    </div>
  );
}
function fileDownLoadFormater(value) {
  if (value.category === "legalDocument") {
    return <LegalDocument documentId={value.documentId} icon={value.icon} />;
  }
  return (
    <a href={value.href} target="_blank">
      {!value.href ? (
        <Close color="secondary" />
      ) : value.icon ? (
        <CollectionsBookmark />
      ) : (
        value.href
      )}
    </a>
  );
}

function ActionnDeleteFormater(value) {
  <IconButton onClick={value.bind(this)} aria-label="Delete">
    <DeleteIcon />
  </IconButton>;
}
function linkFormater(value) {
  if (!value) {
    return <div />;
  }
  const link = value.substring(0, value.indexOf("##"));
  const name = value.substring(value.indexOf("##") + 2);
  return (
    <NavLink
      style={{
        textDecoration: "none",
        fontSize: 14
      }}
      to={link}
    >
      {name === "edit" ? (
        <Edit />
      ) : name === "add" ? (
        <Add />
      ) : name === "users" ? (
        <Group />
      ) : name === "documents" ? (
        <CollectionsBookmark />
      ) : (
        name
      )}
    </NavLink>
  );
}

function GenericList2(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.columns.map(col => (
              <TableCell align={props.direction === "ltr" ? "left" : "right"}>
                {col.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.finalRows.map((row, index) => {
            let newRows = props.columns.map(col => {
              return {
                namr: col.name,
                value: row[col.name],
                type: props.columnDescription[col.name].type
              };
            });
            return (
              <TableRow key={index}>
                {newRows.map(newRow => (
                  <TableCell
                    align={props.direction === "ltr" ? "left" : "right"}
                  >
                    {renderCell(newRow, props)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function renderCell(column, props) {
  switch (column.type) {
    case"text-translate":
      return TextFormater(props.t(column.value))
    case "redirectLink":
      return linkFormater(column.value);
    case "number":
      return NumberFormater(column.value);
    case "checkBox":
      return CheckFormater(column.value);
    case "date":
      return dateFormater(column.value);
    case "text":
      return TextFormater(column.value);
    case "nativeNumber":
      return NativeNumberFormater(column.value);
    case "user":
      return UserFormater(column.value);
    case "action":
      return ButtonFormater(column.value);
    case "fileDownload":
      return fileDownLoadFormater(column.value);
  }
  return <div></div>;
}

const mapStateToProps = (state, props) => ({
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {};
export default withWidth()(
  connect(mapStateToProps, mapDispatchToProps)(GenericList2)
);
