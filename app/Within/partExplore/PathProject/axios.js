export function _axios_get_accumulatedList(cancelToken, obj){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'get',
    url: '/router/paths/accumulated',
    params: obj,
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function _axios_get_projectBasic(cancelToken, pathName){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'get',
    url: '/router/paths/basic',
    params: {pathProject: pathName},
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function _axios_get_projectNodes(cancelToken, params){
  return axios({
    method: 'get',
    url: '/router/paths/nodes/assigned',
    params: params,
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

export function _axios_get_nodesUnits(cancelToken, paramObj){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'get',
    url: '/router/paths/accumulated/nodes',
    params: {
      depth: "first",
      nodesList: paramObj.nodesList,
      pathProject: paramObj.pathName,
      filterSubCate: paramObj.filterSubCate
    },
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
