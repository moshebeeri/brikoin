import React from "react";
import withWidth from "@material-ui/core/withWidth";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DateTimePicker from "react-datetime-picker";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import Typography from "@material-ui/core/Typography";

class GenericDateTimePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = fieldValue => {
    const { fieldKey } = this.props;
    console.log(fieldValue);
    this.props.setState({ [fieldKey]: new Date(fieldValue.getTime()) });
  };

  render() {
    const { fieldKey, fieldValue } = this.props;
    const date =
      typeof fieldValue === "number" ? new Date(fieldValue) : fieldValue;
    return (
      <div style={{ width: 280, flex: 1, marginTop: 25 }}>
        <FormControlLabel
          control={
            <div dir={"ltr"}>
              <DateTimePicker
                value={date}
                locale={"IL"}
                onChange={this.onChange}
              />
            </div>
          }
          labelPlacement="start"
          label={
            <Typography style={{ fontSize: "1.2rem", margin: 10 }}>
              {this.props.t(fieldKey)}:
            </Typography>
          }
        />
      </div>
    );
  }
}

export default withWidth()(withCusomeStyle(GenericDateTimePicker));
