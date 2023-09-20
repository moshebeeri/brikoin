import React from "react";
import PropTypes from "prop-types";

class ReadOperation extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = { request: this.props.request };
    if (context.drizzle && this.props.request[0]) {
      this.contracts = context.drizzle.contracts;
      this.dataKey = this.contracts[this.props.contract].methods[
        this.props.method
      ].cacheCall(...Object.values(this.props.request));
    }
  }

  componentDidUpdate() {
    const { request } = this.props;
    if (this.context.drizzle && request[0]) {
      this.contracts = this.context.drizzle.contracts;
      if (JSON.stringify(request) !== JSON.stringify(this.state.request)) {
        this.dataKey = this.contracts[this.props.contract].methods[
          this.props.method
        ].cacheCall(...Object.values(this.props.request));
        this.setState({ request: request });
      }
    }
  }

  render() {
    if (!this.props[this.props.contract]) {
      return <span>Loading...</span>;
    }
    // If the data isn't here yet, show loading
    if (!(this.dataKey in this.props[this.props.contract][this.props.method])) {
      return <span>Loading...</span>;
    }
    if (!this.props[this.props.contract].synced) {
      return <div>Syncing ...</div>;
    }
    // If the data is here, get it and display it
    const data = this.props[this.props.contract][this.props.method][
      this.dataKey
    ].value;
    return <div>{data}</div>;
  }
}

ReadOperation.contextTypes = {
  drizzle: PropTypes.object
};

export default ReadOperation;
