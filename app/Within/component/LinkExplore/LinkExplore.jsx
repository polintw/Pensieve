import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class LinkExplore extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onExplore: false,
      onCategory: false
    };
    this._render_Category = this._render_Category.bind(this);
    this._handleLeave_linkExplore = this._handleLeave_linkExplore.bind(this);
    this._handleEnter_linkExplore = this._handleEnter_linkExplore.bind(this);
    this._handleEnter_linkCategory = this._handleEnter_linkCategory.bind(this);
    this._handleLeave_linkCategory = this._handleLeave_linkCategory.bind(this);
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
  }

  _handleEnter_linkCategory(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onCategory: true
    })
  }

  _handleLeave_linkCategory(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onCategory: false
    })
  }

  _handleEnter_linkExplore(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onExplore: true
    })
  }

  _handleLeave_linkExplore(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onExplore: false
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //reset to default if the path change
    if(this.props.location.pathname.substring(8, 11) != prevProps.location.pathname.substring(8, 11)){
      this.setState({
        onExplore: false,
        onCategory: false
      })
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_Category(pathNow){
    switch (this.abbrRoute[pathNow]) {
      case 'nod':
        return (
          <div
            className={classnames(styles.boxCategory, styles.fontCategory)}>
            <Link
              to="/cosmic/explore/nodes"
              className={classnames('plainLinkButton')}
              onMouseEnter={this._handleEnter_linkCategory}
              onMouseLeave={this._handleLeave_linkCategory}>
              <span
                style={this.state.onCategory? {color: 'rgb(64, 133, 160)'}:{}}>
                {'nodes '}
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
              className={classnames('plainLinkButton')}
              onMouseEnter={this._handleEnter_linkCategory}
              onMouseLeave={this._handleLeave_linkCategory}>
              <span
                style={this.state.onCategory? {color: 'rgb(64, 133, 160)'}:{}}>
                {'users '}
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

  render(){
    //detect where I am now, for styling
    let subPath = this.props.location.pathname.substring(8, 11);
    //pathNow is a INT indicate the index refer to this.abbrRoute
    //default should be -1, page Main(not in abbrRoute)
    let pathNow = this.abbrRoute.indexOf(subPath);

    return(
      <div
        className={classnames(styles.comExplore)}>
        {this._render_Category(pathNow)}
        <Link
          to="/cosmic/explore"
          className={classnames('plainLinkButton', styles.boxExplore)}
          onMouseEnter={this._handleEnter_linkExplore}
          onMouseLeave={this._handleLeave_linkExplore}>
          <span>
            {'explore'}</span>
          <span style={{
              width: '60%', marginTop: '10%',
              borderBottom: this.state.onExplore? 'solid 1px #ff7a5f': 'solid 1px rgb(64, 133, 160)',
              opacity: (pathNow< 0)? 1 : 0
            }}/>
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
)(LinkExplore);
