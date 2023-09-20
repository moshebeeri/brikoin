import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTopHistory } from "../../redux/selectors/tradesSelector";
import Draggable from "react-draggable";
import ReactTable from "react-table";

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  cardDeveloper: {
    maxWidth: 400,
    position: "absolute",
    bottom: 0,
    right: 0
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

const columns = [
  {
    Header: "time",
    getHeaderProps: (state, rowInfo, column) => {
      return {
        style: {
          backgroundColor: "#e6f0ff"
        }
      };
    },
    width: 55,
    accessor: "time" // String-based value accessors!
  },
  {
    Header: "Rate",
    getHeaderProps: (state, rowInfo, column) => {
      return {
        style: {
          backgroundColor: "#e6f0ff"
        }
      };
    },
    width: 55,
    accessor: "price" // String-based value accessors!
  },
  {
    Header: "Volume",
    getHeaderProps: (state, rowInfo, column) => {
      return {
        style: {
          backgroundColor: "#e6f0ff"
        }
      };
    },
    width: 80,
    accessor: "size",
    Cell: props => <span className="number">{props.value}</span> // Custom cell components!
  },
  {
    Header: "Volume $",
    width: 80,
    getHeaderProps: (state, rowInfo, column) => {
      return {
        style: {
          backgroundColor: "#e6f0ff"
        }
      };
    },
    accessor: "volumeDollar"
  },
  {
    Header: "Change",
    accessor: "changeView",
    backgroundColor: "#555",
    width: 80,
    getProps: (state, rowInfo, column) => {
      if (rowInfo) {
        return {
          style: {
            color: rowInfo.row._original.change >= 0 ? "#5cd65c" : "red",
            fontWeight: "bold"
          }
        };
      }
      return {
        style: {}
      };
    },
    getHeaderProps: (state, rowInfo, column) => {
      return {
        style: {
          backgroundColor: "#e6f0ff"
        }
      };
    }
  }
];

class TradeHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      initial: false
    };
  }

  render() {
    const { topHistory, projectId } = this.props;

    return (
      <Draggable enableUserSelectHack={false}>
        <div>
          <din
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "space-between",
              flexDirection: "row",
              backgroundColor: "white",
              padding: 10,
              width: 500,
              height: 240,
              border: 10,
              borderColor: "gray"
            }}
          >
            <div style={{ marginRight: 5 }}>
              <div>Last Deals</div>
              <ReactTable
                defaultPageSize={5}
                data={projectId ? topHistory[projectId] : []}
                columns={columns}
                showPagination={false}
                showPaginationTop={false}
                showPaginationBottom={false}
                showPageSizeOptions={false}
                headerStyle={{ backgroundColor: "red" }}
              />
            </div>
          </din>
        </div>
      </Draggable>
    );
  }
}

const mapStateToProps = (state, props) => ({
  topHistory: getTopHistory(state, props),
  changed: state.trades.change
});

const mapDispatchToProps = {};
TradeHistory.contextTypes = {
  drizzle: PropTypes.object
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(TradeHistory)
);
