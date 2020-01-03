const { isEmty } = require("./core/utils");

function string(value) {
  if (isEmty(value)) return true;
  const type = typeof value;
  return type === "string";
}

function number(value) {
  if (isEmty(value)) return true;
  const type = typeof value;
  return type === "number";
}

function boolean(value) {
  if (isEmty(value)) return true;
  const type = typeof value;
  return type === "boolean";
}

function array(value) {
  if (isEmty(value)) return true;
  return Array.isArray(value);
}

function object(value) {
  if (isEmty(value)) return true;
  const type = typeof value;
  return type === "object" && !array(value);
}

function required(value) {
  return !isEmty(value);
}

function validatorConcat(...validators) {
  return value => {
    const invalid = validators.find(validator => !validator(value));
    return isEmty(invalid);
  };
}

module.exports = {
  string,
  number,
  boolean,
  array,
  object,
  required: {
    string: validatorConcat(required, string),
    number: validatorConcat(required, number),
    boolean: validatorConcat(required, boolean),
    array: validatorConcat(required, array),
    object: validatorConcat(required, object)
  }
};
