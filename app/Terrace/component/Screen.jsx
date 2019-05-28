import React from 'react';
import {
  Route,
  Link,
} from 'react-router-dom';
import {connect} from "react-redux";
import SvgAround from '../../Component/Svg/SvgAround.jsx';

const styleMiddle = {
  boxOption: {
    position: 'absolute',
    right: '26%',
    boxSizing: 'border-box'
  },
  fontOption: {
    fontWeight: '400',
    fontSize: "2rem",
    letterSpacing: '0.14rem',
    color: '#ff7a5f',
  }
}

class Screen extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_nav_expand = this._handleClick_nav_expand.bind(this);
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      terraceCom_Screen_plane_: {
        width: '100%',
        height: '40%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        overflow: 'visible'
      },
      terraceCom_Screen_floor_: {
        width: '100%',
        height: '59%',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA',
      },
      terraceCom_Screen_account_: {
        maxWidth: '38%',
        position: 'absolute',
        top: '34.8%',
        left: '32%',
        transform: 'translate(-50%,0%)',
        boxSizing: 'border-box',
        overflow: 'visible'
      },
      terraceCom_Screen_account_name: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: "4.8rem",
        letterSpacing: '0.28rem',
        fontWeight: '400',
        whiteSpace: 'nowrap',
        color: '#000000'
      },
      terraceCom_Screen_options_: {
        bottom: '6%',
      },
      terraceCom_Screen_floorOptions_: {
        top: '7%'
      },
      terraceCom_Screen_options_expand: {
        display: 'inline',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      terraceCom_Screen_return_: {
        width: '6%',
        height: '10%',
        position: 'absolute',
        top: '60%',
        left: '37%',
        boxSizing: 'border-box',
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

  render(){
    return(
      <div
        className={'boxAbsoluteFull'}
        ref={(element)=>{this.terrace_pagenav=element;}}>
        <div
          style={this.style.terraceCom_Screen_plane_}>
          <div
            style={Object.assign({}, this.style.terraceCom_Screen_options_, styleMiddle.boxOption)}>
            <div
              style={Object.assign({}, this.style.terraceCom_Screen_options_expand, styleMiddle.fontOption)}
              onClick={this._handleClick_nav_expand}>
              {'expand'}
            </div>
          </div>
        </div>
        <div
          style={this.style.terraceCom_Screen_floor_}>
          <div
            style={Object.assign({}, this.style.terraceCom_Screen_floorOptions_, styleMiddle.boxOption, {right: '25.6%'})}>
            <Link
              to={{
                pathname: "/screen",
                search: "?watch=window",
                hash: "",
                state: {}
              }}
              className={'plainLinkButton'}>
              <span style={Object.assign({}, styleMiddle.fontOption, {color: 'black', cursor: 'pointer'})}>
                {"window"}
              </span>
            </Link>
          </div>
          <div
            style={this.style.terraceCom_Screen_return_}
            onClick={this._handleClick_selfClose}>
            <SvgAround/>
          </div>
        </div>
        <div style={this.style.terraceCom_Screen_account_}>
          <span style={this.style.terraceCom_Screen_account_name}>{this.props.userInfo.firstName+" "+this.props.userInfo.lastName}</span>
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
)(Screen);
