import React from 'react';
import {connect} from "react-redux";

class SelfCover extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userInfo: this.props.userInfo,
      origin: '',
      scroll: false
    };
    this._handleClick_nav_expand = this._handleClick_nav_expand.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      Self_pages_SelfCover_: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        overflowY: 'scroll'
      },
      Self_pages_SelfCover_mainNav_: {
        width: '100%',
        height: '45vh',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_mainNav_userName: {
        display: 'inline-block',
        width: '27%',
        position: 'absolute',
        top: '0%',
        left: '20%',
        fontSize: "5.6vh",
        letterSpacing: '0.6vh',
        fontWeight: '300',
        color: '#222222'
      },
      Self_pages_SelfCover_mainNav_options_: {
        display: 'inline-block',
        width: '27%',
        height: '20vh',
        position: 'absolute',
        bottom: '0%',
        right: '20%',
        boxSizing: 'border-box'
      },
      Self_pages_SelfCover_mainNav_options_expand: {
        display: 'inline-block',
        width: '100%',
        height: '40%',
        position: 'relative',
        top: '0%',
        left: '0%',
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
        position: 'fixed',
        bottom:'0%',
        left: '6%',
        boxSizing: 'border-box',
        fontSize: '3.2vh',
        letterSpacing: '0.4vh',
        color: '#222222'
      }
    }
  }

  _handleClick_nav_expand(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/cognition/actions/shareds');
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);

    return(
      <div
        ref={(element)=>{this.selfCover_=element;}}
        style={this.style.Self_pages_SelfCover_}>
        <div style={this.style.Self_pages_SelfCover_Logo}>{'CORNER'}</div>
        <div
          ref={(element)=>{this.selfCover_pagenav=element;}}
          style={this.style.Self_pages_SelfCover_mainNav_}>
          <div style={this.style.Self_pages_SelfCover_mainNav_userName}>{this.state.userInfo.account}</div>
          <div
            style={this.style.Self_pages_SelfCover_mainNav_options_}>
            <div
              style={this.style.Self_pages_SelfCover_mainNav_options_expand}
              onClick={this._handleClick_nav_expand}>
              {'Expand'}
            </div>
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
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(SelfCover);
