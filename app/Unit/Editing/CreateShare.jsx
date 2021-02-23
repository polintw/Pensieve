import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import EditingPanel from './EditingPanel.jsx';
import ModalBox from '../../Components/ModalBox.jsx';
import ModalBackground from '../../Components/ModalBackground.jsx';
import BooleanDialog from '../../Components/Dialog/BooleanDialog/BooleanDialog.jsx';
import SingleCloseDialog from '../../Components/Dialog/SingleCloseDialog/SingleCloseDialog.jsx';

import {
  switchUnitSubmitting
} from "../../redux/actions/unit.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const initState = {
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
      localClickCheck: false,
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
    this._set_warningDialog = this._set_warningDialog.bind(this);
    this._set_confirmDialog = this._set_confirmDialog.bind(this);
    this._modalHandler_positive = this._modalHandler_positive.bind(this);
    this._modalHandler_negative = this._modalHandler_negative.bind(this);
    this._handleClick_CreateShare_init = this._handleClick_CreateShare_init.bind(this);
    this._open_editingModal = this._open_editingModal.bind(this);
    this._close_editingModal = this._close_editingModal.bind(this);
  }

  _handleClick_CreateShare_init(event){
    event.stopPropagation();
    event.preventDefault();
    this._open_editingModal();
  }

  _set_confirmDialog(message, purpose, tempObj){
    /*
      actually, the Dialog series should use state in Redux reducer,
      shift in the future. so does the warningDialog below.
    */
    let warningTemp = {
      source: !!tempObj ? tempObj.source: '',
      identity: !!tempObj ? tempObj.identity: ''
    }; //tempObj was an optional param

    this.setState({
      dialogMessage: message,
      dialogPurpose: purpose,
      confirmDialog: true,
      warningTemp: warningTemp
    })
  }

  _set_warningDialog(message, purpose, tempObj){
    this.setState({
      dialogMessage: message,
      dialogPurpose: purpose,
      warningDialog: true,
    })
  }

  _modalHandler_positive(){
    switch (this.state.dialogPurpose) {
      case 'close': //confirm close the EditingModal
        this.setState(initState);
        this._close_editingModal();
        break;
      case 'refer':
        this.props._refer_von_Create(warningTemp.identity, warningTemp.source);
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
    if(this.props.unitSubmitting) {this._set_warningDialog([{text: 'still submitting, please hold on.',style:{}}], 'warning');}
    else this._set_confirmDialog([{text:'Your change will NOT be saved, do you still want to leave?',style:{}}], 'close'); //Original:'current input would not be saved after leaving, are you sure going to leave?'
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
      nodesSet: stateObj.nodesSet,
      submitTime: submitTime,
      outboundLinkMain: stateObj.outboundLinkMain,
      authorIdentity: stateObj.authorIdentity,
      exifGps: stateObj.exifGps
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
    axios.post('/router/share/create', newObj, {
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
    };
    // and echo to the design in _open_editingModal(), reset state 'localClickCheck'
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsCreating = params.has('creating'); //bool, true if there is 'creating'
    if( !paramsCreating && this.state.localClickCheck ){
      this.setState({
        localClickCheck: false
      });
    };
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.props.unitSubmitting){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsCreating = params.has('creating'); //bool, true if there is 'creating'

    return(
      <div
        className={classnames(styles.comCreateShare)}
        onClick={this._handleClick_CreateShare_init}>
        {
          (paramsCreating && this.state.localClickCheck) &&
          <ModalBox containerId="root">
            <ModalBackground
              onClose={this._set_EditingClose_clear}
              style={{
                position: "fixed",
                backgroundColor: 'rgba(51, 51, 51, 0.3)'
              }}>
              <div
                className={classnames(styles.boxEditinginCreate)}>
                <EditingPanel
                  confirmDialog={this.state.confirmDialog}
                  warningDialog={this.state.warningDialog}
                  _set_warningDialog={this._set_warningDialog}
                  _set_Submit={this._set_Submit}
                  _set_Clear={this._set_EditingClose_clear}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.state.confirmDialog &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed"}}>
              <div
                className={"boxDialog"}>
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
          this.state.warningDialog &&
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

  _open_editingModal(){
    /*
      Important!! We open EditingModal by the path, but there are conditions would have more 1 CreateShare on the page,
      like the user do not have any Shareds at the very beginning. So, we set a "checkpoint" here,
      by a additional local state.
      And! we would reset it immediately after the param "creating" rm from the props.path
    */
    this.setState({
      localClickCheck: true
    });

    // we modify the url to allow user using 'previous page' for going back
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: (this.props.location.search.length> 0) ? this.props.location.search+"&creating" : '?creating',
      state: {from: this.props.location}
    });
  }

  _close_editingModal(){
    // Only used if 'cancel'!
    // any successfully submit should inform the parent to close preventing possible overlap
    let lastState = this.props.location.state.from ; // because we are pretty sure there is a "from" obj when opened EditingModal
    this.props.history.replace({
      pathname: lastState.pathname,
      search: lastState.search,
      state: lastState.state
    });
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
