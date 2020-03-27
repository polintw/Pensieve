import React from 'react';
import {
  Route,
  withRouter,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import {switchSettingSubmitting} from "../redux/actions/front.js";
import {
  cancelErr,
  uncertainErr
} from '../utils/errHandlers.js';

class Password extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      greenlight: false,
      warning: false,
      passNew: '',
      passConfirm: '',
      message: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_settingPassword = this._handle_settingPassword.bind(this);
    this._handleChange_passCheck = this._handleChange_passCheck.bind(this);
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
    const self = this;
    if(this.props.settingSubmitting) return; //prevent any repeated call
    if(this.state.greenlight){
      let reqBody = {};
      reqBody["password_old"] = this.passOld.value;
      reqBody["password"] = this.state.passNew;
      this.props._set_store_submittingStatus(true);
      axios.patch('/router/account/password', reqBody, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: this.axiosSource.token
      }).then(function (res) {
        self.props._set_store_submittingStatus(false);
        alert(res.data.message.warning);
        window.location.assign('/self/profile/sheet');
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          self.props._set_store_submittingStatus(false);
          let message = uncertainErr(thrown);
          if(message) self.setState({message: message});
        }
      });
    }else{
      this.setState({warning: true});
    }
  }

  _handleChange_passCheck(){
    let signal;
    this.setState({
      passNew: this.passNew.value,
      passConfirm: this.passConfirm.value
    },()=>{
      if (this.state.passConfirm.length > 0) {
        signal = this.state.passNew == this.state.passConfirm ? true : false;
        this.setState({
          greenlight: signal? true : false,
          warning: signal? false : true
        })
      }
    })
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
        style={this.style.selfCom_Setting_}>
        <form onSubmit={this._handle_settingPassword}>
          <span>{'change password'}</span><br/>
          <span>{"current password: "}</span><br/>
            <input
              type="password"
              ref={(element)=>{this.passOld = element}}
              required/><br/>
              {
                this.state.message.password_old &&
                <div>{this.state.message.password_old}</div>
              }
            <span>{"new password: "}</span><br/>
            <input
              type="password"
              ref={(element)=>{this.passNew = element}}
              onChange={this._handleChange_passCheck}
              required/><br/>
            {
              this.state.greenlight &&
              <span>{" 密碼已確認"}</span>
            }
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
              this.state.greenlight &&
              <span>{" 密碼已確認"}</span>
            }
            {
              this.state.warning &&
              <span>{" 請輸入相同密碼"}</span>
            }
            {
              this.state.message.warning &&
              <div>{this.state.message.warning}</div>
            }
            <input
              type='submit'
              value='submit'
              disabled={this.props.settingSubmitting? true:false}/>
            <Link
              to={{
                pathname: this.props.match.url ,
                search: '',

              }}>
              <input
                type='button'
                value='cancel'/>
            </Link>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_store_submittingStatus: (bool)=>{dispatch(switchSettingSubmitting(bool));}
  }
}

const reduxConnection = connect(
  null,
  mapDispatchToProps
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Password);
