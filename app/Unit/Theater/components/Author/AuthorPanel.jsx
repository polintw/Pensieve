import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  _axios_patch_ShareErase} from '../../../utils.js';
import {
  setUnitView,
  switchUnitSubmitting
} from "../../../../redux/actions/unit.js";
import {
  setMessageBoolean,
  setMessageSingleClose
} from "../../../../redux/actions/general.js";
import {messageDialogInit} from "../../../../redux/states/constants.js";

class AuthorPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: true
    };
    this.axiosSource = axios.CancelToken.source();
    this._submit_SharedErased = this._submit_SharedErased.bind(this);
    this._handleClick_UnitAction_edit = this._handleClick_UnitAction_edit.bind(this);
    this._handleClick_UnitAction_erase = this._handleClick_UnitAction_erase.bind(this);
    this.style={
      Com_AuthorPanel_: {
        display: 'flex',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_AuthorPanel_span: {
        boxSizing: 'border-box',
        fontSize: '1.5rem',
        letterSpacing: '0.12rem',
        fontWeight: '300',
        cursor: 'pointer'
      }
    };
  }

  _handleClick_UnitAction_edit(event){
    event.preventDefault();event.stopPropagation();
    this.props._set_state_UnitView("editing");
  }

  _handleClick_UnitAction_erase(event){
    event.preventDefault();event.stopPropagation();
    this.props._submit_BooleanDialog({
      render: true,
      customButton: null,
      message: [
        {text: this.props.i18nUIString.catalog['message_Unit_EraseConfirm'][0],style:{}},
        {text: this.props.i18nUIString.catalog['message_Unit_EraseConfirm'][1],style:{}}],
      handlerPositive: ()=>{
        this._submit_SharedErased();
        this.props._submit_BooleanDialog(messageDialogInit.boolean);},
      handlerNegative: ()=>{this.props._submit_BooleanDialog(messageDialogInit.boolean);return;}
    });
  }

  _submit_SharedErased(){
    const self = this;
    self.props._set_unitSubmitting(true);

    _axios_patch_ShareErase(this.axiosSource.token, this.props.unitCurrent.unitId)
    .then(()=>{
      this.props._submit_SingleCloseDialog({
        render: true,
        message: [{text: this.props.i18nUIString.catalog['message_Unit_EraseRes'][0],style:{}}], //format follow Boolean, as [{text: '', style:{}}]
        handlerPositive: ()=>{
          this.props._submit_SingleCloseDialog(messageDialogInit.singleClose);
          window.location.assign('/');}
      });
    })
    .catch(function (thrown) {
      self.props._set_unitSubmitting(false);
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if (message) alert(message);
      }
    });
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_AuthorPanel_}>
        <span
          style={this.style.Com_AuthorPanel_span}
          onClick={this._handleClick_UnitAction_edit}>
          {"edit"}
        </span>
        <span
          style={this.style.Com_AuthorPanel_span}
          onClick={this._handleClick_UnitAction_erase}>
          {"erase"}
        </span>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    unitSubmitting: state.unitSubmitting,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_SingleCloseDialog: (obj)=>{dispatch(setMessageSingleClose(obj));},
    _submit_BooleanDialog: (obj)=>{dispatch(setMessageBoolean(obj));},
    _set_unitSubmitting: (bool)=>{dispatch(switchUnitSubmitting(bool));},
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorPanel));
