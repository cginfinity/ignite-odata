const { GetCaseSensitiveUpdateSetColumns, GetInsertionColumnsAndValues, GetFilterQueryString, GetCaseSensitiveFilterQueryString, GetMetadataQuery, GetKeyFromModel, GetCaseSensitiveNames, isEmpty, GetEntity } = require('../functions');

// returns a mysql query based on url, method, req. body and parameters
exports.GetQuery = async (info) => {
  try {
    if (info.method === 'GET') {
      return await this.GetSelectQuery(info)
    }
    else if (info.method === 'POST' && info.headers['x-http-method'] == "PATCH") {
      return await this.GetUpdateQuery(info)
    }
    else if (info.method === 'POST') {
      return await this.GetInsertQuery(info)
    }
    else if (info.method === 'PUT' || info.method === 'PATCH') {
      return await this.GetUpdateQuery(info)
    }
    else if (info.method === 'DELETE') {
      return await this.GetDeleteQuery(info)
    }
  } catch (err) {
    return err;
  }
};

exports.GetSelectQuery = async (info) => {
  try {
    query = '';
    full_resource_path = info.resource_path
    query_params = info.query_params
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    //the resource_path array can have atmost 4 components
    //1 The empty element wrapping the odata root service /ServiceRoot/ or /example/ anything the user might like

    //2 The root or odata element ending in forward slash according to odata convention

    //3 The entity name along with the property for comparison, e.g.
    //e.g.
    //http://127.0.0.1:1880/root/users
    //http://127.0.0.1:1880/root/users('Ravi')

    //4 Property name to fetch raw value of properties passed in the url,
    //Note: Multiple properties must be separeted by comma in url
    //http://127.0.0.1:1880/root/users(UserName='Ravi')/name,class

    //testing if the user requested metdata, batch service request, or data from entity
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      return query = `BatchSegment translation is not supported`
    }
    else {
      //logic to query data using query parameters in url
      if (isEmpty(query_params) && entity.includes("(")) {
        //case to support get by id in odata e.g. http://127.0.0.1:1880/root/users('Ravi')
        query = 'SELECT * FROM tablename';
        entity_with_param = entity;
        entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
        entity_with_param = entity_with_param.split('(');
        entity = entity_with_param[0];
        param = entity_with_param[1];
        query += " WHERE " + GetCaseSensitiveNames(GetKeyFromModel(info.data_model, entity)) + " = " + param;
        properties ? query = query.replace("*", GetCaseSensitiveNames(properties)) : query;
        entity = GetCaseSensitiveNames(entity);
        info.schema ? entity = info.schema + '.' + entity : entity;
        return query.replace("tablename", entity);
      } else {
        //case for find by id 
        query = 'SELECT * FROM tablename';
        //to counter user error where user appends user(id) with query parameters
        entity.includes("(") ? entity = GetEntity(entity) : entity;
        //To add columns name to select statements
        query_params.$select ? query = query.replace("*", GetCaseSensitiveNames(query_params.$select)) : query;
        if (query_params.$filter) {
          predicates = query_params.$filter.split(' ');
          query += " WHERE " + GetCaseSensitiveFilterQueryString(predicates);
        }
        orderbyadded = false
        if (query_params.$orderby) {
          query += " ORDER BY " + GetCaseSensitiveNames(query_params.$orderby);
          orderbyadded = true
        }
        if (query_params.$top) {
          if (orderbyadded === true) {
            query += " LIMIT " + query_params.$top
          }
          else {
            query += " ORDER BY " + GetCaseSensitiveNames(GetKeyFromModel(info.data_model, entity)) + " LIMIT " + query_params.$top
            orderbyadded = true
          }
        }
        if (query_params.$skip) {
          if (orderbyadded === true) {
            query += " OFFSET " + query_params.$skip
          }
          else {
            query += " ORDER BY " + GetCaseSensitiveNames(GetKeyFromModel(info.data_model, entity)) + " OFFSET " + query_params.$skip
            orderbyadded = true
          }
        }
        if(!orderbyadded){
          query += " ORDER BY " + GetCaseSensitiveNames(GetKeyFromModel(info.data_model, entity));
        }
        entity = GetCaseSensitiveNames(entity);
        info.schema ? entity = info.schema + '.' + entity : entity;
        return query.replace("tablename", entity);
      }
    }
  } catch (error) {
    return error;
  }
};

exports.GetInsertQuery = async (info) => {
  try {
    const data = GetInsertionColumnsAndValues(info.body);
    CaseSensitiveColumns = GetCaseSensitiveNames(data.columns)
    query = `INSERT INTO tablename(${CaseSensitiveColumns}) VALUES (${data.Values})`
    full_resource_path = info.resource_path;
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2];
    properties = resource_path[3];
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      query = `BatchSegment translation is not supported`
    }
    else {
      entity = GetCaseSensitiveNames(entity);
      info.schema ? entity = info.schema + '.' + entity : entity;
      query = query.replace("tablename", entity);
    }
    return query
  } catch (error) {
    return error;
  }
};

exports.GetUpdateQuery = async (info) => {
  try {
    const setConditions = GetCaseSensitiveUpdateSetColumns(info.body);
    query = `UPDATE tablename SET ${setConditions}`;
    full_resource_path = info.resource_path;
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2];
    properties = resource_path[3];
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      query = `BatchSegment translation is not supported`;
    }
    else {
      //checking for param in parenthesis (key)
      if (entity.includes("(") && entity.includes(")")) {
        entity_with_param = entity;
        entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
        entity_with_param = entity_with_param.split('(');
        entity = entity_with_param[0];
        param = entity_with_param[1];
        query += " WHERE " + GetCaseSensitiveNames(GetKeyFromModel(info.data_model, entity)) + " = " + param;
        entity = GetCaseSensitiveNames(entity);
        info.schema ? entity = info.schema + '.' + entity : entity;
        return query.replace("tablename", entity);
      } else {
        entity = GetCaseSensitiveNames(entity);
        info.schema ? entity = info.schema + '.' + entity : entity;
        return "SELECT * FROM " + entity;
      }
    }
  } catch (error) {
    return error;
  }
};

exports.GetDeleteQuery = async (info) => {
  try {
    query = 'DELETE FROM tablename';
    full_resource_path = info.resource_path
    //isolating service root and entity name
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    if (entity === '$metadata' || entity === '') {
      return query = GetMetadataQuery();
    }
    else if (entity === '$batch') {
      return query = `BatchSegment translation is not supported`
    }
    else {
      //checking for param in parenthesis 
      if (entity.includes("(") && entity.includes(")")) {
        entity_with_param = entity
        entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
        entity_with_param = entity_with_param.split('(');
        entity = entity_with_param[0]
        param = entity_with_param[1]
        query += " WHERE " + GetCaseSensitiveNames(GetKeyFromModel(info.data_model, entity)) + " = " + param;
        entity = GetCaseSensitiveNames(entity);
        info.schema ? entity = info.schema + '.' + entity : entity;
        return query.replace("tablename", entity);
      } else {
        entity = GetCaseSensitiveNames(entity);
        info.schema ? entity = info.schema + '.' + entity : entity;
        return "SELECT * FROM " + entity;
      }
    }
  } catch (error) {
    return error;
  }
};