import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../../stylesFont.module.css';

export class LinkMailResend extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onMailResend: false
    };
    this._handleMouseOn_MailResend = ()=> this.setState((prevState,props)=>{return {onMailResend: prevState.onMailResend?false:true}});
  }

  render(){
    return this.props.location.pathname.includes('/sign') ? (
      <Link to="/resend?purpose=verifications"
        onMouseEnter={this._handleMouseOn_MailResend}
        onMouseLeave={this._handleMouseOn_MailResend}>
        <span
          className={classnames(
            styles.spanAssist,
            stylesFont.fontContentPlain,
            stylesFont.colorEditBlack,
            {[styles.spanAssistOnMouse]: this.state.onMailResend})}>
          {this.props.i18nUIString.catalog["link_Sign_mailResend"]}
        </span>
      </Link>
    ): (
      <a
        href={'/s/resend?purpose=verifications'}
        target={'_self'}
        onMouseEnter={this._handleMouseOn_MailResend}
        onMouseLeave={this._handleMouseOn_MailResend}>
        <span
          className={classnames(
            styles.spanAssist,
            stylesFont.fontContentPlain,
            stylesFont.colorEditBlack,
            {[styles.spanAssistOnMouse]: this.state.onMailResend})}>
          {this.props.i18nUIString.catalog["link_Sign_mailResend"]}
        </span>
      </a>
    )
  }
}

export class LinkForgetPw extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onForgetPw: false
    };
    this._handleMouseOn_forgetPw = ()=> this.setState((prevState,props)=>{return {onForgetPw: prevState.onForgetPw?false:true}});
  }

  render(){
    return this.props.location.pathname.includes('/sign') ? (
      <Link
        to="/resend?purpose=password"
        className={classnames('plainLinkButton')}
        onMouseEnter={this._handleMouseOn_forgetPw}
        onMouseLeave={this._handleMouseOn_forgetPw}>
        <span
          className={classnames(
            styles.spanAssist,
            stylesFont.fontContentPlain,
            stylesFont.colorEditBlack,
            {[styles.spanAssistOnMouse]: this.state.onForgetPw}
          )}>
          {"Forget password?"}</span>
      </Link>
    ): (
      <a
        href={'/s/resend?purpose=password'}
        target={'_self'}
        onMouseEnter={this._handleMouseOn_forgetPw}
        onMouseLeave={this._handleMouseOn_forgetPw}>
        <span
          className={classnames(
            'plainLinkButton',
            styles.spanAssist,
            stylesFont.fontContentPlain,
            stylesFont.colorEditBlack,
            {[styles.spanAssistOnMouse]: this.state.onForgetPw}
          )}>
          {"Forget password?"}</span>
      </a>
    )
  }
}
