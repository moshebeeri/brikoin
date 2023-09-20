import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
    Header: "title",
    getHeaderProps: (state, rowInfo, column) => {
      return {
        style: { display: "none" }
      };
    },
    getProps: (state, rowInfo, column) => {
      if (rowInfo) {
        return {
          style: {
            backgroundColor: "#e6f0ff",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            display: "flex"
          }
        };
      }
      return {
        style: {}
      };
    },
    width: 140,
    accessor: "title" // String-based value accessors!
  },
  {
    Header: "Rate",
    getHeaderProps: (state, rowInfo, column) => {
      return {
        style: { display: "none" }
      };
    },
    getProps: (state, rowInfo, column) => {
      if (rowInfo) {
        if (rowInfo.row.title === "% change") {
          return {
            style: {
              color: rowInfo.row.rate > 0 ? "#5cd65c" : "red",
              fontWeight: "bold"
            }
          };
        }
      }
      return {
        style: {
          fontWeight: "bold"
        }
      };
    },
    width: 80,
    accessor: "rate" // String-based value accessors!
  }
];

class PropertyStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      initial: false
    };
  }

  render() {
    const { projectStats } = this.props;
    let data = [
      {
        title: "Estimation",
        rate: "-"
      },
      {
        title: "Target",
        rate: "-"
      }
    ];
    if (projectStats) {
      data = [
        {
          title: "Estimation",
          rate: projectStats.estimation ? projectStats.estimation : "-"
        },
        {
          title: "Target",
          rate: projectStats.target ? projectStats.target + "$" : "-"
        }
      ];
    }

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
              width: 240,
              height: 200,
              border: 10,
              borderColor: "gray"
            }}
          >
            <div style={{ marginRight: 5 }}>
              <div>Project stats</div>
              <ReactTable
                defaultPageSize={3}
                data={data}
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
  dailyStats: state.trades.dailyStats,
  changed: state.trades.change
});

const mapDispatchToProps = {};
PropertyStats.contextTypes = {
  drizzle: PropTypes.object
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PropertyStats)
);
