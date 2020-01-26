import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import CogActions from './CogActions.jsx';
import NavFront from '../component/NavFront/NavFront.jsx';

class Cognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Cognition_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
      },
      Cognition_scroll_: {
        width: '65vw',
        position: 'absolute',
        top: '8.8vh',
        left: '20vw',
        boxSizing: 'border-box'
      },
      Cognition_NavFront_: {
        width: '3.2%',
        position: 'fixed',
        bottom: '16%',
        left: '5%',
        boxSizing: 'border-box',
        transform: 'translate(-50%,0)'
      },
      Cognition_backPlane_bottom: {
        width: '100%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'rgb(252,252,252)'
      },
      Cognition_backPlane_Nav: {
        width: '100%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        backgroundColor: 'rgb(246, 246, 246)'
      }
    }
  }

  render(){
    return(
      <div
        style={this.style.Cognition_}>
        <div
          style={this.style.Cognition_scroll_}>
          <Route path={this.props.match.path+"/actions"} render={(props)=> <CogActions {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
        <div
          style={this.style.Cognition_NavFront_}>
          <NavFront {...this.props}/>
        </div>
        <div className={'selfFront-fixedBottomOverlay-height'} style={this.style.Cognition_backPlane_bottom}/>
        <div
          className={'selfFront-fixedBottomBox-height'}
          style={this.style.Cognition_backPlane_Nav}/>
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
)(Cognition));
