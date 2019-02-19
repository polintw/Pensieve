import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';
import {switchSettingSubmitting} from "../../redux/actions/general.js";

class Basic extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this._handle_sheetBasic = this._handle_sheetBasic.bind(this);
    this._render_Gender = this._render_Gender.bind(this);
    this.style={
      selfCom_Sheet_Basic_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      }
    }
  }

  _handle_sheetBasic(event){
    event.preventDefault();
    const self = this;
    let reqBody = {};
    reqBody["gender"] = this.genderSelect.value;
    this.setState({axios: true});
    axios.patch('/router/profile/sheet', reqBody, {
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
      self.setState({
        axios: false
      });
      window.location.assign('/user/profile/sheet');
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        let customSwitch = (status)=>{
          return null;
        };
        errHandler_axiosCatch(thrown, customSwitch);
      }
    });
  }


  _render_Gender(dbRecords){
    switch (dbRecords) {
      case "0":
        return (<span>{"Female"}</span>)
        break;
      case "1":
        return (<span>{"Male"}</span>)
        break;
      default:
        return (<span>{"no gender record"}</span>)
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const sheetRec = this.props.userSheet;

    return(
      <div
        style={this.style.selfCom_Sheet_Basic_}>
        <div>
          <div>
            <span>{"gender : "}</span>
            {this._render_Gender(sheetRec.gender)}
          </div>
          <div>
            <span>{"birthday : "}</span>
            {
              (sheetRec.birthDate && sheetRec.birthYear && sheetRec.birthMonth)?(
                <p>
                  <span>{this.props.userSheet.birthDate + ". "}</span>
                  <span>{this.props.userSheet.birthMonth + ". "}</span>
                  <span>{this.props.userSheet.birthYear}</span>
                </p>
              ):(
                <span>{"no birthday record"}</span>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

class SettingPassword extends React.Component {
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
        backgroundColor: '#FAFAFA'
      }
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
        window.location.assign('/user/profile/sheet');
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          self.props._set_store_submittingStatus(false);
          let resConsole = thrown.response.data.console; // to verify the string length, this is neccessary.
          if(resConsole.length>0) console.log(thrown.response.data.console);
          self.setState({message: thrown.response.data.message});
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
              to="/profile/sheet"
              style={this.style.selfCom_Setting_pass}>
              <input
                type='button'
                value='cancel'/>
            </Link>
        </form>
      </div>
    )
  }
}

class AccountatSheet extends React.Component {
//this part is more like a temporary stay in this file, would moving to a independent 'setting page' someday.
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_Setting_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      selfCom_Setting_nameBar_: {
        width: '70%',
        height: '40%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.2rem',
        letterSpacing: '0.12rem',
        fontWeight: '400'
      },
      selfCom_Setting_email_: {
        width: '70%',
        height: '24%',
        position: 'absolute',
        top: '50%',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.2rem',
        letterSpacing: '0.12rem',
        fontWeight: '400'
      },
      selfCom_Setting_link: {
        width: '25%',
        position: 'absolute',
        top: '50%',
        right: '5%',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400'
      },
      selfCom_Setting_pass: {
        width: '100%',
        height: '12%',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: '1.5rem',
        letterSpacing: '0.15rem',
        fontWeight: '400'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Setting_}>
        <div
          style={this.style.selfCom_Setting_nameBar_}>
          <span>{"姓 : "}</span>
          <span>{this.props.accountSet.lastName}</span>
          <span>{"名 : "}</span>
          <span>{this.props.accountSet.firstName}</span>
        </div>
        <div
          style={this.style.selfCom_Setting_email_}>
          <span>{"email: "}</span>
          <span>{this.props.accountSet.mail}</span>
        </div>
        <Link
          to="/profile/sheet?status=password"
          style={this.style.selfCom_Setting_pass}>
          <input
            type="button"
            value=" change password "/>
        </Link>
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
  mapStateToProps,
  mapDispatchToProps
);

export const SheetPassword = reduxConnection(SettingPassword);
export const SheetAccount = reduxConnection(AccountatSheet);
export const SheetBasic = reduxConnection(Basic);
