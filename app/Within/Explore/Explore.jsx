import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import ExpOverview from './ExpOverview.jsx';
import ExploreUsers from './ExploreUsers.jsx';
import ExpSubtitle from './ExpSubtitle/ExpSubtitle.jsx';
import ExploreNodes from './ExploreNodes/ExploreNodes.jsx';
import SvgLogo from '../../Component/Svg/SvgLogo.jsx';

const styleMiddle = {
  comExplore: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxMain: {
    width: '100%',
    position: 'absolute',
    top: '47px', //depend on the top mask
    boxSizing: 'border-box'
  },
  boxSubtitle: {
    position: 'fixed',
    top: '22px',
    right: '73%'
  },
  boxLogo: {
    display: 'inline-block',
    height: '12px',
    position: 'fixed',
    bottom: '2.3%',
    left: '71.5%',
    boxSizing: 'border-box',
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
            <Route path={this.props.match.path+"/nodes"} render={(props)=> <ExploreNodes {...props}/>}/>
            <Route exact path={this.props.match.path+"/"} render={(props)=> <ExpOverview {...props}/>}/>
          </Switch>
        </div>
        <div style={{width: '100%', height: '47px', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '79px', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
        <div
          style={styleMiddle.boxSubtitle}>
          <ExpSubtitle {...this.props}/>
        </div>
        <Route exact path={this.props.match.path+"/"} render={(props)=> (
            <div
              style={Object.assign({}, styleMiddle.boxLogo)}
              onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic('', '/cosmic')}}>
              <SvgLogo/>
            </div>
          )}/>
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
