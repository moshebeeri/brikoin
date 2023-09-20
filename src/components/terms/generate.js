const termsFields = require(`./terms.json`);

const toType = solidityType => {
  if (solidityType === "bytes32") {
    // console.log(`solidityType=${solidityType}->string`)
    return "string";
  } else if (solidityType === "uint256") {
    // console.log(`solidityType=${solidityType}->uint256`)
    return "number";
  }
};

const listItems = Object.keys(termsFields).map(field => {
  return (
    `<div style={{flex: 1}}>                         \n` +
    `<TextField label='${termsFields[field].name}'   \n` +
    `    id='${field}'                                    \n` +
    `    className={classes.textField}                    \n` +
    `    onChange={this.handleChange('${field}')}         \n` +
    `    margin='normal'                                  \n` +
    `    fullWidth                                        \n` +
    `    type='${toType(termsFields[field].type)}'   \n` +
    `  />                                                 \n` +
    `</div>                                               \n`
  );
});

listItems.map(item => console.log(item));
