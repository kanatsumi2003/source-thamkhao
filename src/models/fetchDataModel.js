class FetchDataModel {
    constructor(baseUrl, method, data, headers) {
      this.baseUrl = baseUrl;
      this.method = method;
      this.data = data;
      this.headers = headers;
    }
  }
  module.exports = { FetchDataModel };