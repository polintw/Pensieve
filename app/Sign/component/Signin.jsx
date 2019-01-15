import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import {handleSignUser} from "../../redux/actions/handleSign.js";

class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      response: null,
      errors: {}
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
    this.props._submit_Signin(submitObj);
  }


  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.props.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Signin_}>
        <div
          style={this.style.Signin_member_}>
          <form onSubmit={this._handle_Signin}>
            {'電子郵件:'}<br/>
            <input
              type="email"
              placeholder="Email"
              name="email"
              ref={(element)=>{this.emailInput = element}}/><br/>
            {'密 碼:'}<br/>
            <input
              type="password"
              placeholder="Password"
              ref={(element)=>{this.passwordInput = element}}/><br/><br/>
            <input
              type='submit'
              value='Log in'/>
            <Link to="/signup">
              <span>{"Sign up"}</span>
            </Link>
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
    _submit_Signin: (submitObj)=>{dispatch(handleSignUser(submitObj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signin));
