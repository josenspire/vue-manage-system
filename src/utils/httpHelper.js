import axios from 'axios';

module.exports = {
  get (url, params) {
    return axios.get(url, {
      params: {
        t: new Date().getTime(),
        ...params,
      },
    });
  },

  post (url, params) {
    return axios.request({
      url: url,
      method: 'POST',
      data: params,
    });
  },

  deleteMethod (url, params) {
    return axios.request({
      url: url,
      method: 'DELETE',
      data: params,
    });
  },

  put (url, params) {
    return axios.request({
      url: url,
      method: 'PUT',
      data: params,
    });
  },
};
