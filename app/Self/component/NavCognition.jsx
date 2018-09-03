import React from 'react';
import cxBind from 'classnames/bind';

export default class NavCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_nav_focus = this._handleClick_nav_focus.bind(this);
    this.style={
      selfCom_NavCognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavCognition_nav_span: {
        display: 'inline-block',
        width: '30%',
        boxSizing: 'border-Box',
        verticalAlign: 'middle',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_nav_focus(event){
    event.stopPropagation();
    event.preventDefault();
    let focusNext = event.currentTarget.getAttribute('tab');
    let cognitionTo = [];
    switch (focusNext) {
      case 'storage':
        cognitionTo.push('storage', 'inspired')
        break;
      case 'move':
        cognitionTo.push('move', 'shared')
        break;
      case 'mutual':
        cognitionTo.push('mutual', '')
        break;
      default:

    }
    this.props._set_Focus(cognitionTo[0], cognitionTo[1]);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavCognition_}>
        <span
          tab={"move"}
          style={this.style.selfCom_NavCognition_nav_span}
          onClick={this._handleClick_nav_focus}>
          {"行動"}
        </span>
        <span
          tab={"storage"}
          style={this.style.selfCom_NavCognition_nav_span}
          onClick={this._handleClick_nav_focus}>
          {"見聞"}
        </span>
        <span
          tab={"mutual"}
          style={this.style.selfCom_NavCognition_nav_span}
          onClick={this._handleClick_nav_focus}>
          {"來往"}
        </span>
      </div>
    )
  }
}
