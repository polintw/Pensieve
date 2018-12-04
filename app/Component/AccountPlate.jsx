import React from 'react';
import cxBind from 'classnames/bind';

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
        <span style={generalStyle.Com_AccountPlate_text_}>
          {this.props.authorBasic.account}
        </span>
      </div>
    )
  }
}
