import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import {
  setSignInit,
  handleSignUser
} from "../../redux/actions/handleSign.js";

class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      response: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_Signin = this._handle_Signin.bind(this);
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
          style={this.style.Signin_member_}>
          <form onSubmit={this._handle_Signin}>
            {'email:'}<br/>
            <input
              type="email"
              placeholder="Email"
              name="email"
              ref={(element)=>{this.emailInput = element}}/><br/>
              {
                message.email &&
                <div>{message.email}</div>
              }
            {'password:'}<br/>
            <input
              type="password"
              placeholder="Password"
              ref={(element)=>{this.passwordInput = element}}/><br/>
              {
                message.password &&
                <div>{message.password}</div>
              }
            <br/>
            {
                message.warning &&
                <div>{message.warning}</div>
              }
            <input
              type='submit'
              value='Log in'
              disabled={this.props.axios? true:false}/>
            <Link to="/signup">
              <span>{"Sign up"}</span>
            </Link>
            {
              message.warning && this.props.code == "33" &&
              <Link to="/signup/email">
                <span>{"send the verified email again"}</span>
              </Link>
            }
          </form>
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
