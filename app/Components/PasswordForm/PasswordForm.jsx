import React from 'react';
import {
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import MessageInput from '../../Sign/components/MessageInput/MessageInput.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class PasswordForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      resMessage: {},
      submitPermission: false,
      greenlight: {
        password: false,
        password_confirm: false,
      },
      password: '',
      password_confirm: '',
      password_old: ''
    };
    this.refInpuPwConfirm = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._render_formPassword = this._render_formPassword.bind(this);
    this._handle_Submit = this._handle_Submit.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._check_passwordRules = this._check_passwordRules.bind(this);
    this._check_passwordConfirm = this._check_passwordConfirm.bind(this);
    this._blurHandler_Validate = this._blurHandler_Validate.bind(this);
    this._greenLight_Validate = this._greenLight_Validate.bind(this);
  }

  _greenLight_Validate(currentTarget){
    let targetName = currentTarget.name;
    let light = false;
    switch (targetName) {
      case "password":
        light = passwordValidation(currentTarget.value);
        break;
      case "password_confirm":
        light = (this.state.password == this.state.password_confirm && this.state.password.length > 0) ? true : false;
        break;
      default:
        return
    }
    this.setState((prevState, props)=>{
      let messageObj={[targetName]: light ? '': prevState.resMessage[targetName]}, lightObj={[targetName]: light};
      return {
        resMessage: {...prevState.resMessage, ...messageObj},
        greenlight: {...prevState.greenlight, ...lightObj}
      };
    });
  }

  _blurHandler_Validate(event){
    let eventTarget = event.currentTarget.name;
    switch (eventTarget) {
      case "password":
        this._check_passwordRules(event);
        this._check_passwordConfirm();
        break;
      case "password_confirm":
        this._check_passwordConfirm();
        break;
      default:
        return
    }
  }

  _check_passwordRules(event){
    /*
    this is an onBlur f(), fires when element has lost focus.
    it would not bubbles.
    we planning check if the password fullfill the rules we need.
    */
    let str = event.currentTarget.value;
    let ruleOneOne = passwordValidation(str);
    this.setState((prevState, props)=>{
      let messageObj={password: ''}, lightObj={password: true};
      if(!ruleOneOne || str.length < 8 || str.length > 30) {
        messageObj = {password: this.props.i18nUIString.catalog['message_Signup_Form'][3] };
        lightObj = {password: false};
      };
      return {
        resMessage: {...prevState.resMessage, ...messageObj},
        greenlight: {...prevState.greenlight, ...lightObj}
      };
    });

  }

  _check_passwordConfirm(){
    if (this.state.password_confirm.length > 0) { // method would be called from passwrd input even before any focus on password_confirm
      let signal = (this.state.password == this.state.password_confirm) ? true : false;
      this.setState((prevState, props)=>{
        let messageObj={password_confirm: ''}, lightObj={password_confirm: true};
        if(!signal) {
          messageObj = {password_confirm: this.props.i18nUIString.catalog['message_Signup_Form'][4]};
          lightObj = {password_confirm: false};
        };
        return {
          resMessage: {...prevState.resMessage, ...messageObj},
          greenlight: {...prevState.greenlight, ...lightObj}
        };
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    let lightKeys = Object.keys(this.state.greenlight);
    let permission = lightKeys.every((key)=> { return this.state.greenlight[key];});

    if(permission && !prevState.submitPermission) {
      this.setState({submitPermission: true});
    }
    else if(!permission && prevState.submitPermission) {
      this.setState({submitPermission: false});
    };
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }


  _render_formPassword(){
    return (
      <div>
        <div
          className={classnames(styles.boxInput)}
          style={{marginBottom: '1.6rem'}}>
          <input
            type="password"
            placeholder="at least 8 character with letter and digit "
            name="password"
            onChange={ this._handleChange_Input }
            onBlur={this._blurHandler_Validate}
            value={ this.state.password }
            required
            className={classnames(
              'plainInputText',
              styles.inputSign, 'fontContent', 'colorEditBlack',
              {[styles.inputSignError]: this.state.resMessage.password}
            )}/>
            {
              this.state.resMessage.password &&
              <div
                className={classnames(styles.boxInputMes)}>
                <MessageInput
                  messageIcon={"error"}
                  messageText={this.state.resMessage.password}/>
              </div>
            }
            {
              this.state.greenlight.password &&
              <div
                className={classnames(styles.boxInputMes)}>
                <MessageInput
                  messageIcon={"checked"}
                  messageText={''}/>
              </div>
            }
        </div>
        <div
          className={classnames(styles.boxInput)}
          style={{marginBottom: '3rem'}}>
          <input
            type="password"
            placeholder="Confirm Password"
            name="password_confirm"
            ref={this.refInpuPwConfirm}
            onChange={ this._handleChange_Input }
            onBlur={ this._blurHandler_Validate }
            value={ this.state.password_confirm }
            required
            className={classnames(
              'plainInputText',
              styles.inputSign, "fontContent", "colorEditBlack",
              {[styles.inputSignError]: this.state.resMessage.password_confirm}
            )}/>
            {
              this.state.resMessage.password_confirm &&
              <div
                className={classnames(styles.boxInputMes)}>
                <MessageInput
                  messageIcon={"error"}
                  messageText={this.state.resMessage.password_confirm}/>
              </div>
            }
            {
              this.state.greenlight.password_confirm &&
              <div
                className={classnames(styles.boxInputMes)}>
                <MessageInput
                  messageIcon={"checked"}
                  messageText={''}/>
              </div>
            }
        </div>
      </div>
    )
  }

  render(){
    return(
      <div
        className={styles.comPassForm}>
        <form onSubmit={this._handle_Submit}>
          {
            !this.props.pwreset &&
            <div>
              <span
                className={classnames(styles.spanTag, "fontContent", "colorSignBlack")}>
                {'Current Password'}
              </span>
              <div
                className={classnames(styles.boxInput)}
                style={{marginBottom: '3rem'}}>
                <input
                  type="password"
                  name="password_old"
                  onChange={ this._handleChange_Input }
                  onBlur={ this._blurHandler_Validate }
                  value={ this.state.password_old }
                  required
                  className={classnames(
                    'plainInputText',
                    styles.inputSign, "fontContent", "colorEditBlack",
                    {[styles.inputSignError]: this.state.resMessage.password_old}
                  )}/>
                  {
                    this.state.resMessage.password_old &&
                    <div
                      className={classnames(styles.boxInputMes)}>
                      <MessageInput
                        messageIcon={"error"}
                        messageText={this.state.resMessage.password_old}/>
                    </div>
                  }
                </div>
            </div>
          }

          <span
            className={classnames(styles.spanTag, "fontContent", "colorSignBlack")}>
            {'Password'}
          </span>
          {this._render_formPassword()}

          {
            this.state.resMessage.warning &&
            <div
              className={classnames(styles.boxWarning)}>
              <MessageInput
                messageIcon={false}
                messageText={this.state.resMessage.warning}/>
            </div>
          }

          <input
            type='submit'
            value={this.props.i18nUIString.catalog["submit_"]}
            disabled={(this.state.axios || !this.state.submitPermission)? true : false}
            className={classnames(
              'plainInput',
              styles.boxSubmit,
              {[styles.boxSubmitAllow]: (this.state.submitPermission && !this.state.axios)},
              "colorWhite", "fontSubtitle")}
            style={{marginTop: '1rem'}}/>
        </form>

      </div>
    )
  }

  _handleChange_Input(event) {
    //the value of event target would convert into String, no matter what type in original options/inputs
    const self = this;
    let currentTarget = event.currentTarget;
    let updatedValue = event.currentTarget.value;
    let targetName = event.currentTarget.name;
    this.setState((prevState, props)=>{
      let messageObj = {warning: ''}, lightObj={};
      if(targetName=="password"){  // only password_confirm was bundle to situation of password, and need to check 'every time'
        lightObj={password_confirm: false};
      };
      return {
        [targetName]: updatedValue,
        resMessage: {...prevState.resMessage, ...messageObj}, // to reset message warning no matter how is the state
        greenlight: {...prevState.greenlight, ...lightObj}
      };
    }, ()=>{ self._greenLight_Validate(currentTarget);}) // check light by independent f(), and callback after the state was set to ensure it get the newest state
  }

  _handle_Submit(event){
    event.preventDefault();
    // check greenlight
    if(this.state.axios || !this.state.submitPermission){
      let lightKeys = Object.keys(this.state.greenlight);
      let messageObj={};
      lightKeys.forEach((key, index) => {
        if(!this.state.greenlight[key]){
          let strIndex= i18nUIStringMap.indexOf(key); // pick the correct message
          messageObj[key] = props.i18nUIString.catalog['message_Signup_Form'][strIndex] ;
        }
      });
      this.setState((prevState, props)=>{
        return {
          resMessage: {...prevState.resMessage, ...messageObj},
        };
      });

      return; // and stop process
    }
    else {
      this.setState((prevState, props)=>{
        return {
          resMessage: {} // reset resMessage, especially clear 'warning'
        };
      });
    }

    const self = this;
    let reqBody = {
      'password': this.state.password,
      'password_confirm': this.state.password_confirm,
      'password_old': this.state.password_old //empty if under /pwreset
    };
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let token = !this.props.pwreset? window.localStorage['token']: params.get('token');

    this.setState({axios: true});
    axios({
      method: 'patch',
      url: '/router/account/password',
      params: !this.props.pwreset? {}:{forget: true},
      data: reqBody,
      headers: {
        'charset': 'utf-8',
        'token': token
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      self.setState({axios: false});

      self.props._submit_success();
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);

        if(message) {
          if(typeof message != "object") message = {warning: message};
          //message should be an obj contain keys
          let errKey = Object.keys(message);
          let lightObj = {};
          errKey.forEach((key, index) => {
            if(i18nUIStringMap.indexOf(key) < 0) return ; // server side would return message not only limit to allowed
            lightObj[key] = false;
          });

          self.setState((prevState, props)=>{
            return {
              resMessage: {...prevState.resMessage, ...message},
              greenlight: {...prevState.greenlight, ...lightObj}
            };
          });
        }
      }
    });
  }
}

const passwordValidation = (passwordValue)=>{
  const regexRule = RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$");
  let ruleOneOne = regexRule.test(passwordValue); //at least 1 alphabetical, 1 digit & 8 characters
  /* ref: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a */
  /* ref: https://stackoverflow.com/questions/11533474/java-how-to-test-if-a-string-contains-both-letter-and-number */
  /* ref: https://stackoverflow.com/questions/34292024/regular-expression-vs-vs-none */
  return ruleOneOne;
}

const i18nUIStringMap = ['email','account', 'gender', 'password', 'password_confirm'] // copy from SignupForm, but only need the last 2 in this comp.



const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordForm);
