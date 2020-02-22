export function _axios_GET_feed_Fellows(cancelToken, nodeId, curious){

  return axios({
    method: 'get',
    url: '/router/feed/fellows',
    params: {
      base: nodeId,
      curious: [curious]
    },
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
