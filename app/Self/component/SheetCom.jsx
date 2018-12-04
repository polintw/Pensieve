import React from 'react';
import {connect} from "react-redux";

//we put these const here are because the setting page is temporary stay in this file
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

class GenderBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_Sheet_Gender_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Sheet_Gender_}>
        <div>
          <span>{"性別 : "}</span>
          <span>{this.props.userSheet.gender}</span>
          <span>{"[edit]"}</span>
        </div>
      </div>
    )
  }
}

class NameBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NameBar_: {
        width: '100%',
        height: '70%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '2% 0'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NameBar_}>
        <div>
          <span>{"姓 : "}</span>
          <span>{this.props.accountSet.lastName}</span>
          <span>{"名 : "}</span>
          <span>{this.props.accountSet.firstName}</span>
          <span>{"[edit]"}</span>
        </div>
      </div>
    )
  }
}

const SettingName = reduxConnection(NameBar);

class Setting extends React.Component {
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
        width: '100%',
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
        width: '100%',
        height: '40%',
        position: 'absolute',
        top: '50%',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.2rem',
        letterSpacing: '0.12rem',
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
          <SettingName/>
        </div>
        <div
          style={this.style.selfCom_Setting_email_}>
          <span>{"email: "}</span>
          <span>{this.props.accountSet.mail}</span>
        </div>
        <div>
          <span>{"password: "}</span>
          <span>{"********"}</span>
        </div>
        <span>{"setting"}</span>
      </div>
    )
  }
}


export const SettingTemp = reduxConnection(Setting);
export const SheetGender = reduxConnection(GenderBar);
