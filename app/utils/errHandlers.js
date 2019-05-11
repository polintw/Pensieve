export function errHandler_axiosCatch (thrown, customSwitch){
  if (thrown.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    if(!customSwitch(thrown.response.status)){
      alert(thrown.response.data.message);
    };
  } else if (thrown.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(thrown.request);
  } else {
      // Something happened in setting up the request that triggered an Error
  }
  console.log('Error: ', thrown.message);
}

export function cancelErr(error){
  console.log('Request canceled: ', error.message);
}

export function uncertainErr(error){
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    let resConsole = error.response.data.console; // to verify the string length, this is neccessary.
    if(resConsole.length>0) console.log(error.response.data.console);
    switch (error.response.data.code) {
      case 32:
        window.location.reload();//anauthorized with invalid token, reload to check the token
        return;
        break;
      default:
    };
    return error.message;
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
