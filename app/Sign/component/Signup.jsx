import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import {
  axiosSwitch,
  axiosGetRes,
  handleSignUser
} from "../../redux/actions/handleSign.js";

class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password_confirm: '',
    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_Signup = this._handle_Signup.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this.style={
      Signup_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
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
    };
    this.props._set_axiosStatus(true);
    axios.post('/router/register', reqBody, {
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
      self.props._set_axiosRes({axiosStatus: false, message: res.data.message});
      let submitObj ={
        email: self.state.email,
        password: self.state.password
      };
      self.props._submit_Signin(submitObj);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.props._set_axiosRes({axiosStatus: false, message: thrown.response.data.message});
      }
    });
  }

  _handleChange_Input(event) {
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    const message = this.props.message;
    return(
      <div
        style={this.style.Signup_}>
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
                  />
              </div>
              <div>
                  <input
                  type="text"
                  placeholder="last Name"
                  name="lastName"
                  onChange={ this._handleChange_Input }
                  value={ this.state.lastName}
                  />
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
                  />
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
                  />
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
                  />
              </div>
              {
                message.password_confirm &&
                <div>{message.password_confirm}</div>
              }
              <div>
                <input
                  type='submit'
                  value="Register User"/>
              </div>
          </form>
        </div>
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
    _set_axiosRes: (resObj)=>{dispatch(axiosGetRes(resObj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup));
