import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

const generalStyle = {
  spanNameRegular: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    fontSize: '1.45rem',
    fontWeight: '400',
    letterSpacing: '0.1rem',
  },
  spanNameMedium: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    fontSize: '2rem',
    fontWeight: '400',
    letterSpacing: '0.18rem',
  },
  spanNameLarge: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    fontSize: "3.6rem",
    fontWeight: '400',
    letterSpacing: '0.21rem',
  },
  Com_AccountPlate_name_label_: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box'
  }
}

export class NameLabelRe extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_stylechoice = this._set_stylechoice.bind(this);
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this.style={
      namelabel_regular_small: {
        fontSize: '1.4rem',
        letterSpacing: '0.12rem',
        fontWeight: '400'
      },
      namelabel_regular_large: {
        fontSize: '2.8rem',
        letterSpacing: '0.2rem',
        fontWeight: '400'
      }
    }
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_Account('user', this.props.accountId);
  }

  _set_stylechoice(parm){
    switch (parm) {
      case "small":
        return {_span: this.style.namelabel_regular_small}
        break;
      case "large":
        return {_span: this.style.namelabel_regular_large}
        break;
      default:
        return {_span: this.style.namelabel_regular_small}
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    let labelstyle = this._set_stylechoice(this.props.size);

    return(
      <div
        style={generalStyle.Com_AccountPlate_name_label_}
        onClick={this._handleClick_Account}>
        <span style={labelstyle._span}>
          {this.props.accountFisrtName+" "}
        </span>
        <span style={labelstyle._span}>
          {this.props.accountLastName}
        </span>
      </div>
    )
  }
}

class Regular extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <span style={generalStyle.spanNameRegular}>
        {this.props.userInfo.firstName + " " + this.props.userInfo.lastName}
      </span>
    )
  }
}

class Medium extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <span style={generalStyle.spanNameMedium}>
        {this.props.userInfo.firstName + " " + this.props.userInfo.lastName}
      </span>
    )
  }
}

class Large extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <span style={generalStyle.spanNameLarge}>
        {this.props.firstName + " " + this.props.lastName}
      </span>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const reduxConnection = connect(
  mapStateToProps,
  null
);

export const NameRegular = withRouter(reduxConnection(Regular));
export const NameMedium = withRouter(reduxConnection(Medium));
export const NameLarge = withRouter(reduxConnection(Large));
