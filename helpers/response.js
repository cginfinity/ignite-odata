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
        return result = {
          "@odata.context": serviceRoot + "$metadata" + "#" + entity,
          "@odata.count": ODataCount,
          value: data
        }
      } else {
        return result = {
          "@odata.context": serviceRoot + "$metadata" + "#" + entity,
          value: data
        }
      }
    }
    ////add logic for raw value requests
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
    if (info.query_params.$count === "true") {
      return result = {
        "@odata.context": serviceRoot + "$metadata" + "#" + entity + "/" + "$entity",
        "@odata.count": ODataCount,
        value: data
      }
    } else {
      return result = {
        "@odata.context": serviceRoot + "$metadata" + "#" + entity + "/" + "$entity",
        value: data
      }
    }
  } catch (err) {
    return err;
  }
};