// returns true for an non empty object
exports.isEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
};

// returns entity by removing additional attached strings
exports.GetEntity = (entity) => {
  entity_with_param = entity.split('(');
  return entity_with_param[0];
};

// returns the columns and values for the insert query
exports.GetQueryParamString = (data) => {
  var queryString = '',
    count = 0;
  for (key in data) {
    if (data[key] !== "") {
      queryString =
        count !== Object.keys(data).length - 1
          ? queryString + key + "=" + data[key] + "&"
          : queryString + key + "=" + data[key];
      count++;
    }
  }
  if (queryString.charAt(queryString.length - 1) === "&") {
    queryString = queryString.substring(0, queryString.length - 1);
  }
  return queryString
};

// returns the columns and values for the insert query
exports.GetPostgresColumNames = (columns) => {
  columns = columns.split(",");
  var columnString = '';
  count = 0;
  for (column in columns) {
    if (columns[column].charAt(0) === " ") {
      columns[column] = columns[column].substring(1, columns[column].length);
    }
    count !== columns.length - 1 ?
      columnString += '"' + columns[column] + '",'
      :
      columnString += '"' + columns[column] + '"'
    count++;
  }
  return columnString
};