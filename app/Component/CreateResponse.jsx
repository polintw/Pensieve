import React from 'react';
import {connect} from "react-redux";
import EditingModal from './Editing/EditingModal/EditingModal.jsx';
import {
  switchUnitSubmitting
} from "../redux/actions/general.js";

class CreateResponse extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_CreateResponse_SubmitFile = this._handleClick_CreateResponse_SubmitFile.bind(this);
    this._axios_post_Share_new = this._axios_post_Share_new.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      Com_Modal_CreateResponse: {

      }
    }
  }

  _refer_toandclose(source, identity){
    this.props._refer_von_unit(identity, source);
    this.props._set_Modalmode(false);
  }

  _handleClick_CreateResponse_SubmitFile(stateObj){
    let d = new Date();
    let submitTime = d.getTime();
    const newShareObj = {
      coverBase64: stateObj.coverSrc,
      beneathBase64: stateObj.beneathSrc,
      joinedMarks: Object.assign({}, stateObj.coverMarks.data, stateObj.beneathMarks.data),
      joinedMarksList: stateObj.coverMarks.list.concat(stateObj.beneathMarks.list),
      refsArr: stateObj.refsArr,
      nouns: stateObj.nouns,
      submitTime: submitTime
    };
    //all pure JS object or structure,
    //we don't need to do any JSON.stringify() here, because the axios would serve automatical transformation

    //don't set any parameter in the callback,
    //would take the variable above directly
    this._axios_post_Share_new(newShareObj);
  }

  _axios_post_Share_new(newObj){
    const self = this;
    self.props._set_unitSubmitting(true);
    axios.post('/router/share?primer='+this.props.unitId, newObj, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
        if(res.status = 201){
          console.log("share created successfully!");
          self.props._set_unitSubmitting(false);
          self._submit_Share_New();
        }else{
          console.log("Failed: "+ res.data.err);
          self.props._set_unitSubmitting(false);
          alert("Failed, please try again later");
        }
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        self.props._set_unitSubmitting(false);
        console.log('Request canceled: ', thrown.message);
      } else {
        self.props._set_unitSubmitting(false);
        if (thrown.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          alert('Something went wrong: '+thrown.response.data.message)
          if(thrown.response.status == 403){
            window.location.assign('/login');
          }
        } else if (thrown.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
            console.log(thrown.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error: ', thrown.message);
        }
        console.log("Error config: "+thrown.config);
      }
    });
  }

  _submit_Share_New(){
    window.location.assign('/user/cognition/actions/shareds/units?theater&unitId='+dataObj.unitId);
  }

  render(){
    return(
      <div
        style={this.props.mode?this.style.Com_Modal_CreateResponse:{display:"none"}}>
        <EditingModal
          _refer_toandclose={this._refer_toandclose}
          _set_Submit={this._handleClick_CreateResponse_SubmitFile}
          _set_Clear={this.props._set_Modalmode}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    _set_unitSubmitting: (bool)=>{dispatch(switchUnitSubmitting(bool));},
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateResponse);
