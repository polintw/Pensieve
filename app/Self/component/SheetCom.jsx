import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

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
      case 0:
        return (<span>{"生理女"}</span>)
        break;
      case 1:
        return (<span>{"生理男"}</span>)
        break;
      default:
        return (<Link to="/profile/sheet?status=editting">{"+ 新增性別資訊"}</Link>)
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let queryStatus = params.get('status'), statusEditting;
    if(queryStatus == 'editting')statusEditting = true;

    return(
      <div
        style={this.style.selfCom_Sheet_Basic_}>
          {
            statusEditting?(
              <form onSubmit={this._handle_sheetBasic}>
                <div>
                  <span>{"性別 : "}</span>
                  <select
                    name="gender"
                    ref={(element)=>{this.genderSelect = element}}>
                    <option value={0}>{"生理女"}</option>
                    <option value={1}>{"生理男"}</option>
                  </select>
                </div>
                <input
                  type="submit"
                  value="save"/>
                <Link
                  to="/profile/sheet" replace>
                {"cancel"}</Link>
              </form>
            ):(
              <div>
                <div>
                  <span>{"性別 : "}</span>
                  {this._render_Gender(this.props.userSheet.gender)}
                </div>
                <div>
                  <Link
                    to="/profile/sheet?status=editting">
                    {" edit "}</Link>
                </div>
              </div>
            )
          }
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
          to="/profile/sheet?status=setting"
          style={this.style.selfCom_Setting_link}>
          {" reset "}</Link>
      </div>
    )
  }
}

class SettingPassword extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandify: false,
      greenlight: false,
      warning: false,
      passNew: '',
      passConfirm: ''
    };
    this._handle_settingPassword = this._handle_settingPassword.bind(this);
    this._handleClick_passwordChange = this._handleClick_passwordChange.bind(this);
    this._handleChange_passCheck = this._handleChange_passCheck.bind(this);
    this.style={
      selfCom_Setting_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      selfCom_Setting_password_modal: {
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
    if(this.state.greenlight){
      let reqBody = {};
      reqBody["passOld"] = this.passOld.value;
      reqBody["passNew"] = this.state.passNew;
      this.setState({axios: true});
      axios.patch('/router/account/setting', reqBody, {
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

  _handleClick_passwordChange(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState({expandify: true});
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Setting_}>
        <input
          type="button"
          value=" change password "
          onClick={this._handleClick_passwordChange}/>
        {
          this.state.expandify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed"}}>
              <div
                style={this.style.selfCom_Setting_password_modal}>
                <form onSubmit={this._handle_settingPassword}>
                  <span>{'請輸入'}</span><br/>
                  <span>{"舊密碼: "}</span><br/>
                    <input
                      type="password"
                      ref={(element)=>{this.passOld = element}}/><br/>
                    <span>{"新密碼: "}</span><br/>
                    <input
                      type="password"
                      ref={(element)=>{this.passNew = element}}
                      onChange={this._handleChange_passCheck}/><br/>
                    {
                      this.state.greenlight &&
                      <span>{" 密碼已確認"}</span>
                    }
                    <span>{"新密碼  再輸入一次: "}</span><br/>
                    <input
                      type="password"
                      ref={(element)=>{this.passConfirm = element}}
                      onChange={this._handleChange_passCheck}/><br/>
                    {
                      this.state.greenlight &&
                      <span>{" 密碼已確認"}</span>
                    }
                    {
                      this.state.warning &&
                      <span>{" 請輸入相同密碼"}</span>
                    }
                    <input
                      type='submit'
                      value='確認更改'/>
                    <input
                      type='button'
                      value='取 消'/>
                </form>
              </div>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}


class SettingAccount extends React.Component {
  //this part is more like a temporary stay in this file, would moving to a independent 'setting page' someday.
    constructor(props){
      super(props);
      this.state = {
        axios: false
      };
      this._handle_settingAccount = this._handle_settingAccount.bind(this);
      this.style={
        selfCom_Setting_account: {
          width: '100%',
          height: '45vh',
          position: 'relative'
        },
        selfCom_Setting_accountForm: {
          width: '100%',
          height: '56%',
          position: 'relative',
          boxSizing: 'border-box',
        },
        selfCom_Setting_email_: {
          width: '100%',
          height: '24%',
          position: 'relative',
          boxSizing: 'border-box',
          fontSize: '1.5rem',
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
        },
        selfCom_Setting_nameBar_: {
          width: '100%',
          height: '40%',
          position: 'absolute',
          top: '0',
          left: '0',
          boxSizing: 'border-box',
          fontSize: '1.5rem',
          letterSpacing: '0.15rem',
          fontWeight: '400'
        }
      }
    }

    _handle_settingAccount(event){
      event.preventDefault();
      const self = this;
      let reqBody = {};
      reqBody["firstName"] = this.accountFirst.value;
      reqBody["lastName"] = this.accountLast.value;
      this.setState({axios: true});
      axios.patch('/router/account/setting', reqBody, {
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

    render(){
      //let cx = cxBind.bind(styles);
      return(
        <div
          style={this.style.selfCom_Setting_account}>
          <div
            style={this.style.selfCom_Setting_email_}>
            <span>{this.props.accountSet.mail}</span>
            <span>{"a valid email adress could not be changed"}</span>
          </div>
          <div
            style={this.style.selfCom_Setting_pass}>
            <span>{"password: "}</span>
            <SettingPassword/>
          </div>
          <form
            style={this.style.selfCom_Setting_accountForm}
            onSubmit={this._handle_settingAccount}>
            <div
              style={this.style.selfCom_Setting_nameBar_}>
              <span>{"姓 : "}</span>
              <input
                type="text"
                ref={(element)=>{this.accountLast = element}}
                defaultValue={this.props.accountSet.lastName}/>
              <span>{"名 : "}</span>
              <input
                type="text"
                ref={(element)=>{this.accountFirst = element}}
                defaultValue={this.props.accountSet.firstName}/>
            </div>
            <input
              type="submit"
              value="confirm"
              style={{position: 'absolute', bottom: '5%', right: '5%'}}/>
            <Link
              to="/profile/sheet"
              replace
              style={{position: 'absolute', bottom: '5%', right: '15%'}}>
            {"cancel"}</Link>
          </form>
        </div>
      )
    }
  }


  const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    userSheet: state.userSheet,
    accountSet: state.accountSet
  }
}

const reduxConnection = connect(
  mapStateToProps,
  null
);

export const SheetSetting = reduxConnection(SettingAccount);
export const SheetAccount = reduxConnection(AccountatSheet);
export const SheetBasic = reduxConnection(Basic);
