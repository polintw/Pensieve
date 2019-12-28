import React from 'react';
import store from '../../store.js';
import {
  setMessageSingleClose
} from '../../../redux/actions/general.js'
import {
  setFlag,
  setAxiosMatchTaking
} from '../../../redux/actions/cosmic.js'
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

export function axios_get_taking_list(cancelToken){
  let url = '/router/matchNodes/list/taking';

  return axios.get(url, {
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

export function axios_get_nodesStatus(cancelToken, nodesList, interest){
  let url = '/router/matchNodes/status/node';
  let params = { //in axios, this way of announcement of an arr was required
    nodesList: JSON.stringify(nodesList), //parse to a string for URL setting, would be parse back in api
    interest: interest
  };

  return axios.get(url, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: params,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_get_options(cancelToken, onPath){
  let url = '/router/options/matchNodes/'+onPath;

  return axios.get(url, {
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

export function axios_post_taking(cancelToken, nodeId){
  const state = store.getState(); //store in reducer at this moment

  if(!!state.indexLists.demandTake[0]){ //forbidden submit if there is already a taken node
    store.dispatch(setMessageSingleClose(state.i18nUIString.catalog["message_Main_duplicateTaking"]));
    return;}
  if(state.axiosMatchTaking) return; //and cease new click if there is a connection on the way
  //Then, if everything is fine, we start to submit the taken node
  store.dispatch(setAxiosMatchTaking(true)); //as local, set the axios state

  let url = '/router/matchNodes/setting/taking';

  return axios({
    url:url,
    method: "post",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    data: {takingList: [nodeId]},
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);
    //successfully submit, now we inform the Taking to refresh.
    store.dispatch(setFlag(['flagTakingRefresh']));
    store.dispatch(setAxiosMatchTaking(false));
    return;
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
      //the res message of this axios_ should be displayed(if there is any)
      if(message) store.dispatch(setMessageSingleClose(state.i18nUIString.catalog["message_Main_duplicateTaking"]));
      return null;
    }
  });
}
