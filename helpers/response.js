exports.GetResponse = async (info, data) => {
  try {
    full_resource_path = info.resource_path
    resource_path = full_resource_path.split('/');
    entity = resource_path[2]
    properties = resource_path[3]
    raw_value_request = resource_path[4]
    serviceRoot = "ServiceRoot/"
    complete_url = info.original_url
    // odataContext = ""
    // if (raw_value_request === undefined && properties === undefined) {
    //   if
    //   return result = {
    //     "@odata.context": serviceRoot + "$metadata" + "#" + entity,
    //     value: data
    //   }
    // }
    // else if (raw_value_request === undefined && properties !== undefined) {
    //   return result = {
    //     "@odata.context": serviceRoot + "$metadata" + "#" + entity + "/" + "$entity",
    //     value: data
    //   }
    // }
    // else {
    //   return data
    // }
    return data = {
      "@odata.context": "serviceRoot/$metadata#People/$entity",
      "@odata.id": "serviceRoot/People('russellwhyte')",
      "@odata.etag": 'W/"08D1694BF26D2BC9"',
      "@odata.editLink": "serviceRoot/People('russellwhyte')",
      "UserName": "russellwhyte",
      "FirstName": "Russell",
      "LastName": "Whyte",
      "Emails": [
        "Russell@example.com",
        "Russell@contoso.com"
      ],
      "AddressInfo": [
        {
          "Address": "187 Suffolk Ln.",
          "City": {
            "CountryRegion": "United States",
            "Name": "Boise",
            "Region": "ID"
          }
        }
      ],
      "Gender": "Male",
      "Concurrency": 635404797346655200
    }
  } catch (err) {
    return (result = {
      message: "Couldn't frame an odata response",
      error: err.message
    });
  }
};