const { GetUpdateSetColumns, GetInsertionColumnsAndValues } = require('../sql')

// returns a sql server query base on url method and parameters
exports.GetQuery = async (info) => {
  try {
    if (info.method === 'GET') {
      return await this.GetSelectQuery(info)
    }
    else if (info.method === 'POST') {
      return await this.GetInsertQuery(info)
    }
    else if (info.method === 'PUT') {
      return await this.GetUpdateQuery(info)
    }
    else if (info.method === 'DELETE') {
      return await this.GetDeleteQuery(info)
    }
  } catch (err) {
    return (result = {
      message: "Couldn't create sql server query",
      error: err
    });
  }
};

exports.GetSelectQuery = async (info) => {
  try {
    query = 'select * from tablename';
    var resources = info.resource_path.split('/');
    query = query.replace("tablename", resources[1]);
    //ADD LOGIC TO ADD WHERE CONDITIONS



    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};

exports.GetInsertQuery = async (info) => {
  try {
    const data = GetInsertionColumnsAndValues(info.body);
    query = `INSERT INTO tablename(${data.columns}) VALUES (${data.Values}) `
    var resources = info.resource_path.split('/');
    query = query.replace("tablename", resources[1]);
    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};

exports.GetUpdateQuery = async (info) => {
  try {
    const setConditions = GetUpdateSetColumns(info.body);
    query = `UPDATE tablename SET ${setConditions}`;
    var resources = info.resource_path.split('/');
    query = query.replace("tablename", resources[1]);
    //ADD LOGIC TO ADD WHERE CONDITIONS


    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};

exports.GetDeleteQuery = async (info) => {
  try {
    query = 'DELETE FROM tablename';
    var resources = info.resource_path.split('/');
    query = query.replace("tablename", resources[1]);
    //ADD LOGIC TO ADD WHERE CONDITIONS


    return query
  } catch (err) {
    return (result = {
      error: err
    });
  }
};