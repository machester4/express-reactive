function isEmty(value) {
  let emty;
  if (typeof value === "object") {
    emty = Object.entries(value).length === 0;
  } else {
    emty = !!!value;
  }
  return emty;
}

/**
 * Validate client query consistency with query shape defined in server
 * @param {Object} shape
 * @param {Object} query
 */
function validIntegrity(shape, query) {
  const fields = Object.keys(shape);

  // if query fields pass types validation
  const invalidFields = fields.filter(field => !shape[field](query[field]));
  if (invalidFields.length > 0)
    return `the following fields ${invalidFields} are missing or have an incorrect type.`;
}

module.exports = {
  validIntegrity,
  isEmty
};
