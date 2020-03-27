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
import {LinkSignIn} from './SignupFormComps.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandler_axios.js';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';
import MaskProcessing from '../../../Components/MaskProcessing.jsx';

class SignupForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      resMessage: "",
      finalSteps: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password_confirm: '',
      gender: null,
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_form = this._render_form.bind(this);
    this._handle_Signup = this._handle_Signup.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._handleClick_StepsConti = this._handleClick_StepsConti.bind(this);
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
    if(this.state.axios) return;
    const self = this;
    let reqBody = {
      'email': this.state.email,
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'password': this.state.password,
      'password_confirm': this.state.password_confirm,
      'gender': this.state.gender,

    };

    axios.post('/router/register', reqBody, {
      headers: {'charset': 'utf-8'},
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      this.props._signup_success();

    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);

        if(message) self.setState({resMessage: message});
      }
    });
  }

  _handleChange_Input(event) {
    //the value of event target would convert into String, no matter what type in original options/inputs
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  _handleClick_StepsConti(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      return {finalSteps: prevState.finalSteps? false : true}; //simple toggle, just because we has only 2 steps
    })
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  _render_form(){
    return (
      <form onSubmit={this._handle_Signup}>
        { //becaie we current;y only has 2 steps
          (this.state.finalSteps) ? (
            <div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={ this._handleChange_Input }
                value={ this.state.password }
                className={classnames(styles.boxInput, styles.fontInput)}
                required/>
                {
                  this.state.resMessage.password &&
                  <div
                    className={classnames(styles.fontMessage)}>
                    {this.state.resMessage.password}</div>
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
                this.state.resMessage.password_confirm &&
                <div
                  className={classnames(styles.fontMessage)}>
                  {this.state.resMessage.password_confirm}</div>
              }

              {
                this.state.resMessage.warning &&
                <div
                  className={classnames(styles.fontMessage)}>
                  {this.state.resMessage.warning}</div>
              }
              <div
                className={classnames(styles.boxInput)}
                style={{color: '#ababab'}}>
                <span>
                  {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][0]}
                </span>
                <span>
                  <a href="/a/terms">
                    {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][1]}</a>
                </span>
                <span> {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][2]}</span>
                <span>
                  <a href="/a/privacy">
                    {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][3]}</a>
                </span>
                <span> {this.props.i18nUIString.catalog["descript_Sign_termsDeclaim"][4]}</span>
              </div>

            </div>
          ): (
            <div>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={ this._handleChange_Input }
                value={ this.state.email }
                className={classnames(styles.boxInput, styles.fontInput)}
                style={{width: "100%"}}
                required/>
                {
                  this.state.resMessage.email &&
                  <div
                    className={classnames(styles.fontMessage)}>
                    {this.state.resMessage.email}</div>
                }
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={ this._handleChange_Input }
                value={ this.state.firstName }
                className={classnames(styles.boxInput, styles.fontInput)}
                style={{width: "40%"}}
                required/>
              <input
                type="text"
                placeholder="Family Name"
                name="lastName"
                onChange={ this._handleChange_Input }
                value={ this.state.lastName}
                className={classnames(styles.boxInput, styles.fontInput)}
                style={{width: "40%"}}
                required/>
              {
                this.state.resMessage.account &&
                <div
                  className={classnames(styles.fontMessage)}>
                  {this.state.resMessage.account}</div>
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
              {
                this.state.resMessage.warning &&
                <div
                  className={classnames(styles.fontMessage)}>
                  {this.state.resMessage.warning}</div>
              }

            </div>
          )
        }
        <div
          style={{float:"right"}}>
          <LinkSignIn {...this.props}/>
          {
            this.state.finalSteps ? (
              <input
                type='submit'
                value="Sign Up"
                className={classnames(styles.boxSubmit)}
                disabled={this.state.axios? true:false}/>
            ):(
              <div
                className={classnames(styles.boxSubmit)}
                onClick={this._handleClick_StepsConti}>
                {"continue"}
              </div>
            )
          }
        </div>

      </form>

    )
  }

  render(){
    return(
      <div
        style={this.style.Signup_form_}>
        <div
          className={styles.boxLogo}>
          <SvgLogo/>
        </div>

        <h1>Registration</h1>
        {this._render_form()}

        {
          this.state.axios &&
          <MaskProcessing/>
        }
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
)(SignupForm));
