import {
  
} from '../constants/typesSign.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function handleSignUser(sumitObj) =>{
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch) => {
    axios.post('/api/users/login', user)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
  }
}

export function handleNounsList(nounsArr) {
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currNouns =  getState().nounsBasic;
    let fetchList = [];
    nounsArr.forEach((id, index)=>{
      if(!(id in currNouns)){
        fetchList.push(id)
      }
    });
    if(fetchList.length<1){dispatch({type: null}); return;};
    //corresponding to the local state 'axios', we should also insert 'isFetching' state in reducer
    axios.get('/router/nouns/basic', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        fetchList: fetchList
      }
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      dispatch({type: UPDATE_NOUNSBASIC, newFetch: resObj.main.nounsBasic});
    }).catch(function (thrown) {
      let customSwitch = (status)=>{
        return null
      };
      errHandler_axiosCatch(thrown, customSwitch);
    });
  }
}
