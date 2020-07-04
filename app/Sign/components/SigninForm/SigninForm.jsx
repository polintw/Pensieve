import React from 'react';
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import {
  LinkForgetPw,
  LinkMailResend,
} from './SigninFormComps.jsx';
import MessageInput from '../MessageInput/MessageInput.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class SigninForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      resCode: null,
      resMessage: "",
      email: '',
      password: ''
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_Signin = this._axios_Signin.bind(this);
    this._handle_Signin = this._handle_Signin.bind(this);
    this._handleChange_input = (event)=>{
      let obj={};
      obj[event.currentTarget.name] = event.currentTarget.value;
      // we also check if going to reset message
      if(event.currentTarget.name in ((typeof this.state.resMessage != "string") ? this.state.resMessage : {})) {
        let messageObj = {};
        messageObj[event.currentTarget.name] = "";
        obj['resMessage'] = Object.assign({}, this.state.resMessage, messageObj);
      };
      this.setState(obj);
    };
  }

  _handle_Signin(event){
    event.preventDefault();
    let submitObj = {
      email: this.state.email,
      password: this.state.password
    };
    const self = this;
    this.setState({axios: true});

    this._axios_Signin(submitObj)
    .then(()=>{
      this.props._signin_success();

    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(typeof message == 'object'){ //basically, not a string
          if('code33' in message) {self.setState({resCode: '33'}); message = message.message};
        }
        if(message) self.setState({resMessage: message});
      }
    });
  }

  _axios_Signin(submitObj){
    return axios.post('/router/login', submitObj, {
      headers: {'charset': 'utf-8'},
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      window.localStorage['token'] = res.data.token; //'access token', used in usual case
      window.localStorage['tokenRefresh'] = res.data.tokenRefresh; //'refresh token', used in case the access token expired
      return;
    })
    .catch((err)=>{
      throw err;
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    const message = this.state.resMessage;
    const submitPermission = ( !this.state.axios && this.state.email.length>0 && this.state.password.length >0)? true : false;

    return(
      <div
        className={styles.comSigninForm}>
        <form onSubmit={this._handle_Signin}>
          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {'Email'}
          </span>
          <div
            className={classnames(styles.boxInput)}>
            <input
              type="email"
              placeholder="example@mail.com"
              name="email"
              required
              className={classnames(
                'plainInputText',
                styles.inputSign, stylesFont.fontContent, stylesFont.colorBlack85,
                {[styles.inputSignError]: message.email}
              )}
              value={this.state.email}
              onChange={this._handleChange_input}/>
              {
                message.email &&
                <div
                  className={classnames(styles.boxInputMes)}>
                  <MessageInput
                    messageIcon={"error"}
                    messageText={message.email}/>
                </div>
              }
          </div>
          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {'Password'}
          </span>
          <div
            className={classnames(styles.boxInput)}>
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              className={classnames(
                'plainInputText',
                styles.inputSign, stylesFont.fontContent, stylesFont.colorEditBlack,
                {[styles.inputSignError]: message.password}
              )}
              value={this.state.password}
              onChange={this._handleChange_input}/>
              {
                message.password &&
                <div
                  className={classnames(styles.boxInputMes)}>
                  <MessageInput
                    messageIcon={"error"}
                    messageText={message.password}/>
                </div>
              }
          </div>
          <div
            className={classnames(styles.boxAssist)}>
            <LinkForgetPw {...this.props}/>
            {
              (message.warning && this.state.resCode == "33") &&
              <LinkMailResend {...this.props}/>
            }
          </div>
          {
            (message.warning) &&
            <div
              className={classnames(styles.boxWarning)}>
              <MessageInput
                messageIcon={false}
                messageText={message.warning}/>
            </div>
          }

          <input
            type='submit'
            value='Sign in'
            disabled={submitPermission? false: true}
            className={classnames(
              'plainInput',
              styles.boxSubmit,
              {[styles.boxSubmitAllow]: submitPermission},
              stylesFont.colorWhite, stylesFont.fontSubtitle)}/>
        </form>
      </div>


    )
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninForm));
