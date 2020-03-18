import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import EditingPanel from './EditingPanel.jsx';
import {
  setUnitView,
  switchUnitSubmitting
} from "../../redux/actions/unit.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class SharedEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.unitSet={
      authorBasic: this.props.unitCurrent.authorBasic,
      coverSrc: this.props.unitCurrent.coverSrc,
      coverMarks: {list: this.props.unitCurrent.coverMarksList.slice(), data: Object.assign({},this.props.unitCurrent.coverMarksData)},
      nodesSet: {assign: this.props.unitCurrent.nouns.list.slice(), tags:[]},
      createdAt: this.props.unitCurrent.createdAt,
      //beneath, is remaining for future use, and kept the parent comp to process submitting
      beneathSrc: null,
      beneathMarks: {list:[],data:{}},
      refsArr: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._set_Submit = this._set_Submit.bind(this);
    this._axios_patch_Share = this._axios_patch_Share.bind(this);
    this._submit_Share_modified = this._submit_Share_modified.bind(this);
  }

  _submit_Share_modified(){
    //reset UnitCurrent to reload the view
    this.props._reset_UnitMount();
  }

  _refer_toandclose(source, identity){

  }

  _set_EditingClose_clear(){

  }

  _set_warningDialog(message, purpose, tempObj){
    this.setState({
      dialogMessage: message,
      dialogPurpose: purpose,

    })
  }

  _set_Submit(stateObj){
    let d = new Date();
    let submitTime = d.getTime();

    const modifiedShareObj = {
      joinedMarks: Object.assign({}, stateObj.coverMarks.data, stateObj.beneathMarks.data),
      joinedMarksList: stateObj.coverMarks.list.concat(stateObj.beneathMarks.list),
      refsArr: stateObj.refsArr,
      nodesSet: stateObj.nodesSet,
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
        className={classnames(styles.boxEditinginCreate)}>
        <EditingPanel
          unitSet={this.unitSet}
          _refer_toandclose={this._refer_toandclose}
          _set_warningDialog={this._set_warningDialog}
          _set_Submit={this._set_Submit}
          _set_Clear={this._set_EditingClose_clear}/>
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SharedEdit);
