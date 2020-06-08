exports.GetResponse = async (info, data) => {
    try {
                                  // query = 'select * from tablename';
                                  // full_resource_path = info.resource_path
                                  // data_query_params = info.query_params
                                  // //isolating service root and entity name
                                  // resource_path = full_resource_path.split('/');
                              
                                  // //the resource_path array can have atmost 4 components
                                  // //1 The empty element wrapping the odata root service /ServiceRoot/
                                  // //2 The root or odata element ending in forward slash according to odata convention
                              
                                  // //3 The entity name along with the property for comparison, e.g.
                                  // //http://127.0.0.1:1880/root/users(UserName='Ravi')/name,class
                              
                                  // //4 Property name to fetch raw value of properties passed in the url,
                                  // //Note: Multiple properties must be separeted by comma in url
                                  // //http://127.0.0.1:1880/root/users(UserName='Ravi')/name,class
                              
                                  // entity = resource_path[2]
                                  // properties = resource_path[3]
                                  // //testing if the user requested metdata or batch service request
                                  // if (entity === '$metadata') {
                                  //   query = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`
                                  // }
                                  // else if (entity === '$batch') {
                                  //   query = `BatchSegment translation is not supported`
                                  // }
                                  // else {
                                  //   //checking for query param in parenthesis 
                                  //   if (full_resource_path.includes("(")) {
                                  //     //isolating table name and first comparison parameter
                                  //     entity_with_param = entity
                                  //     entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
                                  //     entity_with_param = entity_with_param.split('(');
                                  //     entity = entity_with_param[0]
                                  //     param = entity_with_param[1]
                                  //     query = query + " where "
                                  //     query = query + param
                                  //   }
                                  //   //replacing table name with extracted entity
                                  //   query = query.replace("tablename", entity);
                                  //   //extracting column names(property) from url
                                  //   // e.g. GET serviceRoot/Airports('KSFO')/Name
                                  //   //adding logic to add column names in query
                                  //   if (properties) {
                                  //     query = query.replace("*", properties);
                                  //   }
                                  //   if (data_query_params) {
                              
                              
                                  //   }
                                  // }
        // return 'http://services.odata.org/V4/(S(e2ubtwuqskobeuei04iyznwv))/TripPinServiceRW/$metadata#People'
        return result = {
          ab: "asdfsdf",
          cd: "asdfsdfsdafas"
        }
    } catch (err) {
      return (result = {
        message: "Couldn't frame an odata response",
        error: err.message
      });
    }
  };