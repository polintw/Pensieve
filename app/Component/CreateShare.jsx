import React from 'react';
import {connect} from "react-redux";
import EditingModal from './Editing/EditingModal.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';
import {
  switchUnitSubmitting
} from "../redux/actions/general.js";

class CreateShare extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingModal: false,
      warningModal: false
    };
    this._open_editingModal = () => {this.setState({editingModal: true})};
    this._close_editingModal = () => {this.setState({editingModal: false})};
    this.axiosSource = axios.CancelToken.source();
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_CreateShare_init = this._handleClick_CreateShare_init.bind(this);
    this._handleClick_CreateShare_clear = this._handleClick_CreateShare_clear.bind(this);
    this._handleClick_CreateShare_SubmitFile = this._handleClick_CreateShare_SubmitFile.bind(this);
    this._axios_post_Share_new = this._axios_post_Share_new.bind(this);
    this.style={
      Com_CreateShare_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }
    }
  }

  _refer_toandclose(source, identity){
    this.setState({editingModal: false});
    this.props._refer_von_Create(identity, source);
  }

  _handleClick_CreateShare_init(event){
    event.stopPropagation();
    event.preventDefault();
    this._open_editingModal();
  }

  _handleClick_CreateShare_clear(){
    if(this.props.unitSubmitting){this.setState({warningModal: true});return;};
    this.setState({
      editingModal: false,
      warningModal: false
    })
  }

  _handleClick_CreateShare_SubmitFile(stateObj){
    //check form filled
    if(!stateObj["coverSrc"] || stateObj["nouns"]["list"].length < 1) {alert("fill the required area");return;};
    //Then if everything is fine
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
    axios.post('/router/user/'+self.props.userInfo.id+'/shareds', newObj, {
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
          self.props._submit_Share_New();
          self.setState({editingModal: false, warningModal: false});
        }else{
          console.log("Failed: "+ res.data.err);
          self.props._set_unitSubmitting(false);
          alert("Failed, please try again later");
        }
    }).catch(function (error) {
      if (axios.isCancel(error)) {
        self.props._set_unitSubmitting(false);
        console.log('Request canceled: ', error.message);
      } else {
        self.props._set_unitSubmitting(false);
        console.log(error);
        alert("Failed, please try again later");
      }
    });
  }

  render(){
    return(
      <div
        style={this.style.Com_CreateShare_}
        onClick={this._handleClick_CreateShare_init}>
        {
          this.state.editingModal &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._handleClick_CreateShare_clear} style={{position: "fixed"}}>
              <EditingModal
                _refer_toandclose={this._refer_toandclose}
                _set_Submit={this._handleClick_CreateShare_SubmitFile}
                _set_Clear={this._handleClick_CreateShare_clear}/>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.state.warningModal &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{backgroundColor: "transparent", position: "fixed"}}>
              <div
                style={{
                  width: '30%',
                  height: '20vh',
                  position: 'absolute',
                  top: '20vh',
                  left: '50%',
                  transform: 'translate(-50%,0)',
                  backgroundColor: 'white'
                }}>
                {"data is submitting, please hold on..."}
              </div>
            </ModalBackground>
          </ModalBox>
        }
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
)(CreateShare);
