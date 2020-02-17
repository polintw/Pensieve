import {
  SET_TOKENSTATUS,
  SET_FETCHFLAGS,
  SET_MESSAGE_SINGLECLOSE,
  SET_MESSAGE_BOOLEAN,
  MOUNT_USERINFO,
  UPDATE_NOUNSBASIC,
  UPDATE_USERSBASIC,
  AXIOS_SWITCH,
} from '../types/typesGeneral.js';

export function mountUserInfo(obj) {
  return { type: MOUNT_USERINFO, userInfo: obj }
};

export function setTokenStatus(obj) {
  return { type: SET_TOKENSTATUS, status: obj }
};

export function axiosSwitch(bool) {
  return { type: AXIOS_SWITCH, status: bool }
};

export function updateUsersBasic(obj) {
  return { type: UPDATE_USERSBASIC, newFetch: obj }
};

export function updateNodesBasic(obj) {
  return { type: UPDATE_NOUNSBASIC, newFetch: obj }
};

export function setMessageSingleClose(arr) {
  return { type: SET_MESSAGE_SINGLECLOSE, messageSingleClose: arr}
};

export function setMessageBoolean(obj) {
  return { type: SET_MESSAGE_BOOLEAN, messageBoolean: obj}
};

export function setFlag(targetArr){
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currentState =  getState();
    let flagObj = {};
    targetArr.forEach((target, index)=>{
      flagObj[target] = currentState[target] ? false : true;
    })

    let submitObj = {
      type: SET_FETCHFLAGS,
      flags: flagObj
    };
    dispatch(submitObj)
  }
}

export function handleNounsList(nounsArr) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currNouns =  getState().nounsBasic;
    let fetchList = [];
    nounsArr.forEach((id, index)=>{
      if(!(id in currNouns)){
        fetchList.push(id)
      }
    });
    if(fetchList.length<1){dispatch({type: null}); return;};

    //corresponding to the local state 'axios', we should also insert 'isFetching' state in reducer

    //for callback calling in component
    //https://redux.js.org/advanced/async-actions#async-action-creators
    return axios.get('/router/nouns/basic', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: UPDATE_NOUNSBASIC, newFetch: resObj.main.nounsBasic})

      return Promise.resolve(); //this, is for those have callback() behind

    /*}).catch(function (thrown) {
      let customSwitch = (status)=>{
        return null
      };
      errHandler_axiosCatch(thrown, customSwitch);*/

      // Do not use catch, because that will also catch
      // any errors in the dispatch and resulting render,
      // causing a loop of 'Unexpected batch number' errors.
      // https://github.com/facebook/react/issues/6895

    });
  }
}

export function handleUsersList(usersArr) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currList =  getState().usersBasic;
    let fetchList = [];
    usersArr.forEach((id, index)=>{
      if(!(id in currList)){
        fetchList.push(id)
      }
    });
    if(fetchList.length<1){dispatch({type: null}); return;};
    //corresponding to the local state 'axios', we should also insert 'isFetching' state in reducer
    axios.get('/router/general/users/basic', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: UPDATE_USERSBASIC, newFetch: resObj.main.usersBasic})
    }).catch(function (thrown) {
      let customSwitch = (status)=>{
        return null
      };
      errHandler_axiosCatch(thrown, customSwitch);
    });
  }
}
