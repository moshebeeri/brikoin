import React from "react";
import withWidth from "@material-ui/core/withWidth";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withCusomeStyle } from "../warappers/withCusomeStyle";

function GenericCheckBox(props) {
  const { fieldKey, fieldValue, direction } = props;
  const value = fieldValue;
  return (
    <div
      style={{
        width: 280,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }}
    >
      <div
        style={{
          marginRight: direction === "rtl" ? 0 : 50,
          marginLeft: direction === "rtl" ? 50 : 0
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={handleChangeCheckBox.bind(this, props)}
              value="true"
            />
          }
          label={props.t(fieldKey)}
        />
      </div>
    </div>
  );
}

function handleChangeCheckBox(props, name, value) {
  props.setState({
    [props.fieldKey]: value
  });
}
// class GenericCheckBox extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {}
//   }
//
//   handleChange = name => event => {
//     this.setState({
//       [name]: event.target.value
//     })
//   }
//   handleChangeCheckBox = (name, value) => event => {
//     const nameState = Object.keys(this.props.state).filter(key => key === name)
//     this.props.setState({
//       [name]: nameState.length === 0 ? !value : !this.state[name],
//       [name + '_cleared']: true
//     })
//   }
//
//   render () {
//     const {fieldKey, fieldValue, direction} = this.props
//     const value = this.props.state[fieldKey + '_cleared'] ? this.props.state[fieldKey] : fieldValue
//     return <div style={{
//       width: 280,
//       display: 'flex',
//       alignItems: 'flex-start',
//       justifyContent: 'flex-start'
//     }}>
//       <div style={{marginRight: direction === 'rtl' ? 0 : 50, marginLeft: direction === 'rtl' ? 50 : 0}}>
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={value}
//               onChange={this.handleChangeCheckBox(fieldKey, fieldValue)}
//               value='true'
//             />
//           }
//           label={this.props.t(fieldKey)}
//         />
//       </div>
//     </div>
//   }
// }

export default withWidth()(withCusomeStyle(GenericCheckBox));
