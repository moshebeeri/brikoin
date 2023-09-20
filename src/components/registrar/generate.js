const registrarFields = require(`./registrar.json`);

const toType = solidityType => {
  if (solidityType === "bytes32") {
    // console.log(`solidityType=${solidityType}->string`)
    return "string";
  } else if (solidityType === "uint256") {
    // console.log(`solidityType=${solidityType}->uint256`)
    return "number";
  }
};

const listItems = Object.keys(registrarFields).map(field => {
  return (
    `<div style={{flex: 1}}>                         \n` +
    `<TextField label='${registrarFields[field].name}'   \n` +
    `    id='${field}'                                    \n` +
    `    className={classes.textField}                    \n` +
    `    onChange={this.handleChange('${field}')}         \n` +
    `    margin='normal'                                  \n` +
    `    fullWidth                                        \n` +
    `    type='${toType(registrarFields[field].type)}'   \n` +
    `  />                                                 \n` +
    `</div>                                               \n`
  );
});

listItems.map(item => console.log(item));
