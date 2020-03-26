import {
  SET_SIGNINIT,
  SET_RESCODE,
  AXIOS_GET_RES
} from '../types/typesSign.js';
import {
  initSign
} from '../states/statesSign.js';

export function setSignInit(){
  return {type: SET_SIGNINIT, initState: initSign}
}

export function setResCode(code){
  return {type: SET_RESCODE, code: code}
}

export function axiosGetRes(obj) {
  return {type: AXIOS_GET_RES, status: obj.axiosStatus, message: obj.message}
};
