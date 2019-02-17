import React from 'React';
import {connect} from "react-redux";
import EditingModal from '../Editing/EditingModal.jsx';
import {
  switchUnitSubmitting
} from "../../redux/actions/general.js";

class ResModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_resModal_SubmitFile = this._handleClick_resModal_SubmitFile.bind(this);
    this._axios_post_Share_new = this._axios_post_Share_new.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      Com_Modal_ResModal: {

      }
    }
  }

  _refer_toandclose(source, identity){
    this.props._refer_von_unit(identity, source);
    this.props._set_Modalmode(false);
  }

  _handleClick_resModal_SubmitFile(stateObj){
    //check form filled
    if(!stateObj["coverSrc"] || stateObj["nouns"]["list"].length < 1) {alert("fill the required area");return;};
    //Then if everything is fine
    let d = new Date();
    let submitTime = d.getTime();

    const newShareObj = {
      coverBase64: stateObj.coverSrc,
      beneathBase64: stateObj.beneathSrc,
      joinedMarks: stateObj.joinedMarks,
      refsArr: stateObj.refsArr,
      nouns: stateObj.nouns,
      submitTime: submitTime
    };
    //don't set any parameter in the callback,
    //would take the variable above directly
    this._axios_post_Share_new(newShareObj);
  }

  _axios_post_Share_new(newObj){
    const self = this;
    self.props._set_unitSubmitting(true);
    axios.post('/router/user/'+self.props.userInfo.id+'/shareds?primer='+this.props.unitId, newObj, {
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
    window.location.assign("/cosmic/units/"+this.props.unitId+"/related");
  }

  render(){
    return(
      <div
        style={this.props.mode?this.style.Com_Modal_ResModal:{display:"none"}}>
        <EditingModal
          _refer_toandclose={this._refer_toandclose}
          _set_Submit={this._handleClick_resModal_SubmitFile}
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
)(ResModal);
