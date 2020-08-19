const { GetMetadataQuery,
  GetKeyFromModel,
  GetFilterQueryString
} = require('../sql');
const { isEmpty, getEntity } = require('../functions');

// returns a mysql query based on url, method, req. body and parameters
exports.GetQuery = async (info) => {
  try {
    if (info.method === 'GET') {
      return await this.GetSelectQuery(info)
    }
    else {
      return "S3 doesn't allow data updates using sql"
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
      if (isEmpty(query_params) && full_resource_path.includes("(")) {
        //case to support get by id in odata e.g. http://127.0.0.1:1880/root/users('Ravi')
        query = 'SELECT * FROM tablename';
        entity_with_param = entity
        entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
        entity_with_param = entity_with_param.split('(');
        entity = entity_with_param[0]
        param = entity_with_param[1]
        query = query + " WHERE "
        primary_key = GetKeyFromModel(info.data_model, entity)
        query = query + primary_key + " = " + param
        properties ? query = query.replace("*", properties) : query;
        info.schema ? entity = info.schema + '.' + entity : entity;
        return query.replace("tablename", entity);
      } else {
        //case for find by id 
        query = 'SELECT * FROM tablename';
        //to counter user error where user appends user(id) with query parameters
        full_resource_path.includes("(") ? entity = getEntity(entity) : entity;
        //TO add columns name to select staements
        query_params.$select ? query = query.replace("*", query_params.$select) : query;
        if (query_params.$filter) {
          predicates = query_params.$filter.split(' ');
          filterString = GetFilterQueryString(predicates)
          query = query + " WHERE " + filterString
        }
        orderbyadded = false
        if (query_params.$orderby) {
          query = query + " ORDER BY " + query_params.$orderby;
          orderbyadded = true
        }
        if (query_params.$top) {
          if (orderbyadded === true) {
            query = query + " LIMIT " + query_params.$top
          }
          else {
            primary_key = GetKeyFromModel(info.data_model, entity)
            query = query + " ORDER BY " + primary_key + " LIMIT " + query_params.$top
            orderbyadded = true
          }
        }
        if (query_params.$skip) {
          if (orderbyadded === true) {
            query = query + " OFFSET " + query_params.$skip
          }
          else {
            primary_key = GetKeyFromModel(info.data_model, entity)
            query = query + " ORDER BY " + primary_key + " OFFSET " + query_params.$skip
            orderbyadded = true
          }
        }
        info.schema ? entity = info.schema + '.' + entity : entity;
        return query.replace("tablename", entity);
      }
    }
  } catch (error) {
    return error;
  }
};