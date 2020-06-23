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