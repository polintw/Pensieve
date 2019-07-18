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

    };
    this._render_Category = this._render_Category.bind(this);
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
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
      <div
        className={classnames(styles.comExplore)}>
        {this._render_Category(pathNow)}
        <Link
          to="/cosmic/explore"
          className={classnames('plainLinkButton', styles.boxExplore)}
          style={(pathNow< 0)?{opacity: this.props.mainTitle}:{}}>
          {'explore'}
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    mainTitle: state.mainTitle
  }
}

export default connect(
  mapStateToProps,
  null
)(LinkExplore);
