export function _axios_get_Suggestions(cancelToken, paramsObj){
  // allow no token
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };
  // api and customized prop was depend on page request
  let url = "";
  switch (paramsObj.originList) {
    case 'people':
      url = '/router/people/nodes/assigned';
      paramsObj['userId'] = paramsObj.listIdentity;
      break;
    case 'personal':
      url = '/router/share/nodes/assigned';
      break;
    case 'personal_pathProject':
      url = '/router/share/nodes/assigned';
      paramsObj['pathProject'] = paramsObj.listIdentity ;
      break;
    case 'pathProject':
      url = "/router/paths/nodes/assigned"
      paramsObj['pathProject'] = paramsObj.listIdentity;
      break;
    default:
      url = ""
  };
  // set 'suggestion' prop to params for all condition
  paramsObj['suggestion'] = true;

  return axios({
    method: 'get',
    url: url,
    params: paramsObj,
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
