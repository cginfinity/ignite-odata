const { GetQuery: db2Query } = require('./resolvers/db2');
const { GetQuery: mssqlQuery } = require('./resolvers/mssql');
const { GetQuery: mysqlQuery } = require('./resolvers/mysql');
const { GetQuery: oracleQuery } = require('./resolvers/oracle');
const { GetQuery: postgresQuery } = require('./resolvers/postgres');
const { GetQuery: mariadbQuery } = require('./resolvers/mariadb');
const { GetQuery: s3Query } = require('./resolvers/s3');

exports.GetQueries = async (info) => {
  try {
    return queries = {
      db2: await db2Query(info),
      mariadb: await mariadbQuery(info),
      mssql: await mssqlQuery(info),
      mysql: await mysqlQuery(info),
      oracle: await oracleQuery(info),
      postgres: await postgresQuery(info),
      s3: await s3Query(info)
    }
  } catch (err) {
    return err;
  }
};