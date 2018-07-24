import React from 'react';
import cxBind from 'classnames/bind';

export default class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Signin = this._handleClick_Signin.bind(this);
    this.style={
      Signin_: {

      },
      Signin_member_: {

      },
      Signin_register_: {

      }
    }
  }

  _handleClick_Signin(event){
    event.preventDefault();
    event.stopPropagation();
    let reqBody = {};
    reqBody['account'] = this.accountInput.value;
    reqBody['password'] = this.passwordInput.value;
    axios.post('/login', reqBody, {
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
        if(res.status = 200){
          console.log("Log in!");
          window.location.reload(true);
        }else{
          console.log("Failed: "+ res.data.error);
          alert("Failed, due to:"+res.data.error);
        }
    }).catch(function (error) {
      console.log(error);
      alert("Failed, please try again later");
    });
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Signin_}>
        <div
          style={this.style.Signin_member_}>
          {'帳 號:'}<br>
          <input
            type="text"
            ref={(element)=>{this.accountInput = element}}><br>
          {'密 碼:'}<br>
          <input
            type="password"
            ref={(element)=>{this.passwordInput = element}}><br><br>
          <div
            onClick={this._handleClick_Signin}>
            {'登 入'}
          </div>
        </div>
        <div
          style={this.style.Signin_register_}>

        </div>
      </div>
    )
  }
}
