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
    this._render_SwitchBox_category = this._render_SwitchBox_category.bind(this);
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
  }

  _handleClick_cosmic_Self(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/screen');
  }

  _render_SwitchBox_category(pathNow){
    switch (this.abbrRoute[pathNow]) {
      case 'nod':
        return (
          <div
            className={classnames(styles.boxCategory, styles.fontCategory)}>
            <Link
              to="/cosmic/explore/nodes"
              className={classnames('plainLinkButton')}>
              <span>
                {'Nodes '}
              </span>
            </Link>
            <span style={{cursor: 'default'}}>{'．'}</span>
          </div>
        )
        break;
      case 'use':
        return (
          <div
            className={classnames(styles.boxCategory, styles.fontCategory)}>
            <Link
              to="/cosmic/explore/users"
              className={classnames('plainLinkButton')}>
              <span>
                {'Users '}
              </span>
            </Link>
            <span style={{cursor: 'default'}}>{'．'}</span>
          </div>
        )
        break;
      default:
        return null
    }
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
          className={classnames(styles.fontCosmicCorner)}
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
            {[styles.boxFocus]: (pathNow==this.abbrRoute.indexOf('exp'))}
          )}>
          <Link
            to="/cosmic"
            className={'plainLinkButton'}>
            {"focus"}
          </Link>
        </div>
        <div
          className={classnames(
            styles.specificNoneDis,
            {[styles.boxSwitch]: (pathNow> -1 && pathNow!==this.abbrRoute.indexOf('exp'))}
          )}>
          {this._render_SwitchBox_category(pathNow)}
          <Link
            to="/cosmic"
            className={classnames(
              'plainLinkButton',
              styles.boxOptions,
              styles.boxLogo
            )}>
            <SvgLogo/>
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
