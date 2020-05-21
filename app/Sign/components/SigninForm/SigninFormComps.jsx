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

    };
    this._handleClick_pathWithin = this._handleClick_pathWithin.bind(this);
  }

  _handleClick_pathWithin(e){
    e.preventDefault();
    e.stopPropagation();
    this.props._switch_Sign('toMailResend');
  }

  render(){
    return this.props.location.pathname.includes('/sign') ? (
      <Link to="/resend?purpose=verifications">
        <span
          className={classnames(
            styles.spanAssist,
            stylesFont.fontContentPlain,
            stylesFont.colorEditBlack)}>
          {this.props.i18nUIString.catalog["link_Sign_mailResend"]}
        </span>
      </Link>
    ): (
      <div
        onClick={this._handleClick_pathWithin}>
        <span
          className={classnames(
            styles.spanAssist,
            stylesFont.fontContentPlain,
            stylesFont.colorEditBlack)}>
          {this.props.i18nUIString.catalog["link_Sign_mailResend"]}
        </span>
      </div>
    )
  }
}

export class LinkForgetPw extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onForgetPw: false
    };
    this._handleClick_pathWithin = this._handleClick_pathWithin.bind(this);
    this._handleMouseOn_forgetPw = ()=> this.setState((prevState,props)=>{return {onForgetPw: prevState.onForgetPw?false:true}});
  }

  _handleClick_pathWithin(e){
    e.preventDefault();
    e.stopPropagation();
    this.props._switch_Sign('toForgetPw');
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
      <div
        onClick={this._handleClick_pathWithin}
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
      </div>
    )
  }
}
