import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import cxBind from 'classnames/bind';

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      selfCom_NavsCognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      Self_pages_Front_Scape: {
        width: '3%',
        height: '88%',
        position: 'absolute',
        bottom: '8%',
        left: '14%',
        boxSizing: 'border-box'
      },
      Self_pages_Front_Scape_circle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '50%',
        right: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      }
    }
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
        style={this.style.selfCom_NavsCognition_}>
        <div
          style={this.style.Self_pages_Front_Scape}>
          <svg
            style={this.style.Self_pages_Front_Scape_circle}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
          </svg>
        </div>
      </div>
    )
  }
}
