import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SwitchResponds from './SwitchResponds.jsx';
import {
  setMessageBoolean,
} from "../../../../redux/actions/general.js";
import {messageDialogInit} from "../../../../redux/states/constants.js";

class LayerSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSpanResponds: false
    };
    this._set_Dialog = this._set_Dialog.bind(this);
    this._handleClick_LinkListResponds = this._handleClick_LinkListResponds.bind(this);
    this._handleEnter_spanResponds = this._handleEnter_spanResponds.bind(this);
    this._handleLeave_spanResponds = this._handleLeave_spanResponds.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');
    // modification for small screen
    let cssVW = window.innerWidth; // px of vw in pure integer

    return (this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) < 0) ? // guidingNails do not show the Respond & view responds
      (
        <div
          className={classnames(styles.comLayerSwitch)}>
          {
            !(this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack') && // if the 'user' are guest, not signed in yet
            <SwitchResponds {...this.props}/>
          }
          <span
            className={classnames(
              'fontContentPlain', styles.spanResponds,
                {
                  [styles.spanRespondsActiv]: this.state.onSpanResponds,
                  ['colorWhite']: this.state.onSpanResponds,
                  ['colorDarkGrey']: (!this.state.onSpanResponds && cssVW > 860),
                  ['colorWhiteGrey']: (!this.state.onSpanResponds && cssVW <= 860),
                }
              )}
              onClick={this._handleClick_LinkListResponds}
              onTouchStart={this._handleEnter_spanResponds}
              onTouchEnd={this._handleLeave_spanResponds}
              onMouseEnter={this._handleEnter_spanResponds}
              onMouseLeave={this._handleLeave_spanResponds}>
            {this.props.i18nUIString.catalog['link_UnitListResponds']}
          </span>
        </div>
      ): null;
  }

  _handleClick_LinkListResponds(event) {
    event.preventDefault();
    event.stopPropagation();
    if(this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack'){ // if the 'user' are guest, not signed in yet
      this._set_Dialog();
    };
    this.props._set_state_UnitView("related");
    // now the unitView was switch by the param in URL
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    let nextSearch = this.props.location.search.replace("unitView=theater","unitView=related");
    this.props.history.push({
      pathname: this.props.match.path,
      search: nextSearch,
      state: {from: this.props.location}
    });
  }

  _set_Dialog(source){
    let message = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind_LayerSwitch'];
    message = message;

    this.props._submit_BooleanDialog({
      render: true,
      customButton: "sign",
      message: [{
        text: message,
        style:{}}],
      handlerPositive: ()=>{ // basically all the condition are the same result
        window.location.assign('/');
      },
      handlerNegative: ()=>{this.props._submit_BooleanDialog(messageDialogInit.boolean);return;}
    });
  }

  _handleEnter_spanResponds(e){
    this.setState({onSpanResponds: true})
  }

  _handleLeave_spanResponds(e){
    this.setState({onSpanResponds: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    tokenStatus: state.token,
    unitSubmitting: state.unitSubmitting,
    guidingNailsId: state.guidingNailsId,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_BooleanDialog: (obj)=>{dispatch(setMessageBoolean(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerSwitch));
