export function _axios_get_Basic(cancelToken, pageObj){
  return axios({
    method: 'get',
    url: pageObj.url,
    params: pageObj.params,
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

export function _axios_get_accumulatedList(cancelToken, paramsObj){
  let urlByNodeFilter = '/router/share/accumulated';

  return axios({
    method: 'get',
    url: urlByNodeFilter,
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
