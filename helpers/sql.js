const { ConvertToOperator } = require('./operators');

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
            ? condition + key + "='" + data[key] + '\''
            : condition + key + "=" + data[key];
      count++;
    }
  }
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

// returns the primary key from and edmx (json object model)
exports.GetFilterQueryString = (predicates) => {
  filterString = ''
  for (i = 0; i < predicates.length; i++) {
    filterString = filterString + predicates[i] + " " + ConvertToOperator(predicates[i + 1]) + " " //+ predicates[i + 2]
    if (predicates[i + 2].substring(0, 1) == "'"){
      filterString = filterString + predicates[i + 2]
    }else {
      filterString = filterString + "'" + predicates[i + 2] + "'"
    }
    if (predicates[i + 3]) {
      filterString = filterString + " " + predicates[i + 3] + " "
    }
    i = i + 3
  }
  return filterString
};

// returns the set conditions for the update query
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