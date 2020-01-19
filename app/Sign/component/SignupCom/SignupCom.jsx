import React from 'react';
import {
  Link,
  Switch,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandler_axios.js';
import {
  axiosSwitch,
  axiosGetRes,
  setSignInit
} from "../../../redux/actions/handleSign.js";

class SignupSuccess extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSignIn: false
    };
    this._handleMouseOn_signIn = ()=> this.setState((prevState,props)=>{return {onSignIn: prevState.onSignIn?false:true}});
    this.style={
      SignupSuccess_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.SignupSuccess_}>
        <div
          className={classnames(styles.fontInput)}>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][0]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][1]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][2]}</p>
          <Link
            to="/signin"
            className={classnames('plainLinkButton')}
            style={{margin: '5rem, 0', display: 'block'}}
            onMouseEnter={this._handleMouseOn_signIn}
            onMouseLeave={this._handleMouseOn_signIn}>
            <span
              className={classnames(
                styles.spanSignIn,
                {[styles.spanSignInMouse]: this.state.onSignIn}
              )}>
              {"Sign in"}</span>
          </Link>
        </div>
      </div>
    )
  }
}

class SignupMailresend extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: ""
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._handle_Mailresend = this._handle_Mailresend.bind(this);
    this.style={
      SignupMailresend_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Mailresend_form_: {
        width: '40%',
        height: '70%',
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing:'border-box'
      }
    }
  }

  _handle_Mailresend(event){
    event.preventDefault();
    if(this.props.axios) return; //prevent repeated request
    const self = this;
    let reqBody = {
      'email': this.state.email
    };
    this.props._set_axiosStatus(true);
    axios.patch('/router/register/mail/resend', reqBody, {
      headers: {
        'charset': 'utf-8'
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      self.props._set_axiosRes({axiosStatus: false, message: res.data.message});
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown, self.props);
      } else {
        uncertainErr(thrown, self.props);
      }
    });
  }

  _handleChange_Input(event) {
    //the value of event target would convert into String, no matter what type in original options/inputs
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    };
    this.props._set_StateInit()
  }

  render(){

    const message = this.props.message;
    return(
      <div
        style={this.style.SignupMailresend_}>
          <h2>{this.props.i18nUIString.catalog["title_Sign_mailResend"]}</h2>
          <form onSubmit={this._handle_Mailresend}>
            {'email:'}<br/>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={ this._handleChange_Input }
              value={ this.state.email }/><br/>
              {
                message.email &&
                <div>{message.email}</div>
              }
              <br/>
              {
                message.warning &&
                <div>{message.warning}</div>
              }
              <input
                type='submit'
                value={this.props.i18nUIString.catalog["link_Sign_resendButton"]}
                disabled={this.props.axios? true:false}/>
            </form>
          <div
            style={{display:'flex',justifyContent: 'space-around',width: '50%',margin:'2rem 0',float:'right'}}>
            <Link
              to="/signin"
              className={classnames('plainLinkButton')}
              style={{margin: '5rem, 0', display: 'block'}}>
              <span
                className={classnames(
                  styles.spanSignIn,
                )}>
                {"Sign in"}</span>
            </Link>
            <Link
              to="/signup"
              className={classnames('plainLinkButton')}
              style={{margin: '5rem, 0', display: 'block'}}>
              <span
                className={classnames(
                  styles.spanSignIn,
                )}>
                {"Sign up"}</span>
            </Link>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_axiosStatus: (bool)=>{dispatch(axiosSwitch(bool));},
    _set_axiosRes: (resObj)=>{dispatch(axiosGetRes(resObj));},
    _set_StateInit: ()=>{dispatch(setSignInit());}
  }
}

const reduxConnection = connect(
  mapStateToProps,
  mapDispatchToProps
);

module.exports = {
  SignupSuccess: reduxConnection(SignupSuccess),
  SignupMailresend: reduxConnection(SignupMailresend)
}
