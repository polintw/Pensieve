import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

const commonStyle={

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
        position: 'relative',
        boxSizing: 'border-box',
        padding: '1vh 0px 0.64vh'
      },
      Com_NavSelf_AccountBack_: {
        display:'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        paddingLeft: '3%',
        borderLeft: 'solid 0.18rem #E6E6E6',
        float: 'left',
        textAlign: 'right',
        color: '#E6E6E6',
        cursor: 'pointer'
      },
      Com_NavSelf_Scape: {
        display: 'inline-block',
        width: '27%',
        height: '81%',
        position: 'relative',
        boxSizing: 'border-box',
        float: 'left',
        cursor: 'pointer'
      },
      Com_NavSelf_AccountName: {
        display: 'inline',
        position: 'relative',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        fontSize: '1.4rem',
        fontWeight: '400',
        letterSpacing: '0.16rem',
        color: '#E6E6E6',
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
          style={this.style.Com_NavSelf_Scape}
          onClick={this._handleClick_selfClose}>

        </div>
        <div
          style={this.style.Com_NavSelf_AccountBack_}
          onClick={this._handleClick_selfCover}>
          <span style={this.style.Com_NavSelf_AccountName}>{this.props.userInfo.firstName + " " + this.props.userInfo.lastName}</span>
        </div>
        <div>
          
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
