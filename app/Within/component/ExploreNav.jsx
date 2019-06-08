import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

const styleMiddle= {
  boxNav: {

  },
  fontNav: {

  },
  spanNav: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0.8rem 0.5rem',
    cursor: 'pointer'
  }
}

class ExploreNav extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
        <Link
          to="/cosmic/explore/nouns"
          className={'plainLinkButton'}>
          <span
            style={styleMiddle.spanNav}>{'node'}</span>
        </Link>
        <Link
          to="/cosmic/explore/users"
          className={'plainLinkButton'}>
          <span
            style={styleMiddle.spanNav}>{'user'}</span>
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
)(ExploreNav);
