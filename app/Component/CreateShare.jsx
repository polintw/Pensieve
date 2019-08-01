import React from 'react';
import {connect} from "react-redux";
import EditingModal from './Editing/EditingModal/EditingModal.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';
import WarningModal from './WarningModal.jsx';
import {
  switchUnitSubmitting
} from "../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../utils/errHandlers.js";

class CreateShare extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingModal: false,
      warningModal: false,
      warningType: null,
      warningTemp: {}
    };
    this._open_editingModal = () => {this.setState({editingModal: true})};
    this._close_editingModal = () => {this.setState({editingModal: false})};
    this.axiosSource = axios.CancelToken.source();
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._axios_post_Share_new = this._axios_post_Share_new.bind(this);
    this._set_WarningModal_positive = this._set_WarningModal_positive.bind(this);
    this._set_WarningModal_negative = this._set_WarningModal_negative.bind(this);
    this._handleClick_CreateShare_init = this._handleClick_CreateShare_init.bind(this);
    this._handleClick_CreateShare_clear = this._handleClick_CreateShare_clear.bind(this);
    this._handleClick_CreateShare_SubmitFile = this._handleClick_CreateShare_SubmitFile.bind(this);
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

  _set_WarningModal_positive(){
    switch (this.state.warningType) {
      case 'refer':
        this.props._refer_von_Create(warningTemp.identity, warningTemp.source);
        break;
      case 'close': //confirm close the EditingModal
        this.setState({editingModal: false, warningModal: false, warningType: null, warningTemp: {}})
        break;
      default://case include warning, and submitting
        this.setState({warningModal: false, warningType: null, warningTemp: {}})
    }
  }

  _set_WarningModal_negative(){
    switch (this.state.warningType) {
      case 'close':
        this.setState({warningModal: false, warningType: null, warningTemp: {}})
        break;
      case 'refer':
        this.setState({warningModal: false, warningType: null, warningTemp: {}})
        break;
      default:
        this.setState({warningModal: false, warningType: null, warningTemp: {}})
    }
  }

  _handleClick_CreateShare_init(event){
    event.stopPropagation();
    event.preventDefault();
    this._open_editingModal();
  }

  _handleClick_CreateShare_clear(){
    if(this.props.unitSubmitting) this.setState({warningModal: 'still submitting, please hold on.', warningType: 'submitting'});
    this.setState({
      warningModal: 'current input would not be saved after leaving, are you sure going to leave?',
      warningType: 'close',
    });
  }

  _refer_toandclose(source, identity){
    this.setState({
      warningModal: 'current input would not be saved after leaving, are you sure going to leave?',
      warningType: 'refer',
      warningTemp: {source: source, identity: identity}
    });
  }

  _handleClick_CreateShare_SubmitFile(stateObj){
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
    axios.post('/router/share', newObj, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      self.props._submit_Share_New();
      //these two should laster than _submit_Share_New(), in case the small 'window' could click submit again happen
      self.props._set_unitSubmitting(false);
      self.setState({editingModal: false, warningModal: false, warningType: null});
    }).catch(function (thrown) {
      self.props._set_unitSubmitting(false);
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
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
          <WarningModal
            type={this.state.warningType}
            message={this.state.warningModal}
            _set_WarningModal_positive={this._set_WarningModal_positive}
            _set_WarningModal_negative={this._set_WarningModal_negative}/>
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
