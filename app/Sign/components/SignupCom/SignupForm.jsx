import React from 'react';
import {
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import MessageInput from '../MessageInput/MessageInput.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class SignupForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      resMessage: {},
      submitPermission: false,
      greenlight: {
        email: false,
        gender: false,
        password: false,
        password_confirm: false,
      },
      selectOtherGender: false,
      firstName: '',
      lastName: '',
      email: '',
      gender: null,
      password: '',
      password_confirm: '',
    };
    this.refInputEmail = React.createRef();
    this.refInpuPwConfirm = React.createRef();
    this.refSelectGender = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._render_formEmail = this._render_formEmail.bind(this);
    this._render_formGender = this._render_formGender.bind(this);
    this._render_formAccount = this._render_formAccount.bind(this);
    this._render_formPassword = this._render_formPassword.bind(this);
    this._render_formServiceTerms = this._render_formServiceTerms.bind(this);
    this._handle_Signup = this._handle_Signup.bind(this);

    this._handleKey_DownInput = this._handleKey_DownInput.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._handleChange_InputOtherGender = this._handleChange_InputOtherGender.bind(this);
    this._handleChange_pronounSelect = this._handleChange_pronounSelect.bind(this);
    this._check_EmailFormat = this._check_EmailFormat.bind(this);
    this._check_passwordRules = this._check_passwordRules.bind(this);
    this._check_passwordConfirm = this._check_passwordConfirm.bind(this);
    this._blurHandler_Validate = this._blurHandler_Validate.bind(this);
    this._greenLight_Validate = this._greenLight_Validate.bind(this);
  }

  _greenLight_Validate(currentTarget){
    let targetName = currentTarget.name;
    let light = false;
    switch (targetName) {
      case 'email':
        light = emailValidation(currentTarget);
        break;
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
      case 'email':
        this._check_EmailFormat(event);
        break;
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

  _check_EmailFormat(event){
    let formatValidation = emailValidation(event.currentTarget);
    this.setState((prevState, props)=>{
      let messageObj={email: ''}, lightObj={email: true};
      if(!formatValidation){
        messageObj = {email: props.i18nUIString.catalog['message_Signup_Form'][0] };
        lightObj = {email: false};
      };
      return {
        resMessage: {...prevState.resMessage, ...messageObj},
        greenlight: {...prevState.greenlight, ...lightObj}
      };
    });
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

  _render_formGender(){
    return (
      <div
        className={classnames(styles.boxGender)}>
        <div
          className={classnames(styles.boxGenderSet)}>
          <input
            type="radio"
            name="gender"
            value= {"1"}
            checked={this.state.gender == "1"}
            className={classnames(styles.inputSignGender)}
            onChange={this._handleChange_InputOtherGender}
            required/>
          <span
            className={classnames(styles.spanRadio, stylesFont.colorBlack85, stylesFont.fontSubtitle_h5)}>
            {'Male'}
          </span>
        </div>
        <div
          className={classnames(styles.boxGenderSet)}>
          <input
            type="radio"
            name="gender"
            value= {"0"}
            checked={this.state.gender == "0"}
            className={classnames(styles.inputSignGender)}
            onChange={this._handleChange_InputOtherGender}/>
          <span
            className={classnames(styles.spanRadio, stylesFont.colorBlack85, stylesFont.fontSubtitle_h5)}>
            {'Female'}
          </span>
        </div>
        <div
          className={classnames(styles.boxGenderSet)}>
          <input
            type="radio"
            name="gender"
            value= {"31" /* Notice! '31' is the pronoun 'He/Him', default to it when start from 'Others' */}
            checked={(this.state.gender == "3" || this.state.gender == "30" || this.state.gender == "31")}
            className={classnames(styles.inputSignGender)}
            onChange={this._handleChange_InputOtherGender}/>
          <span
            className={classnames(styles.spanRadio, stylesFont.colorBlack85, stylesFont.fontSubtitle_h5)}>
            {'Others'}
          </span>
        </div>
        {
          this.state.selectOtherGender && (
            <div
              className={classnames(styles.boxGenderOther)}>
              <label
                htmlFor="otherGen"
                className={classnames(stylesFont.fontContent, stylesFont.colorSignBlack)}>
                {this.props.i18nUIString.catalog['hint_Signup_gendeSelect']}
              </label>
              <select ref={this.refSelectGender} id="otherGen" form={'signupForm'} required
                onChange={this._handleChange_pronounSelect}
                className={classnames(styles.spanGenderSelect, stylesFont.colorBlack85, stylesFont.fontSubtitle_h5)}>
                <option value="31">{this.props.i18nUIString.catalog['options_genderPronoun'][0]}</option>
                <option value="30">{this.props.i18nUIString.catalog['options_genderPronoun'][1]}</option>
              </select>
            </div>
          )
        }
        {
          this.state.resMessage.gender &&
          <div
            className={classnames(styles.boxInputMes)}>
            <MessageInput
              messageIcon={"error"}
              messageText={this.state.resMessage.gender}/>
          </div>
        }
      </div>
    )
  }

  _render_formAccount(){
    return (
      <div
        className={classnames(styles.boxAccount)}>
        <div
          className={classnames(styles.boxAccountSet)}>
          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {this.props.i18nUIString.catalog['subtitle_Sign_name'][0]}
          </span>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onKeyDown={this._handleKey_DownInput}
            onChange={ this._handleChange_Input }
            value={ this.state.firstName }
            className={classnames(
              'plainInputText',
              styles.inputSign, stylesFont.fontContent, stylesFont.colorBlack85)}
            style={{padding: '1.2rem 1.5rem'}}
            required/>
        </div>
        <div
          className={classnames(styles.boxAccountSet)}>
          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {this.props.i18nUIString.catalog['subtitle_Sign_name'][1]}
          </span>
          <input
            type="text"
            placeholder={this.props.i18nUIString.catalog['subtitle_Sign_name'][1]}
            name="lastName"
            onKeyDown={this._handleKey_DownInput}
            onChange={ this._handleChange_Input }
            value={ this.state.lastName}
            className={classnames(
              'plainInputText',
              styles.inputSign, stylesFont.fontContent, stylesFont.colorBlack85)}
            style={{padding: '1.2rem 1.5rem'}}
            required/>
        </div>
        {
          this.state.resMessage.account &&
          <div
            className={classnames(styles.boxInputMes)}>
            <MessageInput
              messageIcon={"error"}
              messageText={this.state.resMessage.account}/>
          </div>
        }
      </div>

    )
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
              styles.inputSign, stylesFont.fontContent, stylesFont.colorEditBlack,
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
              styles.inputSign, stylesFont.fontContent, stylesFont.colorEditBlack,
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

  _render_formEmail(){
    return(
      <div
        className={classnames(styles.boxInput)}>
        <input
          type="email"
          ref={this.refInputEmail}
          placeholder="example@mail.com"
          name="email"
          required
          className={classnames(
            'plainInputText',
            styles.inputSign, stylesFont.fontContent, stylesFont.colorBlack85,
            {[styles.inputSignError]: this.state.resMessage.email}
          )}
          value={this.state.email}
          onChange={this._handleChange_Input}
          onBlur={this._blurHandler_Validate}/>
        {
          this.state.resMessage.email &&
          <div
            className={classnames(styles.boxInputMes)}>
            <MessageInput
              messageIcon={"error"}
              messageText={this.state.resMessage.email}/>
          </div>
        }
        {
          this.state.greenlight.email &&
          <div
            className={classnames(styles.boxInputMes)}>
            <MessageInput
              messageIcon={"checked"}
              messageText={''}/>
          </div>
        }
      </div>
    )
  }

  _render_formServiceTerms(){
    return (
      <div
        className={classnames(styles.boxInput, stylesFont.colorEditBlack)}
        style={{fontSize: '1rem', lineHeight: '1.8'}}>
        <span>
          {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][0]}
        </span>
        <span>
          <a href="/a/terms"
            className={classnames('plainLinkButton', stylesFont.colorStandard)}>
            {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][1]}
          </a>
        </span>
        <span> {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][2]}</span>
        <span>
          <a href="/a/privacy"
            className={classnames('plainLinkButton', stylesFont.colorStandard)}>
            {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][3]}</a>
        </span>
        <span> {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][4]}</span>
      </div>
    )
  }

  render(){
    return(
      <div
        className={styles.comSignupForm}>
        <form onSubmit={this._handle_Signup} id={'signupForm'}>
          {this._render_formAccount()}

          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}
            style={{marginBottom: '10px'}}>
            {this.props.i18nUIString.catalog['subtitle_Sign_gender']}
          </span>
          {this._render_formGender()}

          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {'Email'}
          </span>
          {this._render_formEmail()}

          <span
            className={classnames(styles.spanTag, stylesFont.fontContent, stylesFont.colorSignBlack)}>
            {'Password'}
          </span>
          {this._render_formPassword()}

          {this._render_formServiceTerms()}
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
            value='Register'
            disabled={(this.state.axios || !this.state.submitPermission)? true : false}
            className={classnames(
              'plainInput',
              styles.boxSubmit,
              {[styles.boxSubmitAllow]: (this.state.submitPermission && !this.state.axios)},
              stylesFont.colorWhite, stylesFont.fontSubtitle)}
            style={{marginTop: '1rem'}}/>

        </form>

      </div>
    )
  }

  _handleKey_DownInput(event){
    // space was not allowed in all input
    if (event.keyCode == 32 || event.which == 32) event.preventDefault();
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

  _handleChange_InputOtherGender(event) {
    let inputValue = event.currentTarget.value; // 'event' was a synthetic obj, react would block usage in setState(a async)
    this.setState((prevState, props)=>{
      let lightObj={gender: true };
      return {
        gender: inputValue,
        selectOtherGender: (inputValue== "31" /* default to '31' when start from others*/ )? true: false,
        greenlight: {...prevState.greenlight, ...lightObj}
      };
    });
  }

  _handleChange_pronounSelect(event){
    this.setState((prevState, props)=>{
      let lightObj={gender: true };
      return {
        gender: this.refSelectGender.current.value,
        greenlight: {...prevState.greenlight, ...lightObj}
      };
    });
  }

  _handle_Signup(event){
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

    const self = this;
    let reqBody = {
      'email': this.state.email,
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'password': this.state.password,
      'password_confirm': this.state.password_confirm,
      'gender': this.state.gender,
    };

    this.setState({axios: true});
    axios.post('/router/register', reqBody, {
      headers: {'charset': 'utf-8'},
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      self.setState({axios: false});

      self.props._signup_success();
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

const emailValidation = (emailValue)=>{ return emailValue.checkValidity(); } //js f(), would return bool by result of validation

const passwordValidation = (passwordValue)=>{
  const regexRule = RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$");
  let ruleOneOne = regexRule.test(passwordValue); //at least 1 alphabetical, 1 digit & 8 characters
  /* ref: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a */
  /* ref: https://stackoverflow.com/questions/11533474/java-how-to-test-if-a-string-contains-both-letter-and-number */
  /* ref: https://stackoverflow.com/questions/34292024/regular-expression-vs-vs-none */
  return ruleOneOne;
}

const i18nUIStringMap = ['email','account', 'gender', 'password', 'password_confirm']

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
)(SignupForm));
