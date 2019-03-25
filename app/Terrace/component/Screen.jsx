import React from 'react';
import {
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

class Screen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      scroll: false
    };
    this._handleMouse_terraceFrame = this._handleMouse_terraceFrame.bind(this);
    this._handleClick_nav_expand = this._handleClick_nav_expand.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      terraceCom_Screen_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
      },
      terraceCom_Screen_plane_: {
        width: '100%',
        height: '58%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        boxShadow: 'inset 0px -0.24rem 0.3rem -0.28rem',
        backgroundColor: '#FAFAFA'
      },
      terraceCom_Screen_account_: {
        maxWidth: '40%',
        position: 'absolute',
        top: '27%',
        left: '22%',
        boxSizing: 'border-box'
      },
      terraceCom_Screen_account_name: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        float: 'right',
        fontSize: "3.2rem",
        letterSpacing: '0.35rem',
        fontWeight: '400',
        color: '#222222'
      },
      terraceCom_Screen_options_: {
        position: 'absolute',
        top: '30%',
        right: '34%',
        boxSizing: 'border-box'
      },
      terraceCom_Screen_options_expand: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        fontWeight: '300',
        fontSize: "2.4rem",
        letterSpacing: '0.15rem',
        color: '#ff7a5f',
        cursor: 'pointer'
      },
      terraceCom_Screen_return_: {
        width: '9%',
        height: '9%',
        minHeight: '56px',
        position: 'absolute',
        bottom: '10%',
        left: '20%',
        boxSizing: 'border-box'
      },
      terraceCom_Screen_return_svg: {
        width: '50%',
        maxHeight: '100%',
        cursor: 'pointer'
      },
    }
  }

  _handleClick_nav_expand(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/cognition/embedded/inspireds');
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleMouse_terraceFrame(event){
    if(event.deltaY > 0){
      this.setState((prevState, props)=>{
        return {scroll: true}
      })
    };
  }

  render(){
    //let cx = cxBind.bind(styles);

    return(
      this.state.scroll?(
        <Redirect to="?watch=appearance"/>
      ):(
        <div
          ref={(element)=>{this.terrace_pagenav=element;}}
          style={this.style.terraceCom_Screen_}
          onWheel={this._handleMouse_terraceFrame}>
          <div
            style={this.style.terraceCom_Screen_plane_}>
            <div style={this.style.terraceCom_Screen_account_}>
              <span style={this.style.terraceCom_Screen_account_name}>{this.props.userInfo.firstName}</span>
              <span style={this.style.terraceCom_Screen_account_name}>{this.props.userInfo.lastName}</span>
            </div>
            <div
              style={this.style.terraceCom_Screen_options_}>
              <div
                style={this.style.terraceCom_Screen_options_expand}
                onClick={this._handleClick_nav_expand}>
                {'expand'}
              </div>
            </div>
          </div>
          <div>
            <div
              style={this.style.terraceCom_Screen_return_}
              onClick={this._handleClick_selfClose}>
              <svg
                style={this.style.terraceCom_Screen_return_svg}>
                <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
                <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent"/>
              </svg>
            </div>
          </div>
        </div>
      )
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
)(Screen);
