import React from 'react';
import cxBind from 'classnames/bind';

export default class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      response: null
    };
    this._handle_Signin = this._handle_Signin.bind(this);
    this._render_failedMessage = this._render_failedMessage.bind(this);
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
        width: '36%',
        height: '70%',
        position: 'absolute',
        top: '30%',
        left: '20%',
        boxSizing:'border-box'
      },
      Signin_register_: {

      }
    }
  }

  _handle_Signin(event){
    event.preventDefault();
    let reqBody = {};
    reqBody['email'] = this.emailInput.value;
    reqBody['password'] = this.passwordInput.value;
    axios.post('/router/login', reqBody, {
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
        if(res.data.error == 0){
          console.log("Log in!");
          window.localStorage['token'] = res.data.token;
          window.location.assign('/');
        }else{
          console.log("Failed: "+ res.data.error);
          this.setState({response: res.data.error});
        }
    }).catch(function (error) {
      console.log(error);
      alert("Failed, please try again later");
    });
  }

  _render_failedMessage(){
    if(this.state.response==1){
      return(
        <span>{'密碼或帳號輸入錯誤'}</span>
      )
    }else if(this.state.response==2){
      return(
        <span>{'此帳號不存在'}</span>
      )
    }
    return null
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
          <form onSubmit={this._handle_Signin}>
            {'電子郵件:'}<br/>
            <input
              type="text"
              ref={(element)=>{this.emailInput = element}}/><br/>
            {'密 碼:'}<br/>
            <input
              type="password"
              ref={(element)=>{this.passwordInput = element}}/><br/><br/>
            {this._render_failedMessage()}
            <input
              type='submit'
              value='登 入'/>
          </form>
        </div>
        <div
          style={this.style.Signin_register_}>

        </div>
      </div>
    )
  }
}
