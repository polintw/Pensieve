export function _axios_get_NodesLayer(cancelToken, paramsObj){
  return axios({
    method: 'get',
    url: '/router/nouns/layer',
    params: paramsObj,
    headers: {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
