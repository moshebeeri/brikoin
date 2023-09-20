const toType = solidityType => {
  if (solidityType === "byte32") {
    return "string";
  } else if (solidityType === "uint256") {
    return "number";
  }
};

export { toType };
