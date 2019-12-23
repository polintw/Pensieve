import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandler_axios.js';
import MaskProcessing from '../../../Component/MaskProcessing.jsx';
import {
  setSignInit,
  axiosSwitch,
  axiosGetRes,
  handleSignUser
} from "../../../redux/actions/handleSign.js";

class SignupForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password_confirm: '',
      gender: null,
      birthYear: '1999',
      birthMonth: '1',
      birthDate: '24',
      success: false,
      onSignIn: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_BirthOptions = this._render_BirthOptions.bind(this);
    this._handle_Signup = this._handle_Signup.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._handleMouseOn_signIn = ()=> this.setState((prevState,props)=>{return {onSignIn: prevState.onSignIn?false:true}});
    this.style={
      Signup_form_: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }
    }
  }

  _handle_Signup(event){
    event.preventDefault();
    if(this.props.axios) return;
    const self = this;
    let reqBody = {
      'email': this.state.email,
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'password': this.state.password,
      'password_confirm': this.state.password_confirm,
      'gender': this.state.gender,
      'birthYear': this.state.birthYear,
      'birthMonth': this.state.birthMonth,
      'birthDate': this.state.birthDate
    };
    this.props._set_axiosStatus(true);
    axios.post('/router/register', reqBody, {
      headers: {'charset': 'utf-8'},
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      self.props._set_axiosRes({axiosStatus: false, message: res.data.message});
      self.setState({success: true});
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown, self.props);
      } else {
        uncertainErr(thrown, self.props);
      }
    });
  }

  _render_BirthOptions(max, min){
    let options = [];
    for( let i = min?min:1 ; i < max+1 ; i++){
      options.push(
        <option
          key={"key_signup_birthoptions_"+max+"_"+i}
          value={i}>{i}</option>
        );
    }
    return options;
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
    //let cx = cxBind.bind(styles);
    if(this.state.success){return <Redirect to={'/signup/success'}/>}
    let d = new Date();
    let currY = d.getFullYear();

    const message = this.props.message;
    return(
      <div
        style={this.style.Signup_form_}>
        <h1>Registration</h1>
        <form onSubmit={this._handle_Signup}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={ this._handleChange_Input }
            value={ this.state.firstName }
            className={classnames(styles.boxInput, styles.fontInput)}
            required/>
          <input
            type="text"
            placeholder="Family Name"
            name="lastName"
            onChange={ this._handleChange_Input }
            value={ this.state.lastName}
            className={classnames(styles.boxInput, styles.fontInput)}
            required/>
            {
              message.account &&
              <div
                className={classnames(styles.fontMessage)}>
                {message.account}</div>
            }
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={ this._handleChange_Input }
            value={ this.state.email }
            className={classnames(styles.boxInput, styles.fontInput)}
            required/>
            {
              message.email &&
              <div
                className={classnames(styles.fontMessage)}>
                {message.email}</div>
            }
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={ this._handleChange_Input }
            value={ this.state.password }
            className={classnames(styles.boxInput, styles.fontInput)}
            required/>
            {
              message.password &&
              <div
                className={classnames(styles.fontMessage)}>
                {message.password}</div>
            }
          <input
            type="password"
            placeholder="Confirm Password"
            name="password_confirm"
            onChange={ this._handleChange_Input }
            value={ this.state.password_confirm }
            className={classnames(styles.boxInput, styles.fontInput)}
            required/>
            {
              message.password_confirm &&
              <div
                className={classnames(styles.fontMessage)}>
                {message.password_confirm}</div>
            }
            <input
              type="radio"
              name="gender"
              value= {"1"}
              checked={this.state.gender === "1"}
              onChange={this._handleChange_Input}
              required/>
            <span
              className={classnames(styles.spanTag, styles.fontInput)}>
              {'Male'}
            </span>
            <input
              type="radio"
              name="gender"
              value= {"0"}
              checked={this.state.gender === "0"}
              onChange={this._handleChange_Input}/>
            <span
              className={classnames(styles.spanTag, styles.fontInput)}>
              {'Female'}
            </span>
            <div>
              <span
                className={classnames(styles.spanTag, styles.fontTag)}>
                {"Birthday"}</span>
              <select name="birthYear" onChange={this._handleChange_Input} value={this.state.birthYear}
                className={classnames(styles.boxSelect, styles.fontTag)}>
                {this._render_BirthOptions(currY, currY-90)}
              </select>
              <select name="birthMonth" onChange={this._handleChange_Input} value={this.state.birthMonth}
                className={classnames(styles.boxSelect, styles.fontTag)}>
                {this._render_BirthOptions(12)}
              </select>
              <select name="birthDate" onChange={this._handleChange_Input} value={this.state.birthDate}
                className={classnames(styles.boxSelect, styles.fontTag)}>
                {this._render_BirthOptions(31)}
              </select>
            </div>
            {
                message.warning &&
                <div
                  className={classnames(styles.fontMessage)}>
                  {message.warning}</div>
              }
              <div
                className={classnames(styles.boxInput)}
                style={{color: '#ababab'}}>
                <span>
                  {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][0]}</span>
                <span>
                  <a href="/a/terms">
                    {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][1]}</a>
                </span>
                <span>
                  {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][2]}</span>
                <span>
                  <a href="/a/privacy">
                    {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][3]}</a>
                </span>
                <span>
                  {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][4]}</span>
              </div>
              <div
                style={{float:"right"}}>
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
                <input
                  type='submit'
                  value="Sign Up"
                  className={classnames(styles.boxSubmit)}
                  disabled={this.props.axios? true:false}/>
              </div>
        </form>

        {
          this.props.axios &&
          <MaskProcessing/>
        }
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
    _submit_Signin: (submitObj)=>{dispatch(handleSignUser(submitObj));},
    _set_axiosStatus: (bool)=>{dispatch(axiosSwitch(bool));},
    _set_axiosRes: (resObj)=>{dispatch(axiosGetRes(resObj));},
    _set_StateInit: ()=>{dispatch(setSignInit());}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupForm));
