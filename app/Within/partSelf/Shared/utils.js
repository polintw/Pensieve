export function axios_visit_Index(cancelToken){
  let url = '/router/visit/index';
return Promise.resolve({main:null});
/*  return axios({ //use confic directly to assure the patch was not influenced by empty .body obj
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
  });*/
}

export function axios_visit_GET_last(cancelToken){
  let url = '/router/visit/index';
  return Promise.resolve({main:null});

/*  return axios({ //use confic directly to assure the patch was not influenced by empty .body obj
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
  });*/
}

export function _axios_get_accumulatedList(cancelToken, nodefilterify, obj){
  return axios({
    method: 'get',
    url: '/router/share/accumulated' + (nodefilterify? '/filter' : ''),
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
