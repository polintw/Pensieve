import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../../../Component/Svg/SvgLogo.jsx';
import ServiceLinks from '../../../Component/ServiceLinks.jsx';
import {
  setSignInit,
  handleSignUser
} from "../../../redux/actions/handleSign.js";

const commonStyle= {
  signLogo: {
    display: 'inline-block',
    width: '10vw',
    minHeight: '27px',
    position: 'absolute',
    left: '0%',
    top: '26%',
    boxSizing: 'border-box',
    transform: 'rotate(270deg)'
  }
}

class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      response: null,
      onSignUp: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_Signin = this._handle_Signin.bind(this);
    this._handleMouseOn_signUp = ()=> this.setState((prevState,props)=>{return {onSignUp: prevState.onSignUp?false:true}});
    this.style={
      Signin_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Signin_member_: {
        width: '20vw',
        height: '70%',
        position: 'absolute',
        top: '15%',
        right: '0',
        boxSizing:'border-box'
      },
    }
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

  componentWillUnmount(){
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    this.props._set_StateInit()
  }

  render(){
    //let cx = cxBind.bind(styles);
    const message = this.props.message;
    return(
      <div
        style={this.style.Signin_}>
        <div
          className={classnames(styles.boxColumn)}>
          <div
            style={commonStyle.signLogo}>
            <SvgLogo/>
          </div>
          <div
            style={this.style.Signin_member_}>
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
                value='Log in'
                disabled={this.props.axios? true:false}
                className={classnames(styles.boxSubmit)}
                style={{float:"right"}}/>
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
              {
                message.warning && this.props.code == "33" &&
                <Link to="/signup/email">
                  <span
                    className={classnames(styles.fontMessage)}>
                    {"send the verified email again"}</span>
                </Link>
              }
            </form>
          </div>
          <div
            className={classnames(styles.boxServiceLink)}>
            <ServiceLinks/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message,
    code: state.code
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
)(Signin));
