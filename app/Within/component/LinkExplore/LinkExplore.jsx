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
      onExplore: false
    };
    this._render_Category = this._render_Category.bind(this);
    this._handleLeave_linkExplore = this._handleLeave_linkExplore.bind(this);
    this._handleEnter_linkExplore = this._handleEnter_linkExplore.bind(this);
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
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
              className={classnames('plainLinkButton')}>
              <span>
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
              className={classnames('plainLinkButton')}>
              <span>
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
              width: '54%', position: 'absolute', bottom: '-18%', right: '8%',
              borderBottom: this.state.onExplore? 'solid 0.75px rgb(64, 133, 160)': 'solid 0.75px #a8a8a8',
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
