const { GetAsync, PostAsync, PutAsync, PatchAsync, DeleteAsync } = require('./callApi');

exports.client = async (clientInfo) => {
  try {
    if (clientInfo.method === 'GET') {
      return await GetAsync(clientInfo.reqUrl, clientInfo.reqheaders);
    }
    else if (clientInfo.method === 'POST') {
      return await PostAsync(clientInfo.reqUrl, clientInfo.reqheaders, clientInfo.reqbody);
    }
    else if (clientInfo.method === 'PUT') {
      return await PutAsync(clientInfo.reqUrl, clientInfo.reqheaders, clientInfo.reqbody);
    }
    else if (clientInfo.method === 'PATCH') {
      return await PatchAsync(clientInfo.reqUrl, clientInfo.reqheaders, clientInfo.reqbody);
    }
    else if (clientInfo.method === 'DELETE') {
      return await DeleteAsync(clientInfo.reqUrl, clientInfo.reqheaders);
    }
    else {
      return "Please choose a method";
    }
  } catch (err) {
    return err;
  }
};