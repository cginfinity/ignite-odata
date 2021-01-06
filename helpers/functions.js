// returns the columns and values for the insert query
exports.GetInsertionColumnsAndValues = (data) => {
  columns = "";
  Values = "";
  count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      columns += key;
      Values += typeof data[key] === "string" ? "'" + data[key] + "'" : data[key];
      if (count !== Object.keys(data).length - 1) {
        columns += ",";
        Values += ",";
      }
    }
    count++;
  }
  return {
    columns: this.GetCleanString(columns, ","),
    Values: this.GetCleanString(Values, ",")
  };
};

// returns the set conditions for the update query
exports.GetUpdateSetColumns = (data, is_casesensitive = false) => {
  var condition = "", count = 0;
  if (is_casesensitive === true) {
    for (key in data) {
      if (!key.includes("odata.type")) {
        condition += typeof (data[key]) === "string" ? this.GetCaseSensitiveNames(key) + "='" + data[key] + "'" : this.GetCaseSensitiveNames(key) + "=" + data[key];
        if (count !== Object.keys(data).length - 1) {
          condition += ",";
        }
        count++;
      }
    }
  } else {
    for (key in data) {
      if (!key.includes("odata.type")) {
        condition += typeof (data[key]) === "string" ? key + "='" + data[key] + "'" : key + "=" + data[key];
        if (count !== Object.keys(data).length - 1) {
          condition += ",";
        }
        count++;
      }
    }
  }
  return this.GetCleanString(condition, ",");
};

// wraps around column, table name in "" if they have capital letters in it
exports.GetCaseSensitiveNames = (columns) => {
  columns = columns.split(",");
  var columnString = '';
  count = 0;
  for (let i in columns) {
    let columnName = this.GetCleanString(columns[i], " ");
    (/[A-Z]/.test(columnName)) ? columnString += `"${columnName}"` : columnString += columnName;
    count !== columns.length - 1 ? columnString += ',' : columnString;
    count++;
  }
  return columnString;
};

// returns the primary key from and edmx (json object model)
exports.GetKeyFromModel = (model, tableName) => {
  for (entity in model.entityTypes) {
    if (entity == tableName) {
      for (property in model.entityTypes[entity]) {
        if (model.entityTypes[entity][property].key === true) {
          return property;
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

// returns entity by removing by breaking at parenthesis or any additional attached strings
exports.GetEntity = (entity) => {
  entity_with_param = entity.split('(');
  return entity_with_param[0];
};

// returns the name of the resource requested by a service request
exports.GetRequestedEntity = (resource_path) => {
  try {
    resource_path = resource_path.split('/');
    entity = resource_path[2];
    if (entity.includes("(") && entity.includes(")")) {
      entity = entity.split('(');
      entity = entity[0];
    }
    if (entity === '$metadata' || entity === '') {
      entity = 'metadata';
    }
    return entity;
  }
  catch (error) {
    console.log(error);
  }
};

// removes any given character from the end and start of string 
exports.GetCleanString = (string, char) => {
  if (string.charAt(0) === char) {
    string = this.GetCleanString(string.substring(1, string.length), char);
  }
  if (string.charAt(string.length - 1) === char) {
    string = this.GetCleanString(string.substring(0, string.length - 1), char);
  }
  return string;
};

// returns Queryparam string for odata cleint to add to url
exports.GetQueryParamString = (data) => {
  var queryString = '';
  count = 0;
  for (key in data) {
    if (data[key] !== "") {
      queryString +=
        count !== Object.keys(data).length - 1
          ? key + "=" + data[key] + "&"
          : key + "=" + data[key];
      count++;
    }
  }
  return this.GetCleanString(queryString, "&");
};

// returns a string for $filter query param, replaces operator symbols with operators, breaks mulriple predicates by spaces 
exports.GetWhereClauseString = (filters, is_casesensitive = false) => {
  filterString = '';
  var and_filterarray = filters.split(" and ");
  for (let i in and_filterarray) {
    var or_filterarray = and_filterarray[i].split(" or ");
    for (let j in or_filterarray) {
      filters = filters.replace(or_filterarray[j], this.ConvertToSqlCondition(or_filterarray[j], is_casesensitive))
    }
  }
  return filters;
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

// converts an odata filter condition to sql where condition
exports.ConvertToSqlCondition = (predicate, is_casesensitive = false) => {
  let operator = '';
  let parts = [];
  if (predicate.includes(" eq ")) {
    parts = predicate.split(" eq ");
    operator = "eq";
  }

  if (predicate.includes(" ne ")) {
    parts = predicate.split(" ne ");
    operator = "ne";
  }

  if (predicate.includes(" gt ")) {
    parts = predicate.split(" gt ");
    operator = "gt";
  }

  if (predicate.includes(" lt ")) {
    parts = predicate.split(" lt ");
    operator = "lt";
  }

  if (predicate.includes(" ge ")) {
    parts = predicate.split(" ge ");
    operator = "ge";
  }

  if (predicate.includes(" le ")) {
    parts = predicate.split(" le ");
    operator = "le";
  }

  let key = parts[0];
  if(!this.TestFunctionPresence(key)){
    let value = this.GetCleanString(parts[1], " ");

    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") ? value = `${value}` : value = `'${value}'`;

    //wrapping key(column) within "" for case sensitive column name
    if (is_casesensitive === true) {
      key = this.GetCaseSensitiveNames(key);
    }
    //adding the operator and returning condition
    return `${key} ${this.ConvertToOperator(operator)} ${value}`;
  }else{
    //write logic to handle functions here
    return predicate
  }
};

//---------------------------------Metadata Related Functions-------------------------------------------------
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
TAB.TABLE_NAME`;
};

//---------------------------------SQL Functions----------------------------------------
// returns true for an empty object
exports.TestFunctionPresence = (key) => {
  if(key.charAt(key.length-1) === ")" && (  key.includes("indexof(") ||
  key.includes("startswith(") || key.includes("endswith(") ||
  key.includes("substring(") || key.includes("substringof(") ||
  key.includes("tolower(") || key.includes("toupper(")  ||
  key.includes("trim(") || key.includes("concat(") ||
  key.includes("replace(") || key.includes("round(")  ||
  key.includes("ceiling(") || key.includes("floor(")  )){
    return true
  }else{
    return false;
  }
};