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
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this.style={

    }
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
    let pathExplore = this.props.location.pathname.includes("/explore")? true: false;
    let pathMain = (this.props.location.pathname == "/") ? true : false;

    return(
      <div>
        <div
          className={classnames(styles.boxOptions, styles.fontCosmicCorner, styles.boxExplore)}>
          <Link
            to="/explore"
            className={'plainLinkButton'}>
            {"explore"}
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
          style={(pathExplore || pathMain)? {color: '#fc766a', left: '0', transform: 'translate(-50%, 0%)'}: {}}
          onClick={this._handleClick_cosmic_Self}>
          {this.props.userInfo.account}
        </div>
        <div
          className={classnames(
            styles.boxOptions,
            styles.fontCosmicCorner,
            styles.boxFocus,
            {[styles.boxFocusExplore]: pathExplore}
          )}
          style={pathMain? {display: 'none'}: {}}>
          <Link
            to="/"
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
