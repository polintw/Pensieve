export function cancelErr(error){
  console.log('Request canceled: ', error.message);
}

export function uncertainErr(error){
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    let resConsole = error.response.data.console; // to verify the string length, this is neccessary.
    //Notice that! in old method used in backend would not include 'console' key, so the resConsole would be 'undefined'
    //there would be error under this ld method here
    if(resConsole.length>0) console.log(error.response.data.console);
    switch (error.response.data.code) {
      case 32: //meaning no token or need to authorize again, need to redirect
        alert(error.response.data.message);
        window.location.assign('/s/signin'); //anauthorized with invalid token, reload to check the token
        return null; //return to inform iterator, meaning no need for further handleing
      case 121: //in /MatchSet, the error return by server which usually means you already have taken a node
        return "message_Main_forbbidenWish";
      case 123: //in /MatchSet, the error return by server which usually means you already have taken a node
        return "message_Main_duplicateTaking";
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
