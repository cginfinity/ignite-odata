// returns the columns and values for the insert query
exports.GetInsertionColumnsAndValues = (data) => {
  columns = "";
  Values = "";
  count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      columns += key;
      Values += typeof data[key] === "string" ? "'" + data[key] + "'" : Values + data[key];
      if (count !== Object.keys(data).length - 1) {
        columns += ",";
        Values += ",";
      }
    }
    count++;
  }
  return {
    columns: this.RemoveCharFromEndOfString(columns, ","),
    Values: this.RemoveCharFromEndOfString(Values, ",")
  };
};

// returns the set conditions for the update query
exports.GetUpdateSetColumns = (data) => {
  var condition = "", count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      condition += typeof (data[key]) === "string" ? key + "='" + data[key] + "'" : key + "=" + data[key];
      if (count !== Object.keys(data).length - 1) {
        condition += ",";
      }
      count++;
    }
  }
  return this.RemoveCharFromEndOfString(condition, ",");
};

// returns the columns and values for the insert query
exports.GetInsertionColumnsAndValuesRefactored = (data) => {
  columns = "",
    Values = "",
    count = 0;
  for (key in data) {
    if (!key.includes("odata.type")) {
      columns += key;
      Values +=
        typeof data[key] === "string" ? "'" + data[key] + "'" : data[key];
      if (count !== Object.keys(data).length - 1) {
        columns += ","
        Values += ","
      }
    }
    count++;
  }
  return {
    columns: this.RemoveCharFromEndOfString(columns, ","),
    Values: this.RemoveCharFromEndOfString(Values, ",")
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
      count !== Object.keys(data).length - 1 ? condition += "," : condition;
      count++;
    }
  }
  return this.RemoveCharFromEndOfString(condition, ",");;
};

// wraps around column, table name in "" if they have capital letters in it
exports.GetCaseSensitiveNames = (columns) => {
  columns = columns.split(",");
  var columnString = '';
  count = 0;
  for (let i in columns) {
    let columnName = this.GetCleanString(columns[i], " ");
    (/[A-Z]/.test(columnName)) ? columnString += `"${columnName}"`: columnString += columnName;
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

// removes comma present at the end of string and return the new string
exports.RemoveCharFromEndOfString = (string, char) => {
  if (string.charAt(string.length - 1) === char) {
    string = this.RemoveCharFromEndOfString(string.substring(0, string.length - 1), char);
  }
  return string;
};

// removes any given character from the end and start of string 
exports.GetCleanString = (string, char) => {
  if (string.charAt(0) === char) {
    string = this.GetCleanString(string.substring(1, string.length), char);
  }
  if (string.charAt(string.length-1) === char) {
    string = this.GetCleanString(string.substring(0, string.length-1), char);
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
  return this.RemoveCharFromEndOfString(queryString, "&");
};

// // returns a string for $filter query param, replaces operator symbols with operators, breaks mulriple predicates by spaces 
// exports.GetFilterQueryString = (predicates) => {
//   filterString = '';
//   for (i = 0; i < predicates.length; i++) {
//     filterString += predicates[i] + " " + this.ConvertToOperator(predicates[i + 1]) + " ";
//     if (predicates[i + 2].substring(0, 1) === "'") {
//       filterString += predicates[i + 2];
//     } else {
//       filterString += "'" + predicates[i + 2] + "'";
//     }
//     if (predicates[i + 3]) {
//       filterString += " " + predicates[i + 3] + " ";
//     }
//     i = i + 3;
//   }
//   return filterString;
// };

// returns a case sensitive string(wraps in "") for $filter query param, replaces operator symbols with operators, breaks mulriple predicates by spaces 
// exports.GetCaseSensitiveFilterQueryString = (predicates) => {
//   filterString = '';
//   for (i = 0; i < predicates.length; i++) {
//     filterString += this.GetCaseSensitiveNames(predicates[i]) + " " + this.ConvertToOperator(predicates[i + 1]) + " ";
//     if (predicates[i + 2].substring(0, 1) === "'") {
//       filterString += predicates[i + 2];
//     } else {
//       filterString += "'" + predicates[i + 2] + "'";
//     }
//     if (predicates[i + 3]) {
//       filterString += " " + predicates[i + 3] + " ";
//     }
//     i = i + 3;
//   }
//   return filterString;
// };

// returns a string for $filter query param, replaces operator symbols with operators, breaks mulriple predicates by spaces 
exports.GetWhereClauseString = (filters, is_casesensitive=false) => {
  // console.log(filters)
  // var predicates = [];
  filterString = '';
  var and_filterarray = filters.split(" and ");
  for(let i in and_filterarray){
    var or_filterarray = and_filterarray[i].split(" or ");
    for(let j in or_filterarray){
      filters = filters.replace(or_filterarray[j], this.ConvertToSqlCondition(or_filterarray[j], is_casesensitive))
      // predicates.push(or_filterarray[j])
      // a = or_filterarray[j]
      // b = await this.ConvertToSqlCondition(or_filterarray[j])
      // console.log(b)
      // filters = filters.replace(a, b)
      // filterString += this.ConvertToOperator(or_filterarray[j]) + " "
      // if(or_filterarray.length > 1 && j !== 0 && j !== or_filterarray.length-1){
      //   filterString += " or "
      // }
    }
  }
  // console.log(predicates)
  // console.log(filters)
  // filterString = '';
  // for (i = 0; i < predicates.length; i++) {
  //   filterString += predicates[i] + " " + this.ConvertToOperator(predicates[i + 1]) + " ";
  //   if (predicates[i + 2].substring(0, 1) === "'") {
  //     filterString += predicates[i + 2];
  //   } else {
  //     filterString += "'" + predicates[i + 2] + "'";
  //   }
  //   if (predicates[i + 3]) {
  //     filterString += " " + predicates[i + 3] + " ";
  //   }
  //   i = i + 3;
  // }
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
exports.ConvertToSqlCondition = (predicate, is_casesensitive=false) => {
  if(predicate.includes(" eq ")){
    let parts = predicate.split(" eq ");
    let key = parts[0];
    let value = this.GetCleanString(parts[1], " ");

    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length-1) === "'") ? value = `${value}` : value = `'${value}'`;

    //wrapping key(column) within "" for case sensitive column name
    if(is_casesensitive === true){
      key = `"${key}"`;
    }
   
    //adding the operator and returning condition
    return condition = `${key} = ${value}`;
  }
  else if(predicate.includes(" ne ")){
    let parts = predicate.split(" ne ");
    let key = parts[0];
    let value = this.GetCleanString(parts[1], " ");

    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length-1) === "'") ? value = `${value}` : value = `'${value}'`;

    //wrapping key(column) within "" for case sensitive column name
    if(is_casesensitive === true){
      key = `"${key}"`
    }

    //adding the operator and returning condition
    return condition = `${key} != ${value}`;
  }
  else if(predicate.includes(" gt ")){
    let parts = predicate.split(" gt ");
    let key = parts[0];
    let value = this.GetCleanString(parts[1], " ");

    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length-1) === "'") ? value = `${value}` : value = `'${value}'`;

    //wrapping key(column) within "" for case sensitive column name
    if(is_casesensitive === true){
      key = `"${key}"`
    }

    //adding the operator and returning condition
    return condition = `${key} > ${value}`;
  }
  else if(predicate.includes(" lt ")){
    let parts = predicate.split(" lt ");
    let key = parts[0];
    let value = this.GetCleanString(parts[1], " ");

    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length-1) === "'") ? value = `${value}` : value = `'${value}'`;

    //wrapping key(column) within "" for case sensitive column name
    if(is_casesensitive === true){
      key = `"${key}"`
    }

    //adding the operator and returning condition
    return condition = `${key} < ${value}`;
  }
  else if(predicate.includes(" ge ")){
    let parts = predicate.split(" ge ");
    let key = parts[0];
    let value = this.GetCleanString(parts[1], " ");

    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length-1) === "'") ? value = `${value}` : value = `'${value}'`;

    //wrapping key(column) within "" for case sensitive column name
    if(is_casesensitive === true){
      key = `"${key}"`
    }

    //adding the operator and returning condition
    return condition = `${key} >= ${value}`;
  }
  else if(predicate.includes(" le ")){
    let parts = predicate.split(" le ");
    let key = parts[0];
    let value = this.GetCleanString(parts[1], " ");

    //wrapping value within '' for sql compatibility
    (value.charAt(0) === "'" && value.charAt(value.length-1) === "'") ? value = `${value}` : value = `'${value}'`;

    //wrapping key(column) within "" for case sensitive column name
    if(is_casesensitive === true){
      key = `"${key}"`
    }

    //adding the operator and returning condition
    return condition = `${key} <= ${value}`;
  }else{
    return predicate;
  }
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
TAB.TABLE_NAME`;
};