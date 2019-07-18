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
    this.style={

    }

    this.abbrRoute = ['nod', 'use', 'exp']
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
        className={classnames(styles.boxExplore)}>
        <Link
          to="/cosmic/explore"
          className={'plainLinkButton'}>
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
