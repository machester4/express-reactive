function validQuery(shape, query) {
  const fields = Object.keys(shape);

  // if query have shame fields of shape
  const necessaryFields = fields.filter(field => !query[field]);
  if (necessaryFields.length > 0)
    return `the ${necessaryFields.join(
      ","
    )} fields are necessary in the query.`;

  // if query fields pass types validation
  const invalidFields = fields.filter(field => !shape[field](query[field]));
  if (invalidFields.length > 0)
    return `the ${invalidFields.join(",")} fields have an incorrect type.`;
}

module.exports = {
  validQuery
};
