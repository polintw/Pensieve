import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  LinkSignUp,
  LinkMailResend
} from './SigninFormComps.jsx';
import SvgLogo from '../../../../Components/Svg/SvgLogo.jsx';
import {
  setSignInit,
  handleSignUser
} from "../../../../redux/actions/sign.js";

class SigninForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_Signin = this._handle_Signin.bind(this);
  }

  _handle_Signin(event){
    event.preventDefault();
    let submitObj = {
      email: this.emailInput.value,
      password: this.passwordInput.value
    };
    this.props._submit_Signin(submitObj, this.axiosSource.token);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    this.props._set_StateInit()
  }

  render(){
    const message = this.props.message;
    return(
      <div>
        <div
          className={styles.boxLogo}>
          <SvgLogo/>
        </div>
        <form onSubmit={this._handle_Signin}>
          <span
            className={classnames(styles.spanTag, styles.fontTag)}>
            {'email:'}
          </span><br/>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className={classnames(styles.boxInput, styles.fontInput)}
            ref={(element)=>{this.emailInput = element}}/><br/>
          {
            message.email &&
            <div
              className={classnames(styles.fontMessage)}>
              {message.email}</div>
          }
          <span
            className={classnames(styles.spanTag, styles.fontTag)}>
            {'password:'}
          </span><br/>
          <input
            type="password"
            placeholder="Password"
            className={classnames(styles.boxInput, styles.fontInput)}
            ref={(element)=>{this.passwordInput = element}}/><br/>
          {
            message.password &&
            <div
              className={classnames(styles.fontMessage)}>
              {message.password}</div>
          }
          <br/>
          {
            message.warning &&
            <div
              className={classnames(styles.fontMessage)}>
              {message.warning}</div>
          }
          <input
            type='submit'
            value='Sign in'
            disabled={this.props.axios? true:false}
            className={classnames(styles.boxSubmit)}
            style={{float:"right"}}/>
          <LinkSignUp {...this.props}>
            <span
              className={classnames(
                styles.fontInput,
                styles.spanSignUp,
                {[styles.spanSignUpMouse]: this.state.onSignUp}
              )}
              style={{fontWeight: '500', letterSpacing: 'unset'}}>
              {"Sign up"}</span>
          </LinkSignUp>

          {
            message.warning && this.props.code == "33" &&
            <LinkMailResend {...this.props}>
              <span
                className={classnames(styles.fontMessage)}>
                {this.props.i18nUIString.catalog["link_Sign_mailResend"]}
              </span>
            </LinkMailResend>
          }
        </form>
      </div>


    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    code: state.code,
    message: state.message,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_StateInit: ()=>{dispatch(setSignInit());},
    _submit_Signin: (submitObj, cancelToken)=>{dispatch(handleSignUser(submitObj, cancelToken));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninForm));
