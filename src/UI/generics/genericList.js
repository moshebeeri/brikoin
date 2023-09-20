import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import DeleteIcon from "@material-ui/icons/Delete";
import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";
import Group from "@material-ui/icons/Group";
import CollectionsBookmark from "@material-ui/icons/CollectionsBookmark";
import LegalDocument from "./LegalDocument";
import NavigateNext from "@material-ui/icons/NavigateNext";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import UserEntity from "../../UI/user/UserEntity";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import numberUtils from "../../utils/numberUtils";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getLastPage, getNextPage } from "../../redux/actions/genericList";
import { listenForPublicAccount } from "../../redux/actions/accounts";
import dateUtils from "../../utils/dateUtils";
import { NavLink } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import withWidth from "@material-ui/core/withWidth";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GenericList2 from "./GenericList2";
const CheckFormater = ({ value }) => (
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
const UserFormater = ({ value }) => (
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

const ButtonFormater = ({ value }) => {
  let menuActions =
    value.menuActions.length > 0
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
};
const TextFormater = ({ value }) => (
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
const NativeNumberFormater = ({ value }) => (
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
const NumberFormater = ({ value }) => (
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
const dateFormater = ({ value }) => (
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
const fileDownLoadFormater = ({ value }) => {
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
};
const ActionnDeleteFormater = ({ value }) => {
  <IconButton onClick={value.bind(this)} aria-label="Delete">
    <DeleteIcon />
  </IconButton>;
};
const linkFormater = ({ value }) => {
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
};
const ColumFormater = row => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const width = row.children
    .map(child =>
      child.props.tableColumn.width ? child.props.tableColumn.width : 0
    )
    .reduce(reducer);
  return (
    <tr
      style={{
        height: 48,
        display: "flex",
        outline: "none",
        flexDirection: "row",
        width: width,
        verticalAlign: "middle"
      }}
    >
      {row.children.map(child => {
        if (!child.props.tableColumn.width) {
          return <th key={"none"} />;
        }
        return (
          <th
            key={child.props.tableColumn.column.name}
            style={{
              width: child.props.tableColumn.width,
              display: "flex",
              scope: "col",
              colspan: "1",
              color: "#566070",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              margin: 10,
              fontSize: 12
            }}
          >
            {child.props.tableColumn.column.title}
          </th>
        );
      })}
    </tr>
  );
};
const UserProvider = props => (
  <DataTypeProvider formatterComponent={UserFormater} {...props} />
);
const ButtonProvider = props => (
  <DataTypeProvider formatterComponent={ButtonFormater} {...props} />
);
const CheckdProvider = props => (
  <DataTypeProvider formatterComponent={CheckFormater} {...props} />
);
const FileDownloadProvider = props => (
  <DataTypeProvider formatterComponent={fileDownLoadFormater} {...props} />
);
const LinkProvider = props => (
  <DataTypeProvider formatterComponent={linkFormater} {...props} />
);
const DateProvider = props => (
  <DataTypeProvider formatterComponent={dateFormater} {...props} />
);
const TextProvider = props => (
  <DataTypeProvider formatterComponent={TextFormater} {...props} />
);
const NumberProvider = props => (
  <DataTypeProvider formatterComponent={NumberFormater} {...props} />
);
const NativeNumberProvider = props => (
  <DataTypeProvider formatterComponent={NativeNumberFormater} {...props} />
);
const DeleteActtionProvider = props => (
  <DataTypeProvider formatterComponent={ActionnDeleteFormater} {...props} />
);
const styles = theme => {
  return {};
};

class GenericList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
  }

  createColumnWidth() {
    const { columnDescription } = this.props;
    let columns = Object.keys(columnDescription).map(columnKey => {
      return {
        columnName: columnKey,
        width: columnDescription[columnKey].width
      };
    });
    if (this.props.deleteAction) {
      columns.push({ columnName: "action", width: 60 });
    }
    return columns;
  }

  createColumnDefinition() {
    const { columnDescription } = this.props;
    let columns = Object.keys(columnDescription).map(columnKey => {
      if (
        (columnDescription[columnKey].type === "redirectLink" &&
          columnDescription[columnKey].edit) ||
        columnDescription[columnKey].noTitle === true
      ) {
        return { name: columnKey, title: "" };
      }
      return { name: columnKey, title: this.props.t(columnKey) };
    });
    if (this.props.deleteAction) {
      columns.push({ columnName: "action", width: 60 });
    }
    return columns;
  }

  filterColumnsByType(type) {
    const { columnDescription } = this.props;
    return Object.keys(columnDescription)
      .map(columnKey => {
        if (columnDescription[columnKey].type === type) {
          return columnKey;
        }
        return "";
      })
      .filter(column => column);
  }

  getDeleteActionColumns() {
    if (!this.props.deleteAction) {
    } else {
      return ["action"];
    }
    return [];
  }

  calculateRedirectValue(fieldKey, row) {
    const { columnDescription } = this.props;
    const value = columnDescription[fieldKey].labelField
      ? row[columnDescription[fieldKey].labelField]
      : row[fieldKey];
    if (columnDescription[fieldKey].icon) {
      return columnDescription[fieldKey].icon;
    }
    let viewValue =
      columnDescription[fieldKey].edit && row[fieldKey]
        ? "edit"
        : columnDescription[fieldKey].add
        ? columnDescription[fieldKey].valuePath &&
          row[fieldKey] &&
          row[fieldKey][columnDescription[fieldKey].valuePath]
          ? row[fieldKey][columnDescription[fieldKey].valuePath]
          : "add"
        : value;
    return viewValue;
  }

  actionMenuOpen(key, event) {
    if (event) {
      this.setState({
        [key]: event.currentTarget
      });
    } else {
      this.setState({
        [key]: null
      });
    }
  }

  createRow(row) {
    const { columnDescription, users } = this.props;
    let finalRow = {};
    Object.keys(columnDescription).forEach((fieldKey, index) => {
      if (!columnDescription[fieldKey]) {
        finalRow[fieldKey] = row[fieldKey];
        return;
      }
      if (columnDescription[fieldKey].type === "redirectLink") {
        let viewValue = this.calculateRedirectValue(fieldKey, row);
        let param = columnDescription[fieldKey].linkParam
          ? row[columnDescription[fieldKey].linkParam]
          : row[fieldKey];
        finalRow[fieldKey] =
          columnDescription[fieldKey].redirectLink + param + "##" + viewValue;
      } else {
        finalRow[fieldKey] = row[fieldKey];
      }
      if (columnDescription[fieldKey].type === "fileDownload") {
        finalRow[fieldKey] = {
          href: row[fieldKey],
          documentId: row[fieldKey],
          category: columnDescription[fieldKey].category,
          icon: columnDescription[fieldKey].icon
        };
      }
      if (columnDescription[fieldKey].type === "action") {
        finalRow[fieldKey] = { actions: {}, menuActions: {} };
        finalRow[fieldKey].direction = this.props.direction;
        finalRow[fieldKey].actions = columnDescription[fieldKey].actions.map(
          action => {
            let hide = false;
            if (row["hideActions"] && row["hideActions"].includes(action)) {
              hide = true;
            }
            let isHref =
              columnDescription[fieldKey].actionType &&
              columnDescription[fieldKey].actionType[action] === "href";
            return {
              hide: hide,
              href: isHref,
              title: this.props.t(action),
              action: row[action],
              rowId: row.id
            };
          }
        );
        if (columnDescription[fieldKey].menuActions) {
          finalRow[fieldKey].menuActions = columnDescription[
            fieldKey
          ].menuActions.map((action, index) => {
            let hide = false;
            if (row["hideActions"] && row["hideActions"].includes(action)) {
              hide = true;
            }
            let isHref =
              columnDescription[fieldKey].actionType &&
              columnDescription[fieldKey].actionType[action] === "href";
            return {
              hide: hide,
              href: isHref,
              title: this.props.t(action),
              action: row[action],
              rowId: row.id
            };
          });
          finalRow[fieldKey].menuOpenAction = this.actionMenuOpen.bind(
            this,
            "menuActions" + index
          );
          finalRow[fieldKey].isMenuOpen = this.state["menuActions" + index];
        }
        // finalRow[fieldKey] = {hide: hide, title: this.props.t(fieldKey), action: row[fieldKey]}
      }
      if (columnDescription[fieldKey].type === "text-translate") {
        finalRow[fieldKey] = this.props.t(row[fieldKey]);
      }
      if (columnDescription[fieldKey].type === "user") {
        if (users) {
          const user = this.props.users.filter(
            user => user.userId === row[fieldKey]
          );
          if (user.length > 0) {
            finalRow[fieldKey] = user[0];
          } else {
            finalRow[fieldKey] = row[fieldKey];
          }
        } else {
          finalRow[fieldKey] = row[fieldKey];
        }
      }
    });
    finalRow.action = this.props.deleteAction;
    return finalRow;
  }

  nextPage() {
    const {
      listPath,
      pageLength,
      saveTypeAction,
      getNextPage,
      sortBy,
      rows
    } = this.props;
    if (rows.length === pageLength) {
      getNextPage(
        listPath,
        pageLength,
        rows[0][sortBy],
        saveTypeAction,
        sortBy
      );
      this.setState({
        page: this.state.page + 1
      });
    }
  }

  lastPage() {
    const {
      listPath,
      pageLength,
      saveTypeAction,
      getLastPage,
      sortBy,
      rows
    } = this.props;
    const { page } = this.state;
    if (page > 0) {
      getLastPage(
        listPath,
        pageLength,
        rows[rows.length - 1][sortBy],
        saveTypeAction,
        sortBy
      );
      this.setState({
        page: this.state.page - 1
      });
    }
  }

  render() {
    const columnWidths = this.createColumnWidth();
    const columns = this.createColumnDefinition();
    const { rows } = this.props;
    if (!rows || (rows && rows.length === 0)) {
      return this.createTable([], columns, columnWidths);
    }
    let finalRows = rows.map(row => {
      return this.createRow(row);
    });
    if (this.props.sortBy) {
      finalRows = finalRows.sort(this.sort.bind(this));
    }
    return this.createTable(finalRows, columns, columnWidths);
  }

  sort(a, b) {
    return b[this.props.sortBy] - a[this.props.sortBy];
  }

  createTable(finalRows, columns, columnWidths) {
    // return <div style={{
    //   marginBottom: 16,
    //   marginTop: 20,
    //   minHeight: 400,
    //   backgroundColor: 'white',
    //   display: 'flex',
    //   flexDirection: 'column',
    //   alignItems: 'center',
    //   justifyContent: 'flex-start'
    // }}>

    //   <Paper style={{
    //     boxShadow: 'none',
    //     borderWidth: 1,
    //     borderColor: '#e5e5e5',
    //     maxWidth: this.props.width === 'xs' ? 300 : 1140,
    //     borderStyle: 'solid'
    //   }}>
    //     <div style={{
    //       marginRight: 10,
    //       marginTop: 5,
    //       marginLeft: 10,
    //       display: 'flex',
    //       alignItems: 'flex-start'
    //     }}>{this.props.t(this.props.title)}</div>
    //     <Grid
    //       rows={finalRows}
    //       columns={columns}
    //     >

    //       <DateProvider
    //         for={this.filterColumnsByType('date')}
    //       />
    //       <TextProvider
    //         for={this.filterColumnsByType('text')}
    //       />
    //       <NumberProvider
    //         for={this.filterColumnsByType('number')}
    //       />
    //       <LinkProvider
    //         for={this.filterColumnsByType('redirectLink')}
    //       />
    //       <NativeNumberProvider
    //         for={this.filterColumnsByType('nativeNumber')}
    //       />
    //       <CheckdProvider
    //         for={this.filterColumnsByType('checkBox')}
    //       />
    //       <UserProvider
    //         for={this.filterColumnsByType('user')}
    //       />
    //       <ButtonProvider
    //         for={this.filterColumnsByType('action')}
    //       />
    //       <DeleteActtionProvider
    //         for={this.getDeleteActionColumns()}
    //       />
    //       <FileDownloadProvider
    //         for={this.filterColumnsByType('fileDownload')}
    //       />

    //       <Table
    //         columnExtensions={columnWidths}
    //       />
    //       <TableHeaderRow rowComponent={ColumFormater}/>

    //     </Grid>
    //   </Paper>
    //   <div style={{display: 'flex', flexDirection: 'row'}}>
    //     {this.props.listPath && this.state.page > 0 && <IconButton onClick={this.lastPage.bind(this)}>
    //       <NavigateBefore style={{fontSize: 20}}/>
    //     </IconButton>}
    //     {this.props.listPath && finalRows.length === this.props.pageLength &&
    //     <IconButton onClick={this.nextPage.bind(this)}>
    //       <NavigateNext style={{fontSize: 20}}/>
    //     </IconButton>}
    //   </div>
    return (
      <GenericList2 columns={columns} finalRows={finalRows} {...this.props} />
    );
    // </div>
  }

  componentDidMount() {
    const {
      listPath,
      pageLength,
      saveTypeAction,
      getNextPage,
      sortBy,
      listenForPublicAccount
    } = this.props;
    if (listPath) {
      getNextPage(listPath, pageLength, "", saveTypeAction, sortBy);
    }
    listenForPublicAccount();
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {
  getNextPage,
  getLastPage,
  listenForPublicAccount
};
export default withWidth()(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(GenericList))
);
