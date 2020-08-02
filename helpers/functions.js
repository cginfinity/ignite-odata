// returns true for an non empty object
exports.isEmpty = (obj) => {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
};

// returns entity by removing additional attached strings
exports.getEntity = (entity) => {
    entity_with_param = entity.split('(');
    return entity_with_param[0];
};

// returns the columns and values for the insert query
exports.GetQueryParamString = (data) => {
    var queryString = '',
      count = 0;
    for (key in data) {
      if (data[key] !== "" ) {
        queryString =
          count !== Object.keys(data).length - 1
            ? queryString + key + "=" + data[key] + "&"
            : queryString + key + "=" + data[key];
        count++;
      }
    }
    if (queryString.charAt(queryString.length - 1) === "&") {
        queryString = queryString.substring(0, queryString.length - 1);
    }
    return queryString
  };