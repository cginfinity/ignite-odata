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
  if(!this.IsFunctionCall(predicate)){
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
    //wrapping key(column) within "" for case sensitive column name
    if (is_casesensitive === true) {
      key = this.GetCaseSensitiveNames(key);
    }

    let value = this.GetCleanString(parts[1], " ");
    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") ? value = `${value}` : value = `'${value}'`;

    //adding the operator and returning condition
    return `${key} ${this.ConvertToOperator(operator)} ${value}`;
  }else{
    //startswith function support
    if(predicate.includes("startswith(")){
      return this.ResolveStartsWith(predicate, is_casesensitive);
    }
    //endswith function support
    else if(predicate.includes("endswith(")){
      return this.ResolveEndsWith(predicate, is_casesensitive);
    }
    //substring function support
    else if(predicate.includes("substringof(")){
      return this.ResolveSubstringOf(predicate, is_casesensitive);
    }
    //indexof function support
    else if(predicate.includes("indexof(")){
      return this.ResolveIndexOf(predicate, is_casesensitive);
    }
    //worst case return condition, user can replace it in query
    else{
      return predicate
    }
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
exports.IsFunctionCall = (key) => {
  if( key.includes("indexof(") ||  key.includes("startswith(") || key.includes("endswith(") ||
  key.includes("substring(") || key.includes("substringof(") ||  key.includes("tolower(") ||
  key.includes("toupper(")  ||  key.includes("trim(") || key.includes("concat(") ||  
  key.includes("replace(") || key.includes("round(")  ||  key.includes("ceiling(") || key.includes("floor(")  ){
    return true;
  }else{
    return false;
  }
};

//Resolves a filter condition with endswith function call to a sql condition
exports.ResolveEndsWith = (predicate, is_casesensitive=false) =>{
  let operator = '';
  predicate = predicate.replace("endswith(", "");

  if(predicate.includes(") eq true")){
    // string_toReplace = ") eq true";
    predicate = predicate.replace(") eq true", "");
    operator = "LIKE";
  }else if(predicate.includes(") eq false")){
    // string_toReplace = ") eq false";
    predicate = predicate.replace(") eq false", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne true")){
    // string_toReplace = ") ne TRUE";
    predicate = predicate.replace(") ne true", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne false")){
    // string_toReplace = ") ne false";
    predicate = predicate.replace(") ne false", "");
    operator = "LIKE";
  }else{
    operator = "LIKE";
    predicate.charAt(predicate.length-1) === ")" ? predicate = predicate.substring(0, predicate.length-1) : null
  }

  let parts = predicate.split(",");
  let key = parts[0];
  //wrapping key(column) within "" for case sensitive column name
  if (is_casesensitive === true) {
    key = this.GetCaseSensitiveNames(key);
  }

  //removing spaces and colons from the the filter value 
  let value = this.GetCleanString(parts[1], " ");
  value = this.GetCleanString(value, "'");
  value = this.GetCleanString(value, " ");

  return `${key} ${operator} '%${value}'`;
};

//Resolves a filter condition with startswith function call to a sql condition
exports.ResolveStartsWith = (predicate, is_casesensitive=false) =>{
  let operator = '';
  predicate = predicate.replace("startswith(", "");

  if(predicate.includes(") eq true")){
    // string_toReplace = ") eq true";
    predicate = predicate.replace(") eq true", "");
    operator = "LIKE";
  }else if(predicate.includes(") eq false")){
    // string_toReplace = ") eq false";
    predicate = predicate.replace(") eq false", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne true")){
    // string_toReplace = ") ne TRUE";
    predicate = predicate.replace(") ne true", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne false")){
    // string_toReplace = ") ne false";
    predicate = predicate.replace(") ne false", "");
    operator = "LIKE";
  }else{
    operator = "LIKE";
    predicate.charAt(predicate.length-1) === ")" ? predicate = predicate.substring(0, predicate.length-1) : null
  }

  let parts = predicate.split(",");
  let key = parts[0];
  //wrapping key(column) within "" for case sensitive column name
  if (is_casesensitive === true) {
    key = this.GetCaseSensitiveNames(key);
  }
  
  //removing spaces and colons from the the filter value 
  let value = this.GetCleanString(parts[1], " ");
  value = this.GetCleanString(value, "'");
  value = this.GetCleanString(value, " ");

  return `${key} ${operator} '${value}%'`;
};

//Resolves a filter condition with substringof function call to a sql condition
exports.ResolveSubstringOf = (predicate, is_casesensitive=false) =>{
  let operator = '';
  predicate = predicate.replace("startswith(", "");

  if(predicate.includes(") eq true")){
    // string_toReplace = ") eq true";
    predicate = predicate.replace(") eq true", "");
    operator = "LIKE";
  }else if(predicate.includes(") eq false")){
    // string_toReplace = ") eq false";
    predicate = predicate.replace(") eq false", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne true")){
    // string_toReplace = ") ne TRUE";
    predicate = predicate.replace(") ne true", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne false")){
    // string_toReplace = ") ne false";
    predicate = predicate.replace(") ne false", "");
    operator = "LIKE";
  }else{
    operator = "LIKE";
    predicate.charAt(predicate.length-1) === ")" ? predicate = predicate.substring(0, predicate.length-1) : null
  }

  let parts = predicate.split(",");
  let key = parts[0];
  //wrapping key(column) within "" for case sensitive column name
  if (is_casesensitive === true) {
    key = this.GetCaseSensitiveNames(key);
  }

  //removing spaces and colons from the the filter value 
  let value = this.GetCleanString(parts[1], " ");
  value = this.GetCleanString(value, "'");
  value = this.GetCleanString(value, " ");

  return `${key} ${operator} '%${value}%'`;
};

// Resolves a filter condition with startswith function call to a sql condition
exports.ResolveIndexOf = (predicate, is_casesensitive=false) =>{
  let operator = "";
  predicate = predicate.replace("indexof(", "");

  let string_toReplace = "";
  //adding conditions for like, not like all probable cases
  if(predicate.includes(") eq 0")){
    // string_toReplace = ") eq 0";
    predicate = predicate.replace(") eq 0", "");
    operator = "LIKE";
  }else if(predicate.includes(") eq -1")){
    // string_toReplace = ") eq -1"
    predicate = predicate.replace(") eq -1", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne 0")){
    // string_toReplace = ") ne 0"
    predicate = predicate.replace(") ne 0", "");
    operator = "NOT LIKE";
  }else if(predicate.includes(") ne -1")){
    // string_toReplace = ") ne -1"
    predicate = predicate.replace(") ne -1", "");
    operator = "LIKE";
  }else{
    operator = "LIKE";
    predicate.charAt(predicate.length-1) === ")" ? predicate = predicate.substring(0, predicate.length-1) : null
  }
  
  let parts = predicate.split(",");
  let key = parts[0];
  //wrapping key(column) within "" for case sensitive column name
  if (is_casesensitive === true) {
    key = this.GetCaseSensitiveNames(key);
  }

  //removing spaces and colons from the the filter value 
  let value = this.GetCleanString(parts[1], " ");
  value = this.GetCleanString(value, "'");
  value = this.GetCleanString(value, " ");

  return `${key} ${operator} '${value}%'`;
};