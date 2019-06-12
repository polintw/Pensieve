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
    fontSize: '1.45rem',
    fontWeight: '400',
    letterSpacing: '0.11rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: '#a8a8a8'
  },
  spanNav: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 3.5rem',
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
    //detect where I am now, for styling
    let pathNounsify = this.props.location.pathname.includes("/nouns")? true: false;

    return(
      <div
        className={"centerAlignChild"}
        style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
        <Link
          to="/cosmic/explore/nouns"
          className={'plainLinkButton'}>
          <span
            style={Object.assign({}, styleMiddle.spanNav, pathNounsify? {color: '#333333'}:{})}>{'node'}</span>
        </Link>
        <Link
          to="/cosmic/explore/users"
          className={'plainLinkButton'}>
          <span
            style={Object.assign({}, styleMiddle.spanNav, pathNounsify? {}:{color: '#333333'})}>{'user'}</span>
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
