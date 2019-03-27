// !different from errHandlers from toppest /utils

export function cancelErr(error, props){
  props._set_axiosStatus(false);
  console.log('Request canceled: ', error.message);
}

export function uncertainErr(error, props){
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    let resConsole = error.response.data.console; // to verify the string length, this is neccessary.
    if(resConsole.length>0) console.log(error.response.data.console);
    props._set_axiosRes({axiosStatus: false, message: error.response.data.message});
  } else if (error.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      props._set_axiosStatus(false);
      console.log(error.request);
  } else {
      props._set_axiosStatus(false);
      // Something happened in setting up the request that triggered an Error
  }
  console.log('Error: ', error.message);
}
