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

// returns the set conditions for the update query
exports.GetMetadataQuery = () => {
  return `SELECT 
            TABLE_NAME AS '@Name',
          CASE
            WHEN 
              TABLE_TYPE = 'BASE TABLE'
            THEN 
              'Table' 
            ELSE 'View'
          END AS '@Type',
          (SELECT 
            Column_Name AS '@Name',
            DATA_TYPE AS '@DataType',
                IS_NULLABLE AS '@IsNullable',
            CASE data_type 
              WHEN 
                'nvarchar' 
              THEN 
                CHARACTER_MAXIMUM_LENGTH 
              WHEN 
                'varchar'  
              THEN 
                CHARACTER_MAXIMUM_LENGTH
                    ELSE 
                NULL 
            END	AS '@Length',
            COLUMNPROPERTY(OBJECT_ID(TABLE_NAME),
            COLUMN_NAME, 'IsIdentity')
            AS '@IsIdentity',
          (SELECT
            tc.CONSTRAINT_TYPE 
          FROM
            INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
          INNER JOIN
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE cu
          ON  tc.CONSTRAINT_NAME = cu.CONSTRAINT_NAME
          WHERE
            tc.TABLE_NAME = INFORMATION_SCHEMA.COLUMNS.TABLE_NAME
          AND cu.COLUMN_NAME = INFORMATION_SCHEMA.COLUMNS.Column_Name)
          AS '@Constraint'
            FROM 
            INFORMATION_SCHEMA.COLUMNS 
            WHERE 
            INFORMATION_SCHEMA.COLUMNS.TABLE_NAME = INFORMATION_SCHEMA.TABLES.TABLE_NAME
            ORDER BY
            INFORMATION_SCHEMA.COLUMNS.ORDINAL_POSITION
            FOR XML PATH ('Property'), TYPE)
        FROM 
          INFORMATION_SCHEMA.TABLES
        WHERE 
          TABLE_SCHEMA='dbo'
        ORDER BY 
          TABLE_NAME ASC  
        For XML PATH ('EntityType'),Root('EntitySet')`
};