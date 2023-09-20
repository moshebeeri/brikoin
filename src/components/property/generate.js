const propertyFields = require(`./property.json`);

const toType = solidityType => {
  if (solidityType === "bytes32") {
    // console.log(`solidityType=${solidityType}->string`)
    return "string";
  } else if (solidityType === "uint256") {
    // console.log(`solidityType=${solidityType}->uint256`)
    return "number";
  } else if (solidityType === "address") {
    // console.log(`solidityType=${solidityType}->uint256`)
    return "search";
  } else if (solidityType === "address[]") {
    // console.log(`solidityType=${solidityType}->uint256`)
    return "range";
  }
};

const listItems = Object.keys(propertyFields).map(field => {
  return (
    `<div style={{flex: 1}}>                         \n` +
    `<TextField label='${propertyFields[field].name}'     \n` +
    `    id='${field}'                                    \n` +
    `    className={classes.textField}                    \n` +
    `    onChange={this.handleChange('${field}')}         \n` +
    `    margin='normal'                                  \n` +
    `    fullWidth                                        \n` +
    `    type='${toType(propertyFields[field].type)}'     \n` +
    `  />                                                 \n` +
    `</div>                                               \n`
  );
});

listItems.map(item => console.log(item));
