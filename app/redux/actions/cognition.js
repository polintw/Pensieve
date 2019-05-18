import {

} from '../constants/typesGeneral.js';
import {
  SET_COGNITION_BELLNOTIFY,
  SET_COGNITION_LISTNOTIFY
} from '../constants/typesSelfFront.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

export function setCognitionBellnotify(count) {
  return { type: SET_COGNITION_BELLNOTIFY, bellNotify: count >0 ? count : false}
};

export function handleBellNotify(cancelToken) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    axios.get('/router/notifications/count', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: cancelToken
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: SET_COGNITION_BELLNOTIFY, bellNotify: resObj.main.notifyCount >0 ?resObj.main.notifyCount: false});
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }
}

export function handleNotifyBox(cancelToken) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    axios.get('/router/notifications/list', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: cancelToken
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: SET_COGNITION_LISTNOTIFY, listNotify: resObj.main.notifyList});
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }
}
