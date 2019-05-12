import {
  UNIT_AXIOSINSPIRE_SWITCH
} from '../constants/typesGeneral.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function switchUnitAxiosInspire() {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currentUnitAxiosInspire =  getState().unitAxiosInspire;
    dispatch({type: UNIT_AXIOSINSPIRE_SWITCH, unitAxiosInspire: currentUnitAxiosInspire? false: true});

    return Promise.resolve();
  }
}
