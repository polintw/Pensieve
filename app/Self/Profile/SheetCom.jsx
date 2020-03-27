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
} from '../../utils/errHandlers.js';

const styleMiddle= {
  fontContent: {
    fontSize: '1.4rem',
    letterSpacing: '0.12rem',
    fontWeight: '400'
  },
  submit: {
    fontSize: '1.3rem',
    letterSpacing: '0.12rem',
    fontWeight: '400'
  },
  basicList: {
    width: '70%',
    position: 'absolute',
    left: '6%',
    boxSizing: 'border-box',
  }
}

class Basic extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this._render_Gender = this._render_Gender.bind(this);
    this.style={
      selfCom_Sheet_Basic_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      selfCom_Sheet_Basic_list_gender: {
        top: '25%',
      },
      selfCom_Sheet_Basic_list_birth: {
        top: '49%',
      },
    }
  }


  _render_Gender(dbRecords){
    switch (dbRecords) {
      case 0:
        return (<span>{"Female"}</span>)
        break;
      case 1:
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
        <div
          style={Object.assign({}, this.style.selfCom_Sheet_Basic_list_gender, styleMiddle.basicList, styleMiddle.fontContent)}>
          <span>{"gender : "}</span>
          {this._render_Gender(sheetRec.gender)}
        </div>
        <div
          style={Object.assign({}, this.style.selfCom_Sheet_Basic_list_birth, styleMiddle.basicList, styleMiddle.fontContent)}>
          <span>{"birthday : "}</span>
          {
            (sheetRec.birthDate && sheetRec.birthYear && sheetRec.birthMonth)?(
              <p
                style={{display: 'inline-block', margin: '0'}}>
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
      selfCom_Setting_email_: {
        width: '70%',
        height: '24%',
        position: 'absolute',
        top: '25%',
        left: '6%',
        boxSizing: 'border-box',
      },
      selfCom_Setting_reset: {
        position: 'absolute',
        top: '69%',
        left: '58%',
        boxSizing: 'border-box',
      },
      selfCom_Setting_pass: {
        position: 'absolute',
        top: '69%',
        left: '6%',
        boxSizing: 'border-box',
      }
    }
  }

  render(){
    return(
      <div
        style={this.style.selfCom_Setting_}>
        <div
          style={Object.assign({}, this.style.selfCom_Setting_email_, styleMiddle.fontContent)}>
          <span>{"email: "}</span>
          <span>{this.props.accountSet.mail}</span>
        </div>
        <Link
          to={{
            pathname: this.props.match.url ,
            search: '?status=password',
          }}
          style={Object.assign({},this.style.selfCom_Setting_pass,styleMiddle.submit)}>
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

  }
}

const reduxConnection = connect(
  null,
  mapDispatchToProps
);

export const SheetAccount = withRouter(reduxConnection(AccountatSheet));
export const SheetBasic = reduxConnection(Basic);
