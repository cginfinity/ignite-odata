// returns the columns and values for the insert query
exports.GetInsertionColumnsAndValues = (data) => {
  var columns = "",
    Values = "",
    count = 0;
  for (key in data) {
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
  return {
    columns: columns,
    Values: Values
  };
};

// returns the set conditions for the update query
exports.GetUpdateSetColumns = (data) => {
  var condition = "", count = 0;
  for (key in data) {
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
  return condition;
};

// returns the primary key from and edmx (json object model)
exports.GetKeyFromModel = (model, tableName) => {
  for (entity in model.entityTypes) {
    // console.log("TableName " + entity)
    if (entity == tableName){
      for (property in model.entityTypes[entity]) {
        // console.log("ColumnName " + property)
        if (model.entityTypes[entity][property].key === true) {
          console.log(property)
          return property
        }
        // for (attribute in model.entityTypes[entity][property]) {
        //   console.log("Attribute Name " + attribute)
        //   // console.log(model.entityTypes[entity][property][attribute])
        //   if (model.entityTypes[entity][property][attribute] === true) {
        //     console.log("this columns is key")
        //   }
        // }
      }
    }
  };
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