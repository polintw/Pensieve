import {
  SET_BELONGSBYTYPE,
} from '../types/typesWithin.js';

export function setBelongsByType(typeObj){
  return {type: SET_BELONGSBYTYPE, typeObj: typeObj}
}
