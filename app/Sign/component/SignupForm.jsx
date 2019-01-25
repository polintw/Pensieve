import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import {
  setSignInit,
  axiosSwitch,
  axiosGetRes,
  handleSignUser
} from "../../redux/actions/handleSign.js";

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
      success: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_BirthOptions = this._render_BirthOptions.bind(this);
    this._handle_Signup = this._handle_Signup.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this.style={
      Signup_form_: {
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

  _handle_Signup(event){
    event.preventDefault();
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
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
      self.props._set_axiosRes({axiosStatus: false, message: res.data.message});
      self.setState({success: true});
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        if(thrown.response.data.console.length>0) console.log(thrown.response.data.console);
        self.props._set_axiosRes({axiosStatus: false, message: thrown.response.data.message});
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
        <h2 style={{marginBottom: '40px'}}>Registration</h2>
        <Link to="/signin">
          <span>{"Sign in"}</span>
        </Link>
        <form onSubmit={this._handle_Signup}>
            <div>
                <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={ this._handleChange_Input }
                value={ this.state.firstName }
                required/>
            </div>
            <div>
                <input
                type="text"
                placeholder="Family Name"
                name="lastName"
                onChange={ this._handleChange_Input }
                value={ this.state.lastName}
                required/>
            </div>
            {
              message.account &&
              <div>{message.account}</div>
            }
            <div>
                <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={ this._handleChange_Input }
                value={ this.state.email }
                required/>
            </div>
            {
              message.email &&
              <div>{message.email}</div>
            }
            <div>
                <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={ this._handleChange_Input }
                value={ this.state.password }
                required/>
            </div>
            {
              message.password &&
              <div>{message.password}</div>
            }
            <div>
                <input
                type="password"
                placeholder="Confirm Password"
                name="password_confirm"
                onChange={ this._handleChange_Input }
                value={ this.state.password_confirm }
                required/>
            </div>
            {
              message.password_confirm &&
              <div>{message.password_confirm}</div>
            }
            <div>
              <input
                type="radio"
                name="gender"
                value= {"1"}
                checked={this.state.gender === "1"}
                onChange={this._handleChange_Input}
                required/> Male
              <input
                type="radio"
                name="gender"
                value= {"0"}
                checked={this.state.gender === "0"}
                onChange={this._handleChange_Input}/> Female
            </div>
            <div>
              <p>{"生日"}</p>
              <select name="birthYear" onChange={this._handleChange_Input} value={this.state.birthYear}>
                {this._render_BirthOptions(currY, currY-90)}
              </select>
              <select name="birthMonth" onChange={this._handleChange_Input} value={this.state.birthMonth}>
                {this._render_BirthOptions(12)}
              </select>
              <select name="birthDate" onChange={this._handleChange_Input} value={this.state.birthDate}>
                {this._render_BirthOptions(31)}
              </select>
            </div>
            {
                message.warning &&
                <div>{message.warning}</div>
              }
            <div>
              <input
                type='submit'
                value="Register User"/>
            </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    message: state.message
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
