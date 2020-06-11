exports.GetResponse = async (info, data) => {
  try {
    full_resource_path = info.resource_path
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    raw_value_request = resource_path[4]
    serviceRoot = "ServiceRoot/"
    complete_url = info.original_url
    odataContext = ""
    if (raw_value_request === undefined && properties === undefined || entity === undefined) {
      if (entity === undefined) {
        return data;
      }
      else {
        return result = {
          "@odata.context": serviceRoot + "$metadata" + "#" + entity,
          value: data
        }
      }
    }
    else if (raw_value_request === undefined && properties !== undefined) {
      return result = {
        "@odata.context": serviceRoot + "$metadata" + "#" + entity + "/" + "$entity",
        value: data
      }
    }
    else {
      return data
    }
  } catch (err) {
    return (result = {
      message: "Couldn't frame an odata response",
      error: err.message
    });
  }
};