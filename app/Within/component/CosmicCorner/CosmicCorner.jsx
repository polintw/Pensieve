import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./stylesCosmicCorner.module.css";
import SvgLogo from '../../../Component/Svg/SvgLogo.jsx';

class CosmicCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: ''
    };
    this._handleEnter_CornerFocus = this._handleEnter_CornerFocus.bind(this);
    this._handleLeave_CornerFocus = this._handleLeave_CornerFocus.bind(this);
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
  }

  _handleClick_cosmic_Self(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/screen');
  }

  _handleEnter_CornerFocus(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_CornerFocus(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: ''
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //detect where I am now, for styling
    let subPath = this.props.location.pathname.substring(1, 4);
    //pathNow is a INT indicate the index refer to this.abbrRoute
    //default should be -1, page Main(not in abbrRoute)
    let pathNow = this.abbrRoute.indexOf(subPath);


    return(
      <div>
        <div
          className={
            classnames(
              styles.boxOptions,
              styles.fontCosmicCorner,
              styles.specificNoneDis,
              {[styles.boxAccount]: (pathNow==this.abbrRoute.indexOf('exp') || pathNow< 0)}
            )
          }
          style={(pathNow> 2)? {transform: 'translate(-50%, 0%)'}: {}}
          onClick={this._handleClick_cosmic_Self}>
          <span>{this.props.userInfo.account}</span>
        </div>
        <div
          className={classnames(
            styles.boxOptions,
            styles.fontCosmicCorner,
            styles.specificNoneDis,
            {[styles.boxFocus]: (pathNow> -1)}
          )}>
          <Link
            to="/"
            method="focus"
            className={'plainLinkButton'}
            style={Object.assign({}, (this.state.mouseOn=='focus')? {color: '#333333'}:{})}
            onMouseEnter={this._handleEnter_CornerFocus}
            onMouseLeave={this._handleLeave_CornerFocus}>
            {"focus"}
          </Link>
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
)(CosmicCorner);
