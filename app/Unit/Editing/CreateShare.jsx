import React from 'react';
import {connect} from "react-redux";
import EditingPanel from './EditingPanel.jsx';
import ModalBox from '../../Components/ModalBox.jsx';
import ModalBackground from '../../Components/ModalBackground.jsx';
import BooleanDialog from '../../Components/Dialog/BooleanDialog/BooleanDialog.jsx';
import SingleCloseDialog from '../../Components/Dialog/SingleCloseDialog/SingleCloseDialog.jsx';

import {
  switchUnitSubmitting
} from "../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../utils/errHandlers.js";

const initState = {
  editingModal: false,
  warningDialog: false,
  confirmDialog: false,
  dialogMessage: null,
  dialogPurpose: null,
  warningTemp: {}
};

class CreateShare extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingModal: false,
      warningDialog: false,
      confirmDialog: false,
      dialogMessage: null,
      dialogPurpose: null,
      warningTemp: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_post_Share_new = this._axios_post_Share_new.bind(this);
    this._set_Submit = this._set_Submit.bind(this);
    this._set_EditingClose_clear = this._set_EditingClose_clear.bind(this);
    this._set_EditingClose_andRefer = this._set_EditingClose_andRefer.bind(this);
    this._modalHandler_positive = this._modalHandler_positive.bind(this);
    this._modalHandler_negative = this._modalHandler_negative.bind(this);
    this._handleClick_CreateShare_init = this._handleClick_CreateShare_init.bind(this);
    this._open_editingModal = () => {this.setState({editingModal: true})};
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

  _handleClick_CreateShare_init(event){
    event.stopPropagation();
    event.preventDefault();
    this._open_editingModal();
  }

  _modalHandler_positive(){
    switch (this.state.dialogPurpose) {
      case 'refer':
        this.props._refer_von_Create(warningTemp.identity, warningTemp.source);
        break;
      case 'close': //confirm close the EditingModal
        this.setState(initState)
        break;
      case 'warning':
        this.setState({warningDialog: false, dialogMessage: null, dialogPurpose: null, warningTemp: {}})
        break;
      default:
        this.setState({dialogMessage: null, dialogPurpose: null, warningTemp: {}})
    }
  }

  _modalHandler_negative(){
    switch (this.state.dialogPurpose) {
      case 'close':
        this.setState({confirmDialog: false, dialogMessage: null, dialogPurpose: null, warningTemp: {}})
        break;
      case 'refer':
        this.setState({confirmDialog: false, dialogMessage: null, dialogPurpose: null, warningTemp: {}})
        break;
      default:
        this.setState({dialogMessage: null, dialogPurpose: null, warningTemp: {}})
    }
  }

  _set_EditingClose_clear(){
    if(this.props.unitSubmitting) this.setState({warningDialog: true, dialogMessage: 'still submitting, please hold on.', dialogPurpose: 'warning'});
    this.setState({
      dialogMessage: 'current input would not be saved after leaving, are you sure going to leave?',
      dialogPurpose: 'close',
      confirmDialog: true
    });
  }

  _set_EditingClose_andRefer(source, identity){
    this.setState({
      dialogMessage: 'current input would not be saved after leaving, are you sure going to leave?',
      dialogPurpose: 'refer',
      confirmDialog: true,
      warningTemp: {source: source, identity: identity}
    });
  }

  _set_Submit(stateObj){
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
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      //first, let redux state back, because this would last if the window not reload
      self.props._set_unitSubmitting(false);
      //then second call this, perhaps unmount the component so need to be called after redux state reset
      //pass the res data which including id of unit
      self.props._submit_Share_New(resObj.main);
      //local state was final, as a last defense in case the user click the submit during a very small 'window'
      self.setState(initState);
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

  componentDidUpdate(prevProps, prevState, snapshot){
    if(!!this.props.forceCreate && prevProps.forceCreate != this.props.forceCreate){
      // 'forceCreate': a method parent comp used to force the CreateShare open EditingPanel
      this._open_editingModal();
    }
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.Com_CreateShare_}
        onClick={this._handleClick_CreateShare_init}>
        {
          this.state.editingModal &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._set_EditingClose_clear} style={{position: "fixed"}}>
              <EditingPanel
                _refer_toandclose={this._set_EditingClose_andRefer}
                _set_Submit={this._set_Submit}
                _set_Clear={this._set_EditingClose_clear}/>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.state.confirmDialog &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed"}}>
              <div
                className={styles.boxDialog}>
                <BooleanDialog
                  customButton={"submitting"}
                  message={this.state.dialogMessage}
                  _positiveHandler={this._modalHandler_positive}
                  _negativeHandler={this._modalHandler_negative}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.props.warningDialog &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed"}}>
              <div
                className={"boxDialog"}>
                <SingleCloseDialog
                  message={this.state.dialogMessage}
                  _positiveHandler={this._modalHandler_positive}/>
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
