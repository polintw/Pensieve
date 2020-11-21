export function axios_get_UnitsBasic(cancelToken, reqList) {
    //Notice ! reqList would be empty if no item in list, but it would cause error when compose url
    let header = {
        'charset': 'utf-8'
    };
    // we set token to header if "there is a token",
    // because the boolean value always turn to string in http header, 'false' would be hard to use
    if (!!window.localStorage['token']) { // has token
        header['token'] = window.localStorage['token'];
    };

    return axios.get('/router/units/numerous', {
        headers: header,
        params: {
            unitsList: (reqList.length > 0) ? reqList : "[]"
        },
        cancelToken: cancelToken
    }).then(function (res) {
        let resObj = JSON.parse(res.data);

        return resObj;
    }).catch(function (thrown) {
        throw thrown;
    });
}

export function _axios_GET_andParams(axiosCancelToken, path, params) {
    let paramObj = {};
    if (!!params) params.forEach((param, index) => {
        paramObj[param.key] = param.value;
    });

    return axios({
        method: 'get',
        url: path,
        params: paramObj,
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            'token': window.localStorage['token']
        },
        cancelToken: axiosCancelToken
    }).then(function (res) {
        let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
        return resObj;
    }).catch(function (thrown) {
        throw thrown;
    });
}