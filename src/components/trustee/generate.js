const trusteeFields = require(`./trustee.json`);

const toType = solidityType => {
  if (solidityType === "bytes32") {
    // console.log(`solidityType=${solidityType}->string`)
    return "string";
  } else if (solidityType === "uint256") {
    // console.log(`solidityType=${solidityType}->uint256`)
    return "number";
  }
};

const listItems = Object.keys(trusteeFields).map(field => {
  return (
    `<div style={{flex: 1}}>                         \n` +
    `<TextField label='${trusteeFields[field].name}'   \n` +
    `    id='${field}'                                    \n` +
    `    className={classes.textField}                    \n` +
    `    onChange={this.handleChange('${field}')}         \n` +
    `    margin='normal'                                  \n` +
    `    fullWidth                                        \n` +
    `    type='${toType(trusteeFields[field].type)}'   \n` +
    `  />                                                 \n` +
    `</div>                                               \n`
  );
});

listItems.map(item => console.log(item));
