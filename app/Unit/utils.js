export function _axios_getUnitData(cancelToken, unitId){
  return axios.get('/router/units/'+unitId, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).catch(function (thrown) {
    throw thrown;
  });
};


export function _axios_getUnitImg_base64(cancelToken, src){
  return axios.get('/router/img/'+src+'?type=unitSingle', {
    headers: {
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).catch(function (thrown) {
    throw thrown;
  });
};

export function _axios_getUnitImgs(cancelToken, unitId){
  return axios.get('/router/units/'+unitId+'/src', {
    headers: {
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then((res)=>{
    let resObj = JSON.parse(res.data);
    let srcCover = resObj.main['pic_layer0'],
        srcBeneath = resObj.main['pic_layer1'];

    return axios.all([
      _axios_getUnitImg_base64(cancelToken, srcCover),
      srcBeneath? _axios_getUnitImg_base64(cancelToken, srcBeneath) : Promise.resolve({data: null})
    ]).then(
      axios.spread((resImgCover, resImgBeneath)=>{
        let imgsBase64 = {
          cover: resImgCover.data,
          beneath: resImgBeneath.data
        }
        return imgsBase64;
      })
    )
  }).catch(function (thrown) {
    throw thrown;
  });
};
