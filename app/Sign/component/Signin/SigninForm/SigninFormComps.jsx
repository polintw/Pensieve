import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';

export class LinkSignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSignUp: false
    };
    this._handleClick_pathWithin = this._handleClick_pathWithin.bind(this);
    this._handleMouseOn_signUp = ()=> this.setState((prevState,props)=>{return {onSignUp: prevState.onSignUp?false:true}});
  }

  _handleClick_pathWithin(e){
    e.preventDefault();
    e.stopPropagation();
    this.props._switch_Sign('toSignUp');
  }

  render(){
    return this.props.location.pathname.includes('/sign') ? (
      <Link
        to="/signup"
        className={classnames('plainLinkButton')}
        onMouseEnter={this._handleMouseOn_signUp}
        onMouseLeave={this._handleMouseOn_signUp}>
        <span
          className={classnames(
            styles.fontInput,
            styles.spanSignUp,
            {[styles.spanSignUpMouse]: this.state.onSignUp}
          )}
          style={{fontWeight: '500', letterSpacing: 'unset'}}>
          {"Sign up"}</span>
      </Link>
    ): (
      <div
        onClick={this._handleClick_pathWithin}
        onMouseEnter={this._handleMouseOn_signUp}
        onMouseLeave={this._handleMouseOn_signUp}>
        <span
          className={classnames(
            styles.fontInput,
            styles.spanSignUp,
            {[styles.spanSignUpMouse]: this.state.onSignUp}
          )}
          style={{fontWeight: '500', letterSpacing: 'unset'}}>
          {"Sign up"}</span>
      </div>
    )
  }
}

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
      <Link to="/signup/email">
        <span
          className={classnames(styles.fontMessage)}>
          {this.props.i18nUIString.catalog["link_Sign_mailResend"]}
        </span>
      </Link>
    ): (
      <div
        onClick={this._handleClick_pathWithin}>
        <span
          className={classnames(styles.fontMessage)}>
          {this.props.i18nUIString.catalog["link_Sign_mailResend"]}
        </span>
      </div>
    )
  }
}
