import {
  setTokenStatus
} from "../redux/actions/general.js";

export function cancelErr(error){
  console.log('Request canceled: ', error.message);
}

export function statusVerifiedErr(error, store){
  let currentReducer = store.getState();
  //set tokenStatus
  if(error.response){ // if error came from res
    switch (error.response.status) {
      case 400: //validation error
        store.dispatch(setTokenStatus({ token: 'invalid' }))
        break;
      case 401: //authorized error
        store.dispatch(setTokenStatus({token: 'invalid'}))
        break;
      case 403: //forbidden error
        store.dispatch(setTokenStatus({token: 'lack'}))
        break;
      case 404: //not found
        store.dispatch(setTokenStatus({ token: 'internalErr'}))
        break;
      case 500:
        store.dispatch(setTokenStatus({token: 'internalErr'}))
        break;
      default:
        store.dispatch(setTokenStatus({token: 'invalid'}))
    };
  }
  else if(currentReducer.token=='verified'){return; } //if error came from React render (no need update token status)
  else store.dispatch(setTokenStatus({token: 'invalid'})); //end of 'if'

  return; //now, we return 'nothing', just a structure prepared for the plan in future.
}

export function uncertainErr(error){
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    let resConsole = error.response.data.console; // to verify the string length, this is neccessary.
    //Notice that! in old method used in backend would not include 'console' key, so the resConsole would be 'undefined'
    //there would be error under this ld method here
    if(resConsole.length>0) console.log(error.response.data.console);
    switch (error.response.data.code) {
      case 32: //meaning invalid authorization, need to authorize again & redirect.
        alert(error.response.data.message);
        window.location.assign('/signin'); //anauthorized with invalid token, reload to check the token
        return null; //return to inform iterator, meaning no need for further handleing
        break;
      case 33: //special for sign in, user not verified email
        return {code33: true, message: error.response.data.message};
        break;
      case 34: // from Unit '_set_UnitCurrent': no such Unit exist
        return !!error.response.data.message ? error.response.data.message : 'The Unit you request do not exist.';
        break;
      case 89: //meaning no token, redirect.
      //a missing token, no need to alert anything.
        window.location.assign('/');
        return false; //return to inform iterator, meaning no need for further handleing
      default:
    };
    return error.response.data.message;
  } else if (error.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      return null;
  } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error);
      return null;
  }
}
