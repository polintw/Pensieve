import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";

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
        return (<span>{"尚未填入性別資訊"}</span>)
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

export const SheetAccount = reduxConnection(AccountatSheet);
export const SheetBasic = reduxConnection(Basic);
