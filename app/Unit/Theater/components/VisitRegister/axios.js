export function _axios_get_userUnitSign(cancelToken, params){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'get',
    url: '/router/units/entity/sign_subcate/usersign',
    params: params,
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function _axios_post_userUnitSign(cancelToken, data, params){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'post',
    url: '/router/units/entity/sign_subcate/usersign',
    data: data,
    params: !!params ? params : {},
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function _axios_delete_userUnitSign(cancelToken, data, params){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'delete',
    url: '/router/units/entity/sign_subcate/usersign',
    data: data,
    params: !!params ? params : {},
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}


export function _axios_get_signedList(cancelToken, params){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'get',
    url: '/router/units/entity/sign_subcate/list',
    params: params,
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
