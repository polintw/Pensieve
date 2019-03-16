import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

class NavSelf extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this._handleClick_selfCover = this._handleClick_selfCover.bind(this);
    this.style={
      Com_NavSelf_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_NavSelf_AccountBack_: {
        display:'inline-block',
        height: '92%',
        position: 'absolute',
        top: '8%',
        right: '36%',
        boxSizing: 'border-box',
        padding: '0.5vh 0',
        borderTop: '0.2rem solid #d3deda',
        textAlign: 'center',
        cursor: 'pointer'
      },
      Com_NavSelf_AccountBack_span_: {
        display: 'block',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0.5vh 0',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
        color: '#222222'
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

  _handleClick_selfCover(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/user/screen');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_NavSelf_}>
        <div
          style={this.style.Self_pages_Front_Scape}>
          <svg
            style={this.style.Self_pages_Front_Scape_circle}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
          </svg>
        </div>
        <div
          style={this.style.Com_NavSelf_AccountBack_}
          onClick={this._handleClick_selfCover}>
          <span style={this.style.Com_NavSelf_AccountBack_span_}>
            {this.props.userInfo.firstName}</span>
          <span style={this.style.Com_NavSelf_AccountBack_span_}>
            {this.props.userInfo.lastName}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NavSelf));
