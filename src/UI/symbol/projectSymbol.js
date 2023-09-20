import React from "react";
import { connect } from "react-redux";

class ProjectSymbol extends React.Component {
  state = { expanded: false, estimationExpanded: false, pageNumber: 1 };

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    const { symbol, direction } = this.props;
    return (
      <div
        style={{
          display: "flex",
          marginRight: direction === "ltr" ? 10 : 0,
          marginLeft: direction === "ltr" ? 0 : 10,
          width: 35,
          height: 20,
          fontSize: 14,
          backgroundColor: "#004466",
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexDirection: "column"
        }}
      >
        {symbol}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    direction: state.userProfileReducer.direction
  };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSymbol);
