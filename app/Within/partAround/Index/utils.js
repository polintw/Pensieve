import React from 'react';

export function axios_visit_Index(cancelToken){
  let url = '/router/visit/index';

  return axios({ //use confic directly to assure the patch was not influenced by empty .body obj
    url:url,
    method: "patch",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
    //close if there is no error response
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_visit_GET_last(cancelToken){
  let url = '/router/visit/index';

  return axios({ //use confic directly to assure the patch was not influenced by empty .body obj
    url:url,
    method: "get",
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
