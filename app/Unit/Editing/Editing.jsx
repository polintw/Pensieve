import React from 'react';
import {connect} from "react-redux";
import {
  switchUnitSubmitting
} from "../redux/actions/general.js";
import EditingModal from '../Component/Editing/EditingModal/EditingModal.jsx';

class Editing extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.unitSet={
      authorBasic: this.props.unitCurrent.authorBasic,
      coverSrc: this.props.unitCurrent.coverSrc,
      beneathSrc: this.props.unitCurrent.beneathSrc,
      coverMarks: {list: this.props.unitCurrent.coverMarksList.slice(), data: Object.assign({},this.props.unitCurrent.coverMarksData)},
      beneathMarks: {list: this.props.unitCurrent.beneathMarksList.slice(), data: Object.assign({},this.props.unitCurrent.beneathMarksData)},
      nouns: {list: this.props.unitCurrent.nouns.list.slice(), basic: Object.assign({},this.props.unitCurrent.nouns.basic)},
      refsArr: this.props.unitCurrent.refsArr,
      createdAt: this.props.unitCurrent.createdAt
    };
    //beacuse wwe are going to modify the 'content', we need to seperate them from current Unit state in reducer
    //---then we could still keep chance to truly 'cancel' the editing
    this.axiosSource = axios.CancelToken.source();
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_Editing_SubmitFile = this._handleClick_Editing_SubmitFile.bind(this);
    this._axios_patch_Share = this._axios_patch_Share.bind(this);
    this._submit_Share_modified = this._submit_Share_modified.bind(this);
    this.style={
      Com_Modal_Editing: {

      }
    }
  }

  _submit_Share_modified(){
    this.props._set_Modalmode('viewer');
    this.props._reset_UnitMount();
  }

  _refer_toandclose(source, identity){
    this.props._refer_von_unit(identity, source);
    this.props._set_Modalmode(false);
  }

  _handleClick_Editing_SubmitFile(stateObj){
    let d = new Date();
    let submitTime = d.getTime();

    const modifiedShareObj = {
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
    this._axios_patch_Share(modifiedShareObj);
  }

  _axios_patch_Share(modifiedObj){
    const self = this;
    self.props._set_unitSubmitting(true);
    axios.patch('/router/share/'+this.props.unitCurrent.unitId+'/editing', modifiedObj, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
        if(res.status = 201){
          console.log("successfully modified!");
          self.props._set_unitSubmitting(false);
          self._submit_Share_modified();
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

  render(){
    return(
      <div
        style={this.style.Com_Modal_Editing}>
        <EditingModal
          unitSet={this.unitSet}
          _refer_toandclose={this._refer_toandclose}
          _set_Submit={this._handleClick_Editing_SubmitFile}
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
)(Editing);
