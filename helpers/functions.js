// returns the columns and values for the insert query
exports.GetInsertionColumnsAndValues = (data) => {
  var columns = "",
    Values = "",
    count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      columns =
        count !== Object.keys(data).length - 1
          ? columns + key + ","
          : columns + key;
      Values =
        count !== Object.keys(data).length - 1
          ? typeof data[key] === "string"
            ? Values + "'" + data[key] + "'" + ","
            : Values + data[key] + ","
          : typeof data[key] === "string"
            ? Values + "'" + data[key] + "'"
            : Values + data[key];
      count++;
    }
  }
  if (columns.charAt(columns.length - 1) === ",") {
    columns = columns.substring(0, columns.length - 1);
  }
  if (Values.charAt(Values.length - 1) === ",") {
    Values = Values.substring(0, Values.length - 1);
  }
  return {
    columns: columns,
    Values: Values
  };
};

// returns the set conditions for the update query
exports.GetUpdateSetColumns = (data) => {
  var condition = "", count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      condition =
        count !== Object.keys(data).length - 1
          ? typeof data[key] === "string"
            ? condition + key + "='" + data[key] + "',"
            : condition + key + "=" + data[key] + ","
          : typeof data[key] === "string"
            ? condition + key + "='" + data[key] + "'"
            : condition + key + "=" + data[key];
      count++;
    }
  }
  if (condition.charAt(condition.length - 1) === ",") {
    condition = condition.substring(0, condition.length - 1);
  }
  return condition;
};

// returns the columns and values for the insert query
exports.GetInsertionColumnsAndValuesRefactored = (data) => {
  columns = "",
    Values = "",
    count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      columns +=
        count !== Object.keys(data).length - 1
          ? key + ","
          : key;
      Values +=
        count !== Object.keys(data).length - 1 ?
          typeof data[key] === "string" ?
            "'" + data[key] + "'" + ","
            :
            data[key] + ","
          : typeof data[key] === "string" ?
            "'" + data[key] + "'"
            :
            data[key];
      count++;
    }
  }
  if (columns.charAt(columns.length - 1) === ",") {
    columns = columns.substring(0, columns.length - 1);
  }
  if (Values.charAt(Values.length - 1) === ",") {
    Values = Values.substring(0, Values.length - 1);
  }
  return {
    columns: columns,
    Values: Values
  };
};

// returns the set conditions for the update query, if capital letters are present it returns columns in quotes
exports.GetCaseSensitiveUpdateSetColumns = (data) => {
  var condition = "", count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      condition +=
        typeof data[key] === "string" ?
          this.GetCaseSensitiveNames(key) + "='" + data[key] + "'"
          :
          this.GetCaseSensitiveNames(key) + "=" + data[key]
      count !== Object.keys(data).length - 1 ?
        condition += ","
        :
        condition
      count++;
    }
  }
  //checking if comma exists at the end of string just to make sure
  if (condition.charAt(condition.length - 1) === ",") {
    condition = condition.substring(0, condition.length - 1);
  }
  return condition;
};

// returns the primary key from and edmx (json object model)
exports.GetKeyFromModel = (model, tableName) => {
  for (entity in model.entityTypes) {
    if (entity == tableName) {
      for (property in model.entityTypes[entity]) {
        if (model.entityTypes[entity][property].key === true) {
          return property
        };
      }
    };
  }
};

// returns true for an empty object
exports.isEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
};

// returns the operator value based on odata expression in url
exports.ConvertToOperator = (odataOperator) => {
  let operator;
  switch (odataOperator) {
    case 'eq':
      operator = '=';
      break;
    case 'ne':
      operator = '!=';
      break;
    case 'gt':
      operator = '>';
      break;
    case 'ge':
      operator = '>=';
      break;
    case 'lt':
      operator = '<';
      break;
    case 'le':
      operator = '<=';
      break;
    default:
      throw new Error('Invalid operator code, expected one of ["=", "!=", ">", ">=", "<", "<="].');
  }
  return operator;
};

// returns entity by removing by breaking at parenthesis or any additional attached strings
exports.GetEntity = (entity) => {
  entity_with_param = entity.split('(');
  return entity_with_param[0];
};

// returns Queryparam string for odata cleint to add to url
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

// wraps around colum, table name in "" if they have capital letters in it
exports.GetCaseSensitiveNames = (columns) => {
  columns = columns.split(",");
  var columnString = '';
  count = 0;
  for (column in columns) {
    if (columns[column].charAt(0) === " ") {
      columns[column] = columns[column].substring(1, columns[column].length);
    }
    //Checking if columnName has Capital letters
    //Only adding "" when necessary
    (/[A-Z]/.test(columns[column])) ?
      columnString += '"' + columns[column] + '"'
      :
      columnString
    count !== columns.length - 1 ?
      columnString += ','
      :
      columnString
    count++;
  }
  return columnString;
};

// returns a string for $filter query param, replaces operator symbols with operators, breaks mulriple predicates by spaces 
exports.GetFilterQueryString = (predicates) => {
  filterString = ''
  for (i = 0; i < predicates.length; i++) {
    filterString = filterString + predicates[i] + " " + this.ConvertToOperator(predicates[i + 1]) + " " //+ predicates[i + 2]
    if (predicates[i + 2].substring(0, 1) == "'") {
      filterString = filterString + predicates[i + 2]
    } else {
      filterString = filterString + "'" + predicates[i + 2] + "'"
    }
    if (predicates[i + 3]) {
      filterString = filterString + " " + predicates[i + 3] + " "
    }
    i = i + 3
  }
  return filterString
};

// returns a query to query metadata from database
exports.GetMetadataQuery = () => {
  return `SELECT  
TAB.TABLE_NAME AS Entity,
COL.COLUMN_NAME AS Property,
COL.Data_Type AS Type,
CASE 
  WHEN Col.IS_NULLABLE = 'YES'
  THEN 'true'
  ELSE 'false'
END AS Nullable,
CASE 
  WHEN CONS.CONSTRAINT_NAME LIKE 'PK%'
  THEN 1
  ELSE 0
END AS Primary_Key
FROM
   INFORMATION_SCHEMA.TABLES TAB 
LEFT JOIN
  INFORMATION_SCHEMA.COLUMNS COL
  ON TAB.TABLE_NAME = COL.TABLE_NAME AND
  TAB.TABLE_SCHEMA = COL.TABLE_SCHEMA
LEFT JOIN 
  INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE CONS
  ON TAB.TABLE_NAME = CONS.TABLE_NAME AND
  TAB.TABLE_SCHEMA =CONS.TABLE_SCHEMA
  AND COL.COLUMN_NAME = CONS.COLUMN_NAME
ORDER BY 
TAB.TABLE_NAME`
};