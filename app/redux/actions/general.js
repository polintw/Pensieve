import {
  MOUNT_USERINFO,
  UNIT_MOUNT_UNITCURRENT,
  UNIT_SUBMITTING_SWITCH,
  UPDATE_NOUNSBASIC,
  UPDATE_USERSBASIC,
  AXIOS_SWITCH
} from '../constants/typesGeneral.js';
import {
  UPDATE_USERSHEET
} from '../constants/typesSelfFront.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function mountUserInfo(obj) {
  return { type: MOUNT_USERINFO, userInfo: obj }
};

export function mountUnitCurrent(obj) {
  return { type: UNIT_MOUNT_UNITCURRENT, unitCurrent: obj }
};

export function mountUserSheet(sheetObj, accountSet) {
  return { type: UPDATE_USERSHEET, userSheet: sheetObj, accountSet: accountSet}
};

export function switchUnitSubmitting(bool) {
  return { type: UNIT_SUBMITTING_SWITCH, unitSubmitting: bool}
};

export function axiosSwitch(bool) {
  return { type: AXIOS_SWITCH, status: bool }
};

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
    axios.get('/router/nouns/basic', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: UPDATE_NOUNSBASIC, newFetch: resObj.main.nounsBasic});
    }).catch(function (thrown) {
      let customSwitch = (status)=>{
        return null
      };
      errHandler_axiosCatch(thrown, customSwitch);
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
      dispatch({type: UPDATE_USERSBASIC, newFetch: resObj.main.usersBasic});
    }).catch(function (thrown) {
      let customSwitch = (status)=>{
        return null
      };
      errHandler_axiosCatch(thrown, customSwitch);
    });
  }
}
