function string(value) {
  const type = typeof value;
  return type === "string";
}

function number(value) {
  const type = typeof value;
  return type === "number";
}

function boolean(value) {
  const type = typeof value;
  return type === "boolean";
}

function array(value) {
  return Array.isArray(value);
}

function object(value) {
  const type = typeof value;
  return type === "object" && !array(value);
}

function required(value) {
  const type = typeof value;
  let valid = value !== undefined && value !== null;
  if (valid && (type === "string" || type === "object")) {
    valid = Object.entries(value).length > 0;
  }
  return valid;
}

module.exports = {
  string,
  number,
  boolean,
  array,
  object,
  required: {
    string: value => required(value) && string(value),
    number: value => required(value) && number(value),
    boolean: value => required(value) && boolean(value),
    array: value => required(value) && array(value),
    object: value => required(value) && object(value)
  }
};
