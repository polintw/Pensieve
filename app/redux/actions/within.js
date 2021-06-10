import {
  SUBMIT_SHAREDSLIST,
  SET_FLAG_CHAINRESPOND
} from '../types/typesWithin.js';
import {
  initAround
} from "../states/statesWithin.js";
import {
  uncertainErr
} from "../../utils/errHandlers.js";

export function submitSharedsList(listsObj){
  return {type: SUBMIT_SHAREDSLIST, listsObj: listsObj}
}
