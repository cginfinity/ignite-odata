exports.GetResponse = async (info, data) => {
  try {
    full_resource_path = info.resource_path;
    resource_path = full_resource_path.split('/');
    entity = resource_path[2];
    properties = resource_path[3];
    raw_value_request = resource_path[4];
    serviceRoot = "ServiceRoot/";
    var ODataCount = 0;
    if (info.query_params.$count === "true") {
      var ODataCount = Object.keys(data).length;
    }
    if (entity.includes("(") && entity.includes(")")) {
      if (info.query_params.$count === "true") {
        result = {
          "@odata.context": serviceRoot + "$metadata" + "#" + entity,
          "@odata.count": ODataCount,
          value: data
        }
        return result;
      } else {
        result = {
          "@odata.context": serviceRoot + "$metadata" + "#" + entity,
          value: data
        }
        return result;
      }
    }
    // if (raw_value_request === undefined && properties === undefined || entity === undefined) {
    //   if (entity === undefined) {
    //     return data;
    //   }
    //   else {
    //     return result = {
    //       "@odata.context": serviceRoot + "$metadata" + "#" + entity,
    //       value: data
    //     }
    //   }
    // }
    // else if (raw_value_request === undefined && properties !== undefined) {
    if (info.query_params.$count === "true") {
      result = {
        "@odata.context": serviceRoot + "$metadata" + "#" + entity + "/" + "$entity",
        "@odata.count": ODataCount,
        value: data
      }
      return result;
    } else {
      result = {
        "@odata.context": serviceRoot + "$metadata" + "#" + entity + "/" + "$entity",
        value: data
      }
      return result;
    }
    // }
    // else {
    //   return data
    // }
  } catch (err) {
    return (result = {
      message: "Couldn't frame an odata response",
      error: err.message
    });
  }
};