export function _axios_GET_usersCount(cancelToken, nodeId, query){
  let paramsObj = {
    countItem: 'users', // users || share, here is 'usersCount', so~
  };
  if(!!query.limitCorner) paramsObj['limitCorner'] = query.limitCorner;
  if(!!query.countCat) paramsObj['countCat'] = query.countCat;

  return axios({
    method: 'get',
    url: '/router/nouns/'+nodeId+ '/count',
    params: paramsObj,
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
