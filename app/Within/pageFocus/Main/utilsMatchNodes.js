import React from 'react';
import {
  setMessageSingleClose
} from '../../../redux/actions/general.js'
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';


export function axios_get_desire_list(cancelToken, desired){
  let url = '/router/matchNodes/list/user';

  return axios.get(url, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: {
      desire: desired
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_get_nodesStatus(cancelToken, nodesList, interest){
  let url = '/router/matchNodes/status/node';

  return axios.get(url, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: {
      nodesList: nodesList,
      interest: interest
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_delete_matchSetting(cancelToken, onPath, submitData){
  let url = '/router/matchNodes/setting/'+onPath;

  return axios({
    url:url,
    method: "patch",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: {
      delete: true
    },
    data: submitData,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_patch_wish_make(cancelToken, nodeId, source){
  let url = '/router/matchNodes/setting/wish';

  return axios({
    url:url,
    method: "patch",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: !!source? {order: true} : {},
    data: {'wishList': [nodeId]},
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_patch_willing(cancelToken, submitData){
  let url = '/router/matchNodes/setting/willing';

  return axios({
    url:url,
    method: "patch",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    data: submitData,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_post_taking(cancelToken, submitData){
  let url = '/router/matchNodes/setting/taking';

  return axios({
    url:url,
    method: "post",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    data: submitData,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  })
  .catch(function (thrown) {
    //this component was unique, would has its own error res need to pass to reducer
    //like message, and call the modal box
    //remember return, but return 'null' to let the followed promise distinguish
    if (axios.isCancel(thrown)) {
      cancelErr(thrown);
      return null;
    }
    else{
      let message = uncertainErr(thrown);

      
      if(message) setMessageSingleClose(message);
      return null;
    }
  });
}
