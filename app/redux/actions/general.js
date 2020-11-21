import {
  SET_TOKENSTATUS,
  SET_FETCHFLAGS,
  SET_MESSAGE_SINGLE,
  SET_MESSAGE_SINGLECLOSE,
  SET_MESSAGE_BOOLEAN,
  SET_UNITCURRENT,
  SET_BELONGSBYTYPE,
  MOUNT_USERINFO,
  UPDATE_NOUNSBASIC,
  UPDATE_USERSBASIC,
  UPDATE_PATHSBASIC,
  AXIOS_SWITCH,
} from '../types/typesGeneral.js';
import {
  uncertainErr
} from "../../utils/errHandlers.js";

export function mountUserInfo(obj) {
  return { type: MOUNT_USERINFO, userInfo: obj }
};

export function setTokenStatus(obj) {
  return { type: SET_TOKENSTATUS, status: obj }
};

export function setBelongsByType(typeObj){
  return {type: SET_BELONGSBYTYPE, typeObj: typeObj}
}

export function setUnitCurrent(obj) {
  return { type: SET_UNITCURRENT, unitCurrent: obj }
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

export function setMessageSingle(obj) {
  return { type: SET_MESSAGE_SINGLE, messageSingle: obj}
};

export function setMessageSingleClose(obj) {
  return { type: SET_MESSAGE_SINGLECLOSE, messageSingleClose: obj}
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

    let header = {
      'Content-Type': 'application/json',
      'charset': 'utf-8'
    };
    if(!!window.localStorage['token']){ // has token
      header['token'] = window.localStorage['token'];
    };
    //for callback calling in component
    //https://redux.js.org/advanced/async-actions#async-action-creators
    return axios.get('/router/nouns/basic', {
      headers: header,
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      // and then, a new process, fetch the basic info about the accumulations for these nodes
      return axios.get('/router/nouns/basic/accumulations', {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        params: {
          fetchList: fetchList
        }
      }).then((resAccu)=>{
        let resAccuObj = JSON.parse(resAccu.data);
        // now make the obj base on both request
        let updateBasicObj = {};
        fetchList.forEach((nodeId, index) => {
          if( !(nodeId in resObj.main.nounsBasic) ) return; // no data in DB, go next
          updateBasicObj[nodeId] = Object.assign({}, resObj.main.nounsBasic[nodeId], resAccuObj.main.nounsBasicAccu[nodeId]);
        });

        dispatch({type: UPDATE_NOUNSBASIC, newFetch: updateBasicObj});

        return Promise.resolve(); //this, is for those have callback() behind
      });

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
      if(!(id in currList) && (fetchList.indexOf(id) < 0)){
        fetchList.push(id)
      }
    });
    if(fetchList.length<1){dispatch({type: null}); return;};
    //corresponding to the local state 'axios', we should also insert 'isFetching' state in reducer
    let header = {
      'Content-Type': 'application/json',
      'charset': 'utf-8'
    };
    if(!!window.localStorage['token']){ // has token
      header['token'] = window.localStorage['token'];
    };
  axios.get('/router/general/basic/users', {
      headers: header,
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: UPDATE_USERSBASIC, newFetch: resObj.main.usersBasic})
    })
    .catch(function (thrown) {
      let message = uncertainErr(thrown);
      if(message) alert(message);
    });
  }
}

export function handlePathProjectsList(pathsArr) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currList =  getState().pathsBasic;
    let fetchList = [];
    pathsArr.forEach((id, index)=>{
      if(!(id in currList) && (fetchList.indexOf(id) < 0)){
        fetchList.push(id)
      }
    });
    if(fetchList.length<1){dispatch({type: null}); return;};
    //corresponding to the local state 'axios', we should also insert 'isFetching' state in reducer
    axios.get('/router/general/basic/paths', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: UPDATE_PATHSBASIC, newFetch: resObj.main.pathsBasic})
    })
    .catch(function (thrown) {
      let message = uncertainErr(thrown);
      if(message) alert(message);
    });
  }
}

export function fetchBelongRecords(cancelToken){
  return (dispatch, getState) => {
    dispatch(setBelongsByType({ // reset fetched- to init
      fetched: false,
      fetchedSeries: false
    }));
    //by this method we could use 'getState' & 'dispatch' in action creator
    axios({
      method: 'get',
      url: '/router/profile/nodesBelong',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: cancelToken
    }).then(function (res) {
      let belongObj = JSON.parse(res.data);

      const nodesList= belongObj.main.nodesList;
      let byTypeObj = belongObj.main.categoryObj;
      let inclCatListObj = Object.assign({}, byTypeObj); //shallow copy to prevent modifying res obj
      inclCatListObj['setTypesList'] = belongObj.main.setCatList;
      inclCatListObj['fetched'] = true;

      dispatch(handleNounsList(nodesList)); //GET nodes info
      dispatch(setBelongsByType(inclCatListObj)); //update data incl. setCatList
      dispatch(fetchBelongsSeries(byTypeObj)); //only need to know the type need to be fetched
    })
    .catch(function (thrown) {
      let message = uncertainErr(thrown);
      if(message) alert(message);
    });
  }
}

export function fetchBelongsSeries(objByType) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    let typeKeys = Object.keys(objByType);
    let fetchList = typeKeys.map((type, index)=>{
      return objByType[type];
    });
    if(fetchList.length<1){ return;}; //security check, just prevent any unpredictable req

    return axios.get('/router/nouns/direct', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      let submitObj = {}, submitNodesList = [];
      //continued using var 'typeKeys' to keep it staying consistent
      typeKeys.forEach((type, index) => {
        let targetNode = objByType[type];
        submitObj[(type=="homeland") ?"homelandup": "residenceup" ] = resObj.main.nodesSeries[targetNode];
        submitNodesList= submitNodesList.concat(resObj.main.nodesSeries[targetNode].listToTop);
      });
      submitObj["fetchedSeries"] = true;

      dispatch({type: SET_BELONGSBYTYPE, typeObj: submitObj});
      dispatch(handleNounsList(submitNodesList)); //also, these 'new fetched' nodes need to be handle
    })
    .catch(function (thrown) {
      let message = uncertainErr(thrown);
      if(message) alert(message);
    });
  }
}
