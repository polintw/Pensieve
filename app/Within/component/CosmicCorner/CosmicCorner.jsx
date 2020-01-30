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
    this._handleEnter_CornerOpt = this._handleEnter_CornerOpt.bind(this);
    this._handleLeave_CornerOpt = this._handleLeave_CornerOpt.bind(this);
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
  }

  _handleClick_cosmic_Self(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/cognition/actions/shareds');
  }

  _handleEnter_CornerOpt(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_CornerOpt(e){
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
    let subPath = this.props.location.pathname.substring(8, 11);
    //pathNow is a INT indicate the index refer to this.abbrRoute
    //default should be -1, page Main(not in abbrRoute)
    let pathNow = this.abbrRoute.indexOf(subPath);


    return(
      <div>
        <div
          className={classnames(
            styles.boxOptions,
            styles.fontCosmicCorner,
            styles.specificNoneDis,
            {[styles.boxAround]: (this.props.location.pathname.indexOf("cosmic") !== -1)}
          )}>
          <Link
            to="/"
            method="around"
            className={'plainLinkButton'}
            onMouseEnter={this._handleEnter_CornerOpt}
            onMouseLeave={this._handleLeave_CornerOpt}>
            {
              (this.state.mouseOn=='around') &&
              <span style={{
                  width: '75%', position: 'absolute', top: '-11%', left: '-1%',
                  borderBottom: 'solid 1px rgb(64, 133, 160)'
                }}/>
              }
            <span
              style={(this.state.mouseOn=='all')? {color: '#333333'}:{}}>{"around"}</span>
          </Link>
        </div>

        <div
          method="account"
          className={
            classnames(
              styles.boxOptions,
              styles.fontCosmicCorner,
              styles.specificNoneDis,
              {[styles.boxAccount]: (pathNow==this.abbrRoute.indexOf('exp') || pathNow< 0)}
            )
          }
          style={(pathNow> 2)? {transform: 'translate(-50%, 0%)'}: {}}
          onClick={this._handleClick_cosmic_Self}
          onMouseEnter={this._handleEnter_CornerOpt}
          onMouseLeave={this._handleLeave_CornerOpt}>
          {
            (this.state.mouseOn=='account') &&
            <span style={{
                width: '75%', position: 'absolute', top: '-11%', left: '-1%',
                borderBottom: 'solid 1px #ff7a5f'
              }}/>
            }
          <span
            style={(this.state.mouseOn=='account')? {color: '#333333'}:{}}>{this.props.userInfo.account}</span>
        </div>
        <div
          className={classnames(
            styles.boxOptions,
            styles.fontCosmicCorner,
            styles.specificNoneDis,
            styles.boxFocus
          )}>
          <Link
            to="/cosmic"
            method="focus"
            className={'plainLinkButton'}
            onMouseEnter={this._handleEnter_CornerOpt}
            onMouseLeave={this._handleLeave_CornerOpt}>
            {
              (this.state.mouseOn=='focus') &&
              <span style={{
                  width: '75%', position: 'absolute', top: '-11%', left: '-1%',
                  borderBottom: 'solid 1px rgb(64, 133, 160)'
                }}/>
              }
            <span
              style={(this.state.mouseOn=='focus')? {color: '#333333'}:{}}>
              {
                (this.props.location.pathname.indexOf("cosmic") !== -1) ? "focus" : "All"}
            </span>
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
