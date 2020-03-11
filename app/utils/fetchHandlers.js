export function axios_get_UnitsBasic(cancelToken, reqList) {
    //Notice ! reqList would be empty if no item in list, but it would cause error when compose url

    return axios.get('/router/units/numerous', {
        headers: {
            'charset': 'utf-8',
            'token': window.localStorage['token']
        },
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