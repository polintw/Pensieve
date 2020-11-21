export function _axios_postLinkMeta(cancelToken, clientUrl) {
  let header = {
    'charset': 'utf-8'
  };
  // we set token to header if "there is a token",
  // because the boolean value always turn to string in http header, 'false' would be hard to use
  if (!!window.localStorage['token']) { // has token
    header['token'] = window.localStorage['token'];
  };

  return axios.post('/router/general/parser/urlmeta', {
    clientUrl: clientUrl
  }, {
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
};

