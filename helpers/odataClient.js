const { GetAsync, PostAsync, PutAsync, PatchAsync, DeleteAsync } = require('./callApi');
const { GetQueryParamString } = require('./functions');

exports.client = async (clientInfo, queryParams) => {
  try {
    url = clientInfo.rootURL + clientInfo.resource;
    clientInfo.reqheaders ? headers = clientInfo.reqheaders : headers = {}
    clientInfo.reqbody ? data = clientInfo.reqbody : data = {}
    queryParamString = GetQueryParamString(queryParams)
    if(queryParamString !== ''){
      url = url + '?' + queryParamString
    } 
    if (clientInfo.method === 'GET') {
      return await GetAsync(url, headers)
    }
    else if (clientInfo.method === 'POST') {
      return await PostAsync(url, headers, data)
    }
    else if (clientInfo.method === 'PUT') {
      return await PutAsync(url, headers, data)
    }
    else if (clientInfo.method === 'PATCH') {
      return await PatchAsync(url, headers, data)
    }
    else if (clientInfo.method === 'DELETE') {
      return await DeleteAsync(url, headers)
    }
    else {
      return "Couldn't process your request";
    }
  } catch (err) {
    return err
  }
};