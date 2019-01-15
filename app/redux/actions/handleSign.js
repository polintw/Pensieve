import {
  AXIOS_SWITCH,
  AXIOS_GET_RES
} from '../constants/typesSign.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function axiosSwitch(bool) {
  return { type: AXIOS_SWITCH, status: bool }
};

export function axiosGetRes(obj) {
  return {type: AXIOS_GET_RES, status: obj.axiosStatus, message: obj.message}
};

export function handleSignUser(submitObj) =>{
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch) => {
    axios.post('/router/login', submitObj, {
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
      dispatch({
        type: AXIOS_SWITCH,
        status: false
      })
      window.localStorage['token'] = res.data.token;
      window.location.assign('/');
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        dispatch({
            type:   AXIOS_GET_RES,
            status: false,
            message: thrown.response.data
        });
      }
    });
  }
}
