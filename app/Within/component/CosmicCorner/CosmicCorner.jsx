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

    };
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this.style={

    }

    this.abbrRoute = ['nou', 'use', 'exp']
  }

  _handleClick_cosmic_Self(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/screen');
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //detect where I am now, for styling
    let subPath = this.props.location.pathname.substring(8, 11),
        pathNow = this.abbrRoute.length;
        //pathNow is a INT indicate the index refer to this.abbrRoute, default at page Main(not in abbrRoute)
    for(let i=0; i < this.abbrRoute.length; i++){
      if(subPath == this.abbrRoute[i]) pathNow = i;
    }

    return(
      <div>
        <div
          className={classnames(styles.boxOptions, styles.fontCosmicCorner)}
          style={{display: 'none'}}>
          <Link
            to="/"
            className={'plainLinkButton'}>
            {"around"}
          </Link>
        </div>
        <div
          className={
            classnames(
              styles.boxOptions,
              styles.fontCosmicCorner,
              styles.boxAccount
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
            {[styles.boxFocus]: (this.abbrRoute[pathNow]=='exp')}
          )}>
          <Link
            to="/cosmic"
            className={'plainLinkButton'}>
            {"focus"}
          </Link>
        </div>
        <Link
          className={classnames(
            'plainLinkButton',
            styles.boxOptions,
            styles.specificNoneDis,
            {[styles.boxLogo]: (this.abbrRoute[pathNow]!=='exp')}
          )}
          to="/cosmic">
          <SvgLogo/>
        </Link>
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
