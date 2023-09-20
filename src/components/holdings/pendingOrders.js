/* eslint-disable no-multi-spaces */
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import numberUtils from "../../utils/numberUtils";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import withWidth from "@material-ui/core/withWidth";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import { reserveOrder, cancelReserveOrder } from "../../redux/actions/trade";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { NoFundDialog } from "../../UI/index";
const ProjectNameFormater = ({ value }) => {
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
      {name}
    </NavLink>
  );
};
import LoadingCircular from "../../UI/loading/LoadingCircular";
const ProjectTitleFormater = ({ value }) => (
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
const ColumFormater = col => {
  return (
    <Typography align="center" noWrap variant="h6">
      {col.column.title}
    </Typography>
  );
};
const ActionFormater = ({ value }) => {
  return value.title ? (
    <Button
      fullWidth
      variant="outlined"
      className={value.button}
      onClick={value.onClick.bind(this, value.project, value.id)}
    >
      {value.title}
    </Button>
  ) : (
    <div />
  );
};

const LabelFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);

const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);

const ProjectNameProvider = props => (
  <DataTypeProvider formatterComponent={ProjectNameFormater} {...props} />
);
const LabelFormaterProvider = props => (
  <DataTypeProvider formatterComponent={LabelFormater} {...props} />
);
const ActionFormaterProvider = props => (
  <DataTypeProvider formatterComponent={ActionFormater} {...props} />
);

const styles = theme => {
  return {
    button: {
      width: 100,
      height: 30
    },

    buttonSmall: {
      width: 40,
      height: 30
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  };
};
class PendingOrders extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { openDialog: false };
  }
  reserveOrder(project, id) {
    const { user, reserveOrder } = this.props;

    if (this.validateUserFunds(project)) {
      reserveOrder(user, project, id);
      this.setState(
        {
          loading: true
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false
            });
          }, 7000);
        }
      );
    } else {
      this.setState({
        openDialog: true,
        funds: this.getProjectReservedFund(project)
      });
    }
  }

  cancelReserveOrder(project, id) {
    const { user, cancelReserveOrder } = this.props;
    cancelReserveOrder(user, project, id);

    this.setState(
      {
        loading: true
      },
      () => {
        this.timer = setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 7000);
      }
    );
  }
  getProjectReservedFund(project) {
    const { projects } = this.props;

    const projectMaps = projects.reduce(function(map, obj) {
      map[obj.address] = obj;
      return map;
    }, {});
    const projectDetails = projectMaps[project];
    return projectDetails.reservedBid
      ? parseInt(projectDetails.reservedBid) / 1000000
      : 0;
  }

  closeNoFundDialog() {
    this.setState({
      openDialog: false,
      funds: 0
    });
  }

  validateUserFunds(project) {
    const { activeAccount, projects } = this.props;
    if (activeAccount.stonesBalance === 0) {
      return false;
    }
    const projectMaps = projects.reduce(function(map, obj) {
      map[obj.address] = obj;
      return map;
    }, {});
    const projectDetails = projectMaps[project];

    if (parseInt(projectDetails.reservedBid) > activeAccount.stonesBalance) {
      return false;
    }
    return true;
  }

  render() {
    const { classes } = this.props;
    const columnWidths = this.getColumWidths();
    const columns = this.getColumnTitles();
    const { userUnfundedPendingOrders, projects } = this.props;
    if (projects.length === 0) {
      return <div />;
    }
    const rows = Object.keys(userUnfundedPendingOrders)
      .map(project => {
        let row = userUnfundedPendingOrders[project]
          ? userUnfundedPendingOrders[project][0]
          : "";
        return row;
      })
      .filter(row => row);

    if (rows.length === 0) {
      return <div />;
    }
    const projectMaps = projects.reduce(function(map, obj) {
      map[obj.address] = obj;
      return map;
    }, {});
    const buttonClass =
      this.props.width === "xs" ? classes.buttonSmall : classes.button;
    const pendingRows = rows
      ? rows
          .filter(row => projectMaps[row.project])
          .map(row => {
            const link = `/projectsView/${row.project}`;
            return this.createTableRow(link, projectMaps, row, buttonClass);
          })
      : [];

    if (pendingRows.length === 0) {
      return <div />;
    }
    return this.createTable(pendingRows, columns, columnWidths);
  }

  createTableRow(link, projectMaps, row, buttonClass) {
    return {
      project: link + "##" + projectMaps[row.project].name,
      investingAmount: row.amount,
      investingPrice: row.price,
      action: {
        project: row.project,
        id: row.id,
        title: row.reserved ? this.props.t("cancel") : this.props.t("reserved"),
        button: buttonClass,
        onClick: row.reserved
          ? this.cancelReserveOrder.bind(this)
          : this.reserveOrder.bind(this)
      },
      status: row.orderApproved
        ? this.props.t("orderApproved")
        : row.reserved
        ? this.props.t("reserved")
        : this.props.t("pending")
    };
  }

  createTable(pendingRows, columns, columnWidths) {
    return (
      <div
        style={{
          marginTop: 16,
          marginBottom: 16,
          width: 320,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            marginRight: 10,
            marginTop: 5,
            marginLeft: 10,
            display: "flex",
            alignItems: "flex-start"
          }}
        >
          {" "}
          {this.props.t("pendingInvestments")}
        </div>
        <NoFundDialog
          t={this.props.t}
          funds={this.state.funds}
          handleClose={this.closeNoFundDialog.bind(this)}
          open={this.state.openDialog}
        />
        {this.state.loading && (
          <LoadingCircular
            open
            size={24}
            className={this.props.classes.buttonProgress}
          />
        )}
        <Paper
          style={{
            boxShadow: "none",
            borderWidth: 1,
            borderColor: "#e5e5e5",
            borderStyle: "solid"
          }}
        >
          <Grid rows={pendingRows} columns={columns}>
            <ProjectTypeProvider for={["investingAmount", "investingPrice"]} />
            <ProjectNameProvider for={["project"]} />

            <LabelFormaterProvider for={["status"]} />
            <ActionFormaterProvider for={["action"]} />
            <Table columnExtensions={columnWidths} />

            <TableHeaderRow contentComponent={ColumFormater} />
          </Grid>
        </Paper>
      </div>
    );
  }

  getColumnTitles() {
    return [
      { name: "project", title: "" },
      { name: "investingAmount", title: this.props.t("investAmount") },
      { name: "investingPrice", title: this.props.t("investPrice") },
      { name: "status", title: this.props.t("status") }
    ];
  }

  getColumWidths() {
    return this.props.width === "xs"
      ? [
          { columnName: "project", width: 60 },
          { columnName: "investingAmount", width: 60 },
          { columnName: "investingPrice", width: 60 },
          { columnName: "status", width: 60 }
        ]
      : [
          { columnName: "project", width: 250 },
          { columnName: "investingAmount", width: 200 },
          { columnName: "investingPrice", width: 200 },
          { columnName: "status", width: 150 }
        ];
  }
}

const mapStateToProps = (state, props) => ({
  userUnfundedPendingOrders: state.trades.userUnfundedPendingOrders,
  projects: getPopulatedProjects(state, props),
  activeAccount: state.userAccounts.activeAccount,
  change: state.trades.change,
  user: state.login.user
});
const mapDispatchToProps = {
  reserveOrder,
  cancelReserveOrder
};

PendingOrders.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withWidth()(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(PendingOrders)
  )
);
