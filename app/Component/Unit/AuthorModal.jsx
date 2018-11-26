import React from 'React';
import {connect} from "react-redux";
import EditingModal from '../Editing/EditingModal.jsx';

class AuthorModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_authorModal_SubmitFile = this._handleClick_authorModal_SubmitFile.bind(this);
    this._axios_patch_Share = this._axios_patch_Share.bind(this);
    this._submit_Share_modified = this._submit_Share_modified.bind(this);
    this.style={
      Com_Modal_AuthorModal: {

      }
    }
  }

  _submit_Share_modified(){
    window.location.reload();
  }

  _refer_toandclose(source, identity){
    this.props._refer_von_unit(identity, source);
    this.props._set_Modalmode(false);
  }

  _handleClick_authorModal_SubmitFile(stateObj){
    //check form filled
    if(stateObj["nouns"]["list"].length < 1) {alert("fill the required area");return;};
    //Then if everything is fine
    let modifiedObj = {};
    Object.assign(modifiedObj, stateObj); //prevent data lost during unmount.
    let joinedMarksList = modifiedObj.coverMarks.list.concat(modifiedObj.beneathMarks.list);
    let joinedMarks = Object.assign({}, modifiedObj.coverMarks.data, modifiedObj.beneathMarks.data);
    let d = new Date();
    let submitTime = d.getTime();
    const modifiedShareObj = {
      joinedMarksList: joinedMarksList,
      joinedMarks: joinedMarks,
      refsArr: modifiedObj.refsArr,
      nouns: modifiedObj.nouns,
      submitTime: submitTime
    };
    //don't set any parameter in the callback,
    //would take the variable above directly
    this._axios_patch_Share(modifiedShareObj);
  }

  _axios_patch_Share(modifiedObj){
    const self = this;
    self.props._set_axios(true);
    axios.patch('/router/units/'+this.props.unitCurrent.unitId, modifiedObj, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function (res) {
        if(res.status = 201){
          console.log("successfully modified!");
          self.props._set_axios(false);
          self._submit_Share_modified();
        }else{
          console.log("Failed: "+ res.data.err);
          self.props._set_axios(false);
          alert("Failed, please try again later");
        }
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
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

  render(){
    return(
      <div
        style={this.style.Com_Modal_AuthorModal}>
        <EditingModal
          unitSet={this.props.unitSet}
          _refer_toandclose={this._refer_toandclose}
          _set_Submit={this._handleClick_authorModal_SubmitFile}
          _set_Clear={this.props._set_Modalmode}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default connect(
  mapStateToProps,
  null
)(AuthorModal);
