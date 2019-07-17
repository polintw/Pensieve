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
    this._render_option_Explore = this._render_option_Explore.bind(this);
    this.style={

    }

    this.abbrRoute = ['nou', 'use', 'exp']
  }

  _render_option_Explore(pathNow){
    switch (this.abbrRoute[pathNow]) {
      case 'nou':
        return (
          <div>
            <Link
              to="/cosmic/explore/nouns"
              className={'plainLinkButton'}>
              <span style={{color: '#fc766a'}}>n</span>
            </Link>
            <span style={{cursor: 'default'}}>{'．'}</span>
            <Link
              to="/cosmic/explore"
              className={'plainLinkButton'}>
              <span>explore</span>
            </Link>
          </div>
        )
        break;
      case 'use':
        return (
          <div>
            <Link
              to="/cosmic/explore/users"
              className={'plainLinkButton'}>
              <span style={{color: '#fc766a'}}>u</span>
            </Link>
            <span style={{cursor: 'default'}}>{'．'}</span>
            <Link
              to="/cosmic/explore"
              className={'plainLinkButton'}>
              <span>explore</span>
            </Link>
          </div>
        )
        break;
      case 'exp':
        return (
          <Link
            to="/cosmic/explore"
            className={'plainLinkButton'}>
            {'explore'}
          </Link>
        )
      default:
        return (
          <Link
            to="/cosmic/explore"
            className={'plainLinkButton'}
            style={{opacity: this.props.mainTitle}}>
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

    return(
      <div
        className={classnames(styles.boxExplore)}>
        {this._render_option_Explore(pathNow)}
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
