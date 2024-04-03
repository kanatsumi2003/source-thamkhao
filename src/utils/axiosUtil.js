const axios = require("axios");

async function axiosGet(url, headers) { //get
  const response = await axios.get(url, {
    headers: headers,
  });
  return response;
}
async function axiosPost(url, postData, headers) { //post
    const response = await axios.post(url, postData, {
        headers: headers,
    });
    return response;
    
  } 
  
async function axiosSearch(url, params, headers) { //search
    const response = await axios.get(url, {
        headers: headers,
        params: params,
    });
    return response;
}

async function axiosDelete(url, headers) { //delete
    const response = await axios.delete(url, {
        headers: headers,
    });
    return response;
}

async function axiosPatch(url, updateData, headers) { //patch
    const response = await axios.patch(url, updateData, {
        headers: headers,
    });
    return response;
}

module.exports = {
  axiosGet,
  axiosSearch,
  axiosPost,
  axiosDelete,
  axiosPatch,
};
