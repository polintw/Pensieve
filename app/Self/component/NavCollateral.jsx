import React from 'react';
import cxBind from 'classnames/bind';

export default class NavCollateral extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavCollateral_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavCollateral_button_: {
        fontSize: '1.1rem',
        fontWeight: '300',
        letterSpacing: '0.2rem',
        cursor: 'pointer'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavCollateral_}>
        <span
          style={this.style.selfCom_NavCollateral_button_}>
          {'系列'}</span>
        <span
          style={this.style.selfCom_NavCollateral_button_}>
          {'通知'}</span>
      </div>
    )
  }
}
