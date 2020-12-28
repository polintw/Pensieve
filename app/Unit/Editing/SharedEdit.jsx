import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import EditingPanel from './EditingPanel.jsx';
import {
  setMessageBoolean,
  setMessageSingleClose
} from "../../redux/actions/general.js";
import {
  setUnitView,
  switchUnitSubmitting
} from "../../redux/actions/unit.js";
import {messageDialogInit} from "../../redux/states/constants.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class SharedEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    let currentNodesList = this.props.unitCurrent.nouns.list.slice();
    //actually, this is not a good method. The better one should be, get format like the nodesSet as required here when GET unitCurrent from api
    //or at least, make the nodes in unitCurrent by compareing the the belongsByType.
    let assignedList = currentNodesList.map((nodeId, index)=>{return {nodeId: nodeId}});
    //(the description above means, the props.unitCurrent only has a simple array to contain the nodes from attribution, do not have info about 'type')

    this.unitSet={
      authorBasic: this.props.unitCurrent.authorBasic,
      coverSrc: this.props.unitCurrent.coverSrc,
      coverMarks: {list: this.props.unitCurrent.coverMarksList.slice(), data: Object.assign({},this.props.unitCurrent.coverMarksData)},
      nodesSet: assignedList,
      createdAt: this.props.unitCurrent.createdAt,
      outboundLinkObj: !!this.props.unitCurrent.outBoundLink['main'] ? {urlString: this.props.unitCurrent.outBoundLink['main']}: {},
      imgLocation: this.props.unitCurrent.imgLocation,
      //beneath, is remaining for future use, and kept the parent comp to process submitting
      beneathSrc: null,
      beneathMarks: {list:[],data:{}},
      refsArr: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_Submit = this._set_Submit.bind(this);
    this._set_Submitwarning = this._set_Submitwarning.bind(this);
    this._set_EditingClose_clear = this._set_EditingClose_clear.bind(this);
    this._handleClick_bg = this._handleClick_bg.bind(this);
    this._axios_patch_Share = this._axios_patch_Share.bind(this);
    this._submit_Share_modified = this._submit_Share_modified.bind(this);
  }

  _submit_Share_modified(){
    //reset UnitCurrent to reload the view
    this.props._reset_UnitMount(); //reset unitCurrent
    this.props._set_state_UnitView('theater'); //back to theater view
    let lastState = this.props.location.state.from ; // because we are pretty sure there is a "from" obj when opened EditingModal
    this.props.history.replace({
      pathname: lastState.pathname,
      search: lastState.search,
      state: lastState.state
    });
  }

  _handleClick_bg(event){
    event.preventDefault();
    event.stopPropagation();
    this._set_EditingClose_clear();
  }

  _set_EditingClose_clear(){
    //any clear passed up we all confirm again, incl. warning if submitting
    if(this.props.unitSubmitting){
      this.props._submit_SingleCloseDialog({
        render: true,
        message: [{text: 'still submitting, please hold on.',style:{}}], //format follow Boolean, as [{text: '', style:{}}]
        handlerPositive: ()=>{this.props._submit_SingleCloseDialog(messageDialogInit.singleClose); return;}
      });
    }
    else {
      this.props._submit_BooleanDialog({
        render: true,
        customButton: null,
        message: [{text:'Your change will NOT be saved, do you still want to leave?',style:{}}], //Original:'current input would not be saved after leaving, are you sure going to leave?'
        handlerPositive: ()=>{
          this.props._set_state_UnitView('theater');
          let lastState = this.props.location.state.from ; // because we are pretty sure there is a "from" obj when opened EditingModal
          this.props.history.replace({
            pathname: lastState.pathname,
            search: lastState.search,
            state: lastState.state
          });
          this.props._submit_BooleanDialog(messageDialogInit.boolean)},
        handlerNegative: ()=>{this.props._submit_BooleanDialog(messageDialogInit.boolean);return;}
      });
    };
  }

  _set_Submitwarning(messageArr, purpose){ //the child '_set_warningDialog' is a old style for warningDialog controled locally,
    //so the param 'purpose' could be ignored at this new style
    this.props._submit_SingleCloseDialog({
      render: true,
      message: messageArr, //format follow Boolean, as [{text: '', style:{}}]
      handlerPositive: ()=>{this.props._submit_SingleCloseDialog(messageDialogInit.singleClose); return;}
    });
  }

  _set_Submit(stateObj){
    let d = new Date();
    let submitTime = d.getTime();

    const modifiedShareObj = {
      joinedMarks: Object.assign({}, stateObj.coverMarks.data, stateObj.beneathMarks.data),
      joinedMarksList: stateObj.coverMarks.list.concat(stateObj.beneathMarks.list),
      refsArr: stateObj.refsArr,
      nodesSet: stateObj.nodesSet,
      outboundLinkMain: stateObj.outboundLinkMain,
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
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      //first, let redux state back, because this would last if the window not reload
      self.props._set_unitSubmitting(false);
      if(res.status = 201){
        self._submit_Share_modified();
      }else{
        console.log("Failed: "+ res.data.err);
        alert("Failed, please try again later");
      }
    }).catch(function (thrown) {
      self.props._set_unitSubmitting(false);
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if (message) alert(message);
      }
    });
  }

  render(){
    return(
      <div
        className={classnames('boxAbsoluteFull', styles.comSharedEdit)}
        onClick={this._handleClick_bg}>
        <div
          className={classnames(styles.boxEditinginCreate)}>
          <EditingPanel
            unitSet={this.unitSet}
            _set_warningDialog={this._set_Submitwarning}
            _set_Submit={this._set_Submit}
            _set_Clear={this._set_EditingClose_clear}/>
        </div>
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
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));},
    _submit_SingleCloseDialog: (obj)=>{dispatch(setMessageSingleClose(obj));},
    _submit_BooleanDialog: (obj)=>{dispatch(setMessageBoolean(obj));},
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SharedEdit);
