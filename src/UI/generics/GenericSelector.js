import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import { connect } from "react-redux";

class GenericSelector extends React.Component {
  handleChange = name => event => {
    this.props.setState({
      [name]: event.target.value
    });
  };

  render() {
    const {
      viewOnly,
      selectorValues,
      fieldKey,
      fieldValue,
      classes,
      noLabel,
      minWidth,
      required,
      path
    } = this.props;
    const selectedValue = this.props.state[fieldKey] || fieldValue;
    let formValues = selectorValues[path]
      ? selectorValues[path]
      : selectorValues[fieldKey];
    if (!formValues) {
      return <div></div>;
    }
    return (
      <div
        dir={this.props.direction}
        style={{
          minWidth: minWidth || 300,
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <form className={classes.root} autoComplete="off">
          <FormControl required={required} className={classes.selectorMargin}>
            <InputLabel
              htmlFor="age-customized-select"
              className={classes.bootstrapFormLabel}
            >
              {noLabel ? " " : this.props.t(fieldKey)}
            </InputLabel>
            <Select
              value={selectedValue || "none"}
              onChange={this.handleChange(fieldKey)}
              disabled={viewOnly}
            >
              <MenuItem value="none">
                <em>{this.props.t("")}</em>
              </MenuItem>
              {formValues.map(select => (
                <MenuItem classes={classes.menuItem} value={select.value}>
                  {this.props.t(select.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
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
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(GenericSelector)
);
