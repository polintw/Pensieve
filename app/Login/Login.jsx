import React from 'react';
import cxBind from 'classnames/bind';
import Signin from './component/Signin.jsx';
import Signup from './component/Signup.jsx';

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pages: 'signin'
    };
    this._render_pages_Login = this._render_pages_Login.bind(this);
    this.style={
      div_Base: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Login_pages_Signin: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Login_pages_Signup: {

      }
    }
  }

  _render_pages_Login(){
    switch (this.state.pages) {
      case 'signin':
        return (
          <div
            style={this.style.Login_pages_Signin}>
            <Signin/>
          </div>
        )
        break;
      case 'signup':
        return(
          <div
            style={this.style.Login_pages_Signup}>
            <Signup/>
          </div>
        )
        break;
      default:
        return (
          <div
            style={this.style.Login_pages_Signin}>
            <Signin/>
          </div>
        )
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.div_Base}>
        {this._render_pages_Login()}
      </div>
    )
  }
}
