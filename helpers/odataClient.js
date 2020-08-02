const { GetAsync, PostAsync, PutAsync, PatchAsync, DeleteAsync } = require('./callApi');
const { GetQueryParamString } = require('./functions');

exports.client = async (info) => {
  try {
    console.log(info)
    //
    info.reqheaders ? headers = info.reqheaders : headers = {}
    info.reqbody ? data = info.reqheaders : data = {}

    ApiURL = info.rootURL + info.resource;
    headers = info.reqheaders

    queryParams = ''
    info  ? console.log("true") : console.log("false")

    //add logic to add request headers

    //add logic to add request body

    if (info.method === 'GET') {
      return await GetAsync(ApiURL, headers)
    }
    else if (info.method === 'POST') {
      return await PostAsync(ApiURL)
    }
    else if (info.method === 'PUT') {
      return await PutAsync(ApiURL)
    }
    else if (info.method === 'PATCH') {
      return await PatchAsync(ApiURL)
    }
    else if (info.method === 'DELETE') {
      return await DeleteAsync(ApiURL)
    }
    else {
      return "Couldn't process your request";
    }
  } catch (err) {
    return err
  }
};