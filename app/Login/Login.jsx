import React from 'react';
import cxBind from 'classnames/bind';
import Signin from './component/Signin.jsx';

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pages: 'signin'
    };
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
      }
    }
  }


  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.div_Base}>
        <div
          style={this.style.Login_pages_Signin}>
          <Signin/>
        </div>
      </div>
    )
  }
}
