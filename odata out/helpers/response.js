exports.GetResponse = async () => {
  try {
    return result = await {
      db2: "db2",
      oracle: "oracle",
      postgresql: "postgresql"
    }
  } catch (err) {
    return (result = {
      message: "Couldn't frame an odata response",
      error: err.message
    });
  }
};