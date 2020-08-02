const axios = require('axios');

//Generic Method to make a GET request
exports.GetAsync = async (URL, header) => {
  try {
    let response = await axios(URL, {
      method: 'GET',
      headers: header,
    })
      .catch(err => {
          return err
      })
    return response;
  }
  catch (e) {
    console.log(e)
  }
};

//Generic Method to make a POST request
exports.PostAsync = async (URL, header, data) => {
  try {
    let response = await axios(URL, {
      method: 'POST',
      headers: header,
      data: data
    })
      .catch(err => {
          return err
      })
    return response;
  }
  catch (e) {
    console.log(e);
  }
};

//Generic Method to make a PUT request
exports.PutAsync = async (URL, header, data) => {
  try {
    let response = await axios(URL, {
      method: 'PUT',
      headers: header,
      data: data
    })
      .catch(err => {
          return err
      });
    return response;
  }
  catch (e) {
    console.log(e);
  }
};

//Generic Method to make a PUT request
exports.PatchAsync = async (URL, header, data) => {
  try {
    let response = await axios(URL, {
      method: 'PATCH',
      headers: header,
      data: data
    })
      .catch(err => {
          return err
      });
    return response;
  }
  catch (e) {
    console.log(e);
  }
};

//Generic Method to make a DELETE request
exports.DeleteAsync = async (URL, header) => {
  try {
    let response = await axios(URL, {
      method: 'DELETE',
      headers: header,
    })
      .catch(err => {
          return err
      });
    return response;
  }
  catch (e) {
    console.log(e);
  }
};

exports.CustomCall = async (URL, header, data, method) => {
  try {
    let response = await axios(URL, {
      method: method,
      headers: header,
      data: data
    })
      .catch(err => {
          return err
      });
    return response;
  }
  catch (e) {
    console.log(e);
  }
};