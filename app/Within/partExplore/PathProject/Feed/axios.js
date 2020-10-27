export function _axios_get_accumulatedList(cancelToken, obj){
  return axios({
    method: 'get',
    url: '/router/path/accumulated',
    params: obj,
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
