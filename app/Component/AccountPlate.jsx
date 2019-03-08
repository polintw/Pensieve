import React from 'react';
import cxBind from 'classnames/bind';
import SvgPropic from './SvgPropic.jsx';

const generalStyle = {
  Com_AccountPlate_: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  Com_AccountPlate_text_: {
    display: 'inline-block',
    width: '73%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '10%',
    boxSizing: 'border-box',
    fontSize: '1.8rem',
    letterSpacing: '0.2vh',
    fontWeight: '400',
    color: '#FAFAFA'
  },
  Com_AccountPlate_propic_: {
    display: 'inline-block',
    width: '27%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  Com_AccountPlate_name_label_: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box'
  }
}

export class UserPlate extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this.style={

    }
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_Account('user', this.props.userInfo.id);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_AccountPlate_}
        onClick={this._handleClick_Account}>
        <div style={generalStyle.Com_AccountPlate_propic_}>
          <SvgPropic/>
        </div>
        <span style={generalStyle.Com_AccountPlate_text_}>
          {this.props.userInfo.account}
        </span>
      </div>
    )
  }
}

export class AuthorPlate extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this.style={

    }
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_Account('user', this.props.authorBasic.authorId);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={generalStyle.Com_AccountPlate_}
        onClick={this._handleClick_Account}>
        <div style={generalStyle.Com_AccountPlate_propic_}>
          <SvgPropic/>
        </div>
        <span style={generalStyle.Com_AccountPlate_text_}>
          {this.props.authorBasic.account}
        </span>
      </div>
    )
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
    this.props._handleClick_Account(this.props.accountId, 'user');
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
