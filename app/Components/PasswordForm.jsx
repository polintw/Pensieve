import React from 'react';
import {
  Route,
  withRouter,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  cancelErr,
  uncertainErr
} from '../utils/errHandlers.js';

class PasswordForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      greenlight: false,
      passNew: '',
      passConfirm: '',
      passOld: '',
      message: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._check_passwordRules = this._check_passwordRules.bind(this);
    this._handle_settingPassword = this._handle_settingPassword.bind(this);
    this._handleChange_passCheck = this._handleChange_passCheck.bind(this);
    this._handleChange_passOld = ()=>{this.setState({passOld: this.passOld.value});};
    this.style={
      selfCom_Setting_: {
        width: '42%',
        height: '80%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxSizing: 'border-box',
        borderRadius: '0.5rem',
      },
    }
  }

  _handle_settingPassword(event){
    event.preventDefault();
    if(this.state.axios) return; //prevent any repeated call

    if(this.state.greenlight){
      const self = this;
      let reqBody = {};
      reqBody["password_old"] = this.state.passOld; //empty if under /pwreset
      reqBody["password"] = this.state.passNew;
      reqBody["password_confirm"] = this.state.passConfirm;
      let params = new URLSearchParams(this.props.location.search); //we need value in URL query
      let token = !this.props.pwreset? window.localStorage['token']: params.get('token');

      this.setState({axios: true});
      axios({
        method: 'patch',
        url: '/router/account/password',
        params: !this.props.pwreset? {}:{forget: true},
        data: reqBody,
        headers: {
          'charset': 'utf-8',
          'token': token
        },
        cancelToken: this.axiosSource.token
      }).then(function (res) {
        self.setState({axios: false});
        self.props._submit_success();
      }).catch(function (thrown) {
        self.setState({axios: false});
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if(message) self.setState({message: message});
        }
      });
    }else{
      this.setState({
        message: {warning: this.props.i18nUIString.catalog['hint_inputMessage_pw'][0]}
      });
    }
  }

  _handleChange_passCheck(){
    let signal;
    this.setState({
      passNew: this.passNew.value,
      passConfirm: this.passConfirm.value
    },()=>{
      if (this.state.passConfirm.length > 0) {
        signal = (this.state.passNew == this.state.passConfirm) ? true : false;
        let messageObj = !signal? {warning: this.props.i18nUIString.catalog['hint_inputMessage_pw'][0]} : {warning: ''};
        this.setState((prevState, props)=>{
          return {
            greenlight: signal? true : false,
            message:  {...prevState.message, ...messageObj}
          };
        })
      }
    })
  }

  _check_passwordRules(event){
    /*
    this is an onBlur f(), fires when element has lost focus.
    it would not bubbles.
    we planning check if the password fullfill the rules we need.
    Now just only 1 simple rule: between 6~30 characters
    */
    let strLength = event.target.value.length;
    if(strLength < 6 || strLength > 30) {
      this.setState({
        message: {password: 'Password must more than 6 chars (and no more than 30)'}
      })
    }
    else{
      this.setState((prevState, props)=>{
        let alternative = {password: ''};
        return ({
          message: {...prevState.message, ...alternative}
        });
      })
    };
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.selfCom_Setting_}>
        <form onSubmit={this._handle_settingPassword}>
          {
            !this.props.pwreset &&
            <div>
              <span>{"current password: "}</span><br/>
              <input
                type="password"
                ref={(element)=>{this.passOld = element}}
                onChange={this._handleChange_passOld}
                required/><br/>
              {
                this.state.message.password_old &&
                <div>{this.state.message.password_old}</div>
              }
            </div>
          }
            <span>{"new password: "}</span><br/>
            <input
              type="password"
              ref={(element)=>{this.passNew = element}}
              onChange={this._handleChange_passCheck}
              onBlur={this._check_passwordRules}
              required/><br/>
            {
              this.state.message.password &&
              <div>{this.state.message.password}</div>
            }
            <span>{"confirm new password"}</span><br/>
            <input
              type="password"
              ref={(element)=>{this.passConfirm = element}}
              onChange={this._handleChange_passCheck}
              required/><br/>
            {
              this.state.message.warning &&
              <div>{this.state.message.warning}</div>
            }

            <input
              type='submit'
              value='submit'
              disabled={(this.state.axios && !this.state.greenlight)? true:false}/>
            {
              !this.props.pwreset &&
              <Link
                to={{
                  pathname: this.props.match.url ,
                  search: '',

                }}>
                <input
                  type='button'
                  value='cancel'/>
              </Link>
            }

        </form>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordForm);
