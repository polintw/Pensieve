import React from 'react';
import {connect} from "react-redux";
import EditingModal from '../Editing/EditingModal.jsx';
import {
  switchUnitSubmitting
} from "../../redux/actions/general.js";

class UnitEditing extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_UnitEditing_SubmitFile = this._handleClick_UnitEditing_SubmitFile.bind(this);
    this._axios_patch_Share = this._axios_patch_Share.bind(this);
    this._submit_Share_modified = this._submit_Share_modified.bind(this);
    this.style={
      Com_Modal_UnitEditing: {

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

  _handleClick_UnitEditing_SubmitFile(stateObj){
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
    axios.patch('/router/units/'+this.props.unitCurrent.unitId, modifiedObj, {
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
    const unitCurrent = this.props.unitCurrent;
    let unitSet={
      authorBasic: unitCurrent.authorBasic,
      coverSrc: unitCurrent.coverSrc,
      beneathSrc: unitCurrent.beneathSrc,
      coverMarks: {list: unitCurrent.coverMarksList, data: unitCurrent.coverMarksData},
      beneathMarks: {list: unitCurrent.beneathMarksList, data: unitCurrent.beneathMarksData},
      nouns: unitCurrent.nouns,
      refsArr: unitCurrent.refsArr,
      createdAt: unitCurrent.createdAt
    };
    return(
      <div
        style={this.style.Com_Modal_UnitEditing}>
        <EditingModal
          unitSet={unitSet}
          _refer_toandclose={this._refer_toandclose}
          _set_Submit={this._handleClick_UnitEditing_SubmitFile}
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
)(UnitEditing);
