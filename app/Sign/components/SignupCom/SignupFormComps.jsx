import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';

export class LinkSignIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSignIn: false
    };
    this._handleClick_pathWithin = this._handleClick_pathWithin.bind(this);
    this._handleMouseOn_signIn = ()=> this.setState((prevState,props)=>{return {onSignIn: prevState.onSignUp?false:true}});
  }

  _handleClick_pathWithin(e){
    e.preventDefault();
    e.stopPropagation();
    this.props._switch_Sign('toSignIn');
  }

  render(){
    return this.props.location.pathname.includes('/sign') ? (
      <Link
        to="/signin"
        className={classnames('plainLinkButton')}
        onMouseEnter={this._handleMouseOn_signIn}
        onMouseLeave={this._handleMouseOn_signIn}>
        <span
          className={classnames(
            styles.spanSignIn,
            {[styles.spanSignInMouse]: this.state.onSignIn}
          )}>
          {"Sign in"}</span>
      </Link>
    ): (
      <div
        onClick={this._handleClick_pathWithin}
        onMouseEnter={this._handleMouseOn_signIn}
        onMouseLeave={this._handleMouseOn_signIn}>
        <span
          className={classnames(
            styles.spanSignIn,
            {[styles.spanSignInMouse]: this.state.onSignIn}
          )}>
          {"Sign in"}</span>
      </div>
    )
  }
}
