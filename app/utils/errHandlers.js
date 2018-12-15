export function errHandler_axiosCatch (thrown, customSwitch){
  if (thrown.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    if(!customSwitch(thrown.resonse.status)){
      alert(thrown.message);
    };
  } else if (thrown.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(thrown.request);
  } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error: ', thrown.message);
  }
  console.log("Error config: "+thrown.config);
}
