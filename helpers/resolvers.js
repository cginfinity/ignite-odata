// const { GetQuery: CassandraGetQuery } = require('./resolvers/cassandra');
const { GetQuery: db2GetQuery } = require('./resolvers/db2');
const { GetQuery: mssqlGetQuery } = require('./resolvers/mssql');
const { GetQuery: mysqlGetQuery } = require('./resolvers/mysql');
const { GetQuery: oracleGetQuery } = require('./resolvers/oracle');
const { GetQuery: postgresqlGetQuery } = require('./resolvers/postgresql');

exports.GetQueries = async (info) => {
  try {
    return queries = await {
      // cassandra: await CassandraGetQuery(info),
      // db2: await db2GetQuery(info),
      mssql: await mssqlGetQuery(info),
      // mysql: await mysqlGetQuery(info),
      // oracle: await oracleGetQuery(info),
      // postgresql: await postgresqlGetQuery(info),
    }
  } catch (err) {
    return (result = {
      message: "Couldn't create query",
      error: err.message
    });
  }
};