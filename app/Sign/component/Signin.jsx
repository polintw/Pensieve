import React from 'react';
import cxBind from 'classnames/bind';
import {
  Link
} from 'react-router-dom';
import {errHandler_axiosCatch} from '../../utils/errHandlers.js';

export default class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      response: null,
      errors: {}
    };
    this.axiosSource = axios.CancelToken.source();
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
    let reqBody = {};
    const self = this;
    reqBody['email'] = this.emailInput.value;
    reqBody['password'] = this.passwordInput.value;
    this.setState({axios: true});
    axios.post('/router/login', reqBody, {
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
      self.setState({axios: false});
      if(res.data.error == 0){
        console.log("Log in!");
        window.localStorage['token'] = res.data.token;
        window.location.assign('/');
      }else{
        console.log("Failed: "+ res.data.error);
        self.setState({response: res.data.error});
      }
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        let customSwitch = (status)=>{
          switch (status) {
            case 429:
              self.setState({response: 3});
              return true
              break;
            default:
              return false
          }
        };
        errHandler_axiosCatch(thrown, customSwitch);
      }
    });
  }


  _render_failedMessage(){
    switch (this.state.response) {
      case 1:
        return(
          <span>{'密碼或帳號輸入錯誤'}</span>
        )
        break;
      case 2:
        return(
          <span>{'此帳號不存在'}</span>
        )
        break;
      case 3:
        return(
          <span>{'輸入錯誤達5次以上，再次嘗試請稍待'}</span>
        )
        break;
      default:
        return null
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if(this.state.axios){
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
            {this._render_failedMessage()}
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
