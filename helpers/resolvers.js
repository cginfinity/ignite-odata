const { GetQuery: db2GetQuery } = require('./resolvers/db2');
const { GetQuery: mssqlGetQuery } = require('./resolvers/mssql');
const { GetQuery: mysqlGetQuery } = require('./resolvers/mysql');
const { GetQuery: oracleGetQuery } = require('./resolvers/oracle');
const { GetQuery: postgresGetQuery } = require('./resolvers/postgres');
const { GetQuery: mariadbGetQuery } = require('./resolvers/mariadb');
const { GetQuery: sqliteGetQuery } = require('./resolvers/sqlite');

exports.GetQueries = async (info) => {
  try {
    return queries = await {
      db2: await db2GetQuery(info),
      mariadb: await mariadbGetQuery(info),
      mssql: await mssqlGetQuery(info),
      mysql: await mysqlGetQuery(info),
      oracle: await oracleGetQuery(info),
      postgres: await postgresGetQuery(info),
      sqlite: await sqliteGetQuery(info)
    }
  } catch (err) {
    return (result = {
      message: "Couldn't create query",
      error: err.message
    });
  }
};