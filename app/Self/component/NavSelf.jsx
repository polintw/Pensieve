import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

const commonStyle={
  spanAccountName: {
    display: 'inline',
    position: 'relative',
    boxSizing: 'border-box',
    marginRight: '12%',
    fontSize: '1.4rem',
    fontWeight: '400',
    letterSpacing: '0.16rem',
    color: '#222222',
  },
  svgRangeFlex: {
    maxWidth: '100%',
    maxHeight: '100%',
    boxSizing: 'border-box'
  }
}

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
        boxSizing: 'border-box',
        padding: '1vh 0px 1.4vh'
      },
      Com_NavSelf_AccountBack_: {
        display:'inline-block',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        paddingLeft: '3%',
        float: 'right',
        textAlign: 'right',
        cursor: 'pointer'
      },
      Com_NavSelf_Scape: {
        display: 'inline-block',
        width: '16%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        float: 'right'
      },
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
          style={this.style.Com_NavSelf_AccountBack_}
          onClick={this._handleClick_selfCover}>
          <span style={commonStyle.spanAccountName}>
            {this.props.userInfo.firstName}</span>
          <span style={commonStyle.spanAccountName}>
            {this.props.userInfo.lastName}</span>
        </div>
        <div
          style={this.style.Com_NavSelf_Scape}>
          <svg
            className={"centerAlignChild"}
            style={commonStyle.svgRangeFlex}>
            <circle r="1.4vh" cx="50%" cy="50%" stroke='#88B5A5' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
          </svg>
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
