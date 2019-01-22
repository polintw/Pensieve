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
        backgroundColor: 'rgb(211, 222, 218)'
      },
      terraceCom_Screen_plane_: {
        width: '74%',
        height: '58%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA'
      },
      terraceCom_Screen_account_: {
        maxWidth: '40%',
        position: 'absolute',
        top: '27%',
        left: '22%',
        transform: 'translate(-50%,0)',
        fontSize: "3.5rem",
        letterSpacing: '0.5rem',
        fontWeight: '400',
        color: '#222222'
      },
      terraceCom_Screen_account_name: {
        display: 'block',
        position: 'relative',
        boxSizing: 'border-box',
        marginBottom: '1.5rem'
      },
      terraceCom_Screen_options_: {
        height: '70%',
        position: 'absolute',
        top: '38%',
        right: '34%',
        boxSizing: 'border-box'
      },
      terraceCom_Screen_options_expand: {
        display: 'inline-block',
        position: 'absolute',
        top: '0%',
        right: '5%',
        boxSizing: 'border-box',
        fontWeight: '300',
        fontSize: "2.4rem",
        letterSpacing: '0.1rem',
        color: 'rgb(56, 56, 56, 0.8)',
        cursor: 'pointer'
      },
      terraceCom_Screen_options_information_: {
        width: '5.6rem',
        height: '29%',
        position: 'absolute',
        top: '36%',
        right: '5%',
        boxSizing: 'border-box'
      },
      terraceCom_Screen_options_information_svg: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
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
      },
      terraceCom_Screen_return_logo: {
        position: 'absolute',
        bottom:'50%',
        right: '0%',
        transform: 'translate(0,50%)',
        boxSizing: 'border-box',
        fontSize: '1rem',
        letterSpacing: '0.15rem',
        color: '#222222'
      }
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
                {'Expand'}
              </div>
              <div
                style={this.style.terraceCom_Screen_options_information_}>
                <svg
                  style={this.style.terraceCom_Screen_options_information_svg}>
                  <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" switch "}</text>
                  <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}}/>
                </svg>
              </div>
              <div
                style={this.style.terraceCom_Screen_options_information_}>
                <svg
                  style={this.style.terraceCom_Screen_options_information_svg}>
                  <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" growth "}</text>
                  <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}}/>
                </svg>
              </div>
            </div>
          </div>
          <div
            style={this.style.terraceCom_Screen_return_}
            onClick={this._handleClick_selfClose}>
            <div style={this.style.terraceCom_Screen_return_logo}>
              {'CORNER'}
            </div>
            <svg
              style={this.style.terraceCom_Screen_return_svg}>
              <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
              <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}}/>
            </svg>
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
