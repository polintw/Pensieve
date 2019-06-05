import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
} from 'react-router-dom';
import {connect} from "react-redux";
import ExploreNouns from './ExploreNouns.jsx';
import ExploreUsers from './ExploreUsers.jsx';

const styleMiddle = {
  comExplore: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxMain: {
    width: '936px',
    position: 'absolute',
    top: '4vh',
    left: '50%',
    transform: 'translate(-50%,0)',
    boxSizing: 'border-box'
  },
  boxNav: {

  },
  fontNav: {

  },
  spanNav: {
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    margin: '0.8rem 0.5rem',
    cursor: 'pointer'
  }
}

class Explore extends React.Component {
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
        style={styleMiddle.comExplore}>
        <div
          style={styleMiddle.boxMain}>
          <Switch>
            <Route path={this.props.match.path+"/users"} render={(props)=> <ExploreUsers {...props}/>}/>
            <Route path={this.props.match.path+"/nouns"} render={(props)=> <ExploreNouns {...props}/>}/>
          </Switch>
          <div
            style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
            <Link
              to={this.props.match.url+"/nouns"}
              className={'plainLinkButton'}>
              <span
                style={styleMiddle.spanNav}>{'node'}</span>
            </Link>
            <Link
              to={this.props.match.url+"/users"}
              className={'plainLinkButton'}>
              <span
                style={styleMiddle.spanNav}>{'user'}</span>
            </Link>
          </div>
        </div>
        <div style={{width: '100%', height: '4vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '57px', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Explore));
