import React from 'react';
import cxBind from 'classnames/bind';

export default class SelfCover extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userBasic: this.props.userBasic
    };
    this._handleClick_entry_UnitBase = this._handleClick_entry_UnitBase.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      Self_pages_SelfCover_: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Self_pages_SelfCover_side_: {
        width: '68%',
        height: '20%',
        position: 'absolute',
        top: '40%',
        left: '18%',
        boxSizing: 'border-box',
        boxShadow: 'inset 0px -2px 2px -2px, inset 0px 2px 2px -2px'
      },
      Self_pages_SelfCover_side_userName: {
        width: '36%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '5%',
        fontSize: "5.6vh",
        letterSpacing: '0.6vh',
        fontWeight: '300',
        color: '#222222'
      },
      Self_pages_SelfCover_side_entry_: {
        width: '30%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '70%',
        fontSize: "3.6vh",
        letterSpacing: '0.4vh',
        color: '#222222',
        cursor: 'pointer'
      },
      Self_pages_SelfCover_close_: {
        width: '6%',
        height: '8%',
        position: 'fixed',
        top: '64%',
        right: '2%',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_close_svg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_Logo: {
        width: '16%',
        height: '10%',
        position: 'absolute',
        bottom:'0%',
        left: '6%',
        boxSizing: 'border-box',
        fontSize: '3.2vh',
        letterSpacing: '0.4vh',
        color: '#222222'
      }
    }
  }

  _handleClick_entry_UnitBase(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/self/front');
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Self_pages_SelfCover_}>
        <div
          style={this.style.Self_pages_SelfCover_side_}>
          <div style={this.style.Self_pages_SelfCover_side_userName}>{this.state.userBasic.account}</div>
          <div
            style={this.style.Self_pages_SelfCover_side_entry_}
            onClick={this._handleClick_entry_UnitBase}>
            {'Expand'}
          </div>
        </div>
        <div
          style={this.style.Self_pages_SelfCover_close_}>
          <svg
            style={this.style.Self_pages_SelfCover_close_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'
              style={{cursor: 'pointer'}}
              onClick={this._handleClick_selfClose}>
              {" x "}
            </text>
          </svg>
        </div>
        <div style={this.style.Self_pages_SelfCover_Logo}>{'CORNER'}</div>
      </div>
    )
  }
}
