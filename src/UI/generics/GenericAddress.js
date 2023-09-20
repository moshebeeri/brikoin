import React from "react";
import TextField from "@material-ui/core/TextField";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import { connect } from "react-redux";
import { findAddress, deleteAddress } from "../../redux/actions/address";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
class GenericAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = name => event => {
    if (event.target.value.length > 4) {
      this.props.findAddress(event.target.value, this.props.fieldKey);
    }
    this.props.setState({
      [name]: event.target.value
    });
  };

  setAddress(address) {
    const { fieldKey } = this.props;
    this.props.setState({
      [fieldKey]: address.address,
      [fieldKey + "LocationLat"]: address.location.lat,
      [fieldKey + "LocationLng"]: address.location.lng
    });
    this.props.deleteAddress(fieldKey);
  }
  componentDidMount() {
    const { fieldKey } = this.props;
    this.props.deleteAddress(fieldKey);
  }

  componentWillUnmount() {
    const { fieldKey } = this.props;
    this.props.deleteAddress(fieldKey);
  }

  render() {
    const {
      fieldKey,
      fieldValue,
      classes,
      viewOnly,
      noLabel,
      addresses
    } = this.props;
    return (
      <div style={{ width: 200, flex: 1 }}>
        <TextField
          id={fieldKey}
          label={noLabel ? "" : this.props.t(fieldKey)}
          className={classes.textField}
          value={
            this.props.state[fieldKey] ? this.props.state[fieldKey] : fieldValue
          }
          onChange={this.handleChange(fieldKey)}
          margin="normal"
          rowsMax="4"
          disabled={viewOnly}
          fullWidth
        />
        {addresses && addresses[fieldKey] && addresses[fieldKey].length > 0 && (
          <div
            style={{
              position: "fixed",
              zIndex: 20,
              width: 220,
              marginRight: 50
            }}
          >
            <Paper>
              <MenuList>
                {addresses[fieldKey].map(address => (
                  <MenuItem onClick={this.setAddress.bind(this, address)}>
                    {address.address}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  addresses: state.addressInput.list
});
const mapDispatchToProps = {
  findAddress,
  deleteAddress
};

export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(GenericAddress)
);
