import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./stylesCosmicCorner.module.css";

class CosmicCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_option_Explore = this._render_option_Explore.bind(this);
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

  _render_option_Explore(pathNow){
    switch (this.abbrRoute[pathNow]) {
      case 'nou':
        return (
          <div
            style={{cursor: 'none'}}>
            <Link
              to="/cosmic/explore/nouns"
              className={'plainLinkButton'}>
              <span style={{color: '#fc766a', cursor: 'pointer'}}>e</span>
              <span style={{color: '#a8a8a8'}}>{'．'}</span>
            </Link>
            <Link
              to="/cosmic/explore/nouns"
              className={'plainLinkButton'}>
              <span stye={{cursor: 'pointer'}}>node</span>
            </Link>
          </div>
        )
        break;
      case 'use':
        return (
          <div
            style={{cursor: 'none'}}>
            <Link
              to="/cosmic/explore/nouns"
              className={'plainLinkButton'}>
              <span style={{color: '#fc766a', cursor: 'pointer'}}>e</span>
              <span style={{color: '#a8a8a8'}}>{'．'}</span>
            </Link>
            <Link
              to="/cosmic/explore/users"
              className={'plainLinkButton'}>
              <span stye={{cursor: 'pointer'}}>user</span>
            </Link>
          </div>
        )
        break;
      default:
        return (
          <Link
            to="/cosmic/explore/nouns"
            className={'plainLinkButton'}>
            {'explore'}
          </Link>
        )
    }


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

    let pathExplore = this.props.location.pathname.includes("/cosmic/explore")? true: false;
    let pathMain = (this.props.location.pathname == "/cosmic") ? true : false;

    return(
      <div>
        <div
          className={classnames(styles.boxOptions, styles.fontCosmicCorner, styles.boxExplore)}>
          {this._render_option_Explore(pathNow)}
        </div>
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
          style={(pathNow> 1)? {color: '#fc766a', left: '0', transform: 'translate(-50%, 0%)'}: {}}
          onClick={this._handleClick_cosmic_Self}>
          {this.props.userInfo.account}
        </div>
        <div
          className={classnames(
            styles.boxOptions,
            styles.fontCosmicCorner,
            styles.boxFocus,
            {[styles.boxFocusExplore]: (this.abbrRoute[pathNow]=='exp')}
          )}
          style={(pathNow>2) ? {display: 'none'}: {}}>
          <Link
            to="/cosmic"
            className={'plainLinkButton'}>
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
