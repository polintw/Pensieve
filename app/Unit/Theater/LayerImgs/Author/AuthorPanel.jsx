import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './stylesStatics.module.css';
import stylesWrapper from '../styles.module.css';
import stylesFont from '../../../stylesFont.module.css';
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
      axios: false,
      onEnterSubmit: false,
      onEnterDelete: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleEnter_Delete = this._handleEnter_Delete.bind(this);
    this._handleLeave_Delete = this._handleLeave_Delete.bind(this);
    this._submit_SharedErased = this._submit_SharedErased.bind(this);
    this._handleClick_UnitAction_edit = this._handleClick_UnitAction_edit.bind(this);
    this._handleClick_UnitAction_erase = this._handleClick_UnitAction_erase.bind(this);
  }

  _handleClick_UnitAction_edit(event){
    event.preventDefault();event.stopPropagation();
    this.props._set_state_UnitView("editing");
    // now the unitView was switch by the param in URL
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    let nextSearch = this.props.location.search.replace("unitView=theater","unitView=editing");
    this.props.history.push({
      pathname: this.props.match.path,
      search: nextSearch,
      state: {from: this.props.location}
    });
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
          window.location.assign('/self/shareds');}
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
        className={classnames(styles.comAuthorPanel)}>
        <div
          className={classnames(
            stylesWrapper.btnSubmit,
            styles.btnAuthorErase
            )}
          style={(this.state.onEnterDelete )? {backgroundColor: "#757575", cursor: 'pointer'}:{}}
          onClick={this._handleClick_UnitAction_erase}
          onMouseEnter={this._handleEnter_Delete}
          onMouseLeave={this._handleLeave_Delete}>
          <span
            className={classnames(
              'centerAlignChild',
              stylesFont.fontSubmit,
              {[stylesFont.colorEditBlack]: !this.state.onEnterDelete},
              {[stylesFont.colorWhite]: this.state.onEnterDelete}
            )}>
            {this.props.i18nUIString.catalog["submit_erase"]}
          </span>
        </div>
        <div
          className={classnames(stylesWrapper.btnSubmit)}
          style={Object.assign({},
            (this.state.onEnterSubmit)? {backgroundColor: "#ff8168", cursor: 'pointer'}:
            {backgroundColor: 'rgba(255, 129, 104, 0.1)'}
          )}
          onClick={this._handleClick_UnitAction_edit}
          onMouseEnter={this._handleEnter_Submit}
          onMouseLeave={this._handleLeave_Submit}>
          <span
            className={classnames(
              'centerAlignChild',
              stylesFont.fontSubmit,
              {[stylesFont.colorStandard]: (!this.state.onEnterSubmit)},
              {[stylesFont.colorWhite]: (this.state.onEnterSubmit)}
            )}>
            {this.props.i18nUIString.catalog["submit_edit"]}
          </span>
        </div>

      </div>
    )
  }

  _handleEnter_Submit(e){
    this.setState({
      onEnterSubmit: true
    })
  }

  _handleLeave_Submit(e){
    this.setState({
      onEnterSubmit: false
    })
  }

  _handleEnter_Delete(e){
    this.setState({
      onEnterDelete: true
    })
  }

  _handleLeave_Delete(e){
    this.setState({
      onEnterDelete: false
    })
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
