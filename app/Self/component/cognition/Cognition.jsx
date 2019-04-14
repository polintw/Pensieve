import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import CogEmbed from './CogEmbed.jsx';
import CogActions from './CogActions.jsx';
import NavFrontShelf from '../NavFront/NavFrontShelf.jsx';

class Cognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Cognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      Cognition_scroll_: {
        width: '72%',
        minHeight: '80%',
        position: 'absolute',
        top: '4.5%',
        left: '16%',
        boxSizing: 'border-box'
      },
      Cognition_NavFrontShelf_: {
        width: '3.6%',
        position: 'fixed',
        top: '30%',
        left: '4%',
        boxSizing: 'border-box',
      },
      Cognition_backPlane_bottom: {
        width: '100%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Cognition_backPlane_Nav: {
        width: '100%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        backgroundColor: '#d1d1d1'
      }
    }
  }

  render(){
    return(
      <div
        style={this.style.Cognition_}>
        <div
          style={this.style.Cognition_scroll_}>
          <Route path={this.props.match.path+"/embedded"} render={(props)=> <CogEmbed {...props} _refer_leaveSelf={this._refer_leaveSelf}/>}/>
          <Route path={this.props.match.path+"/actions"} render={(props)=> <CogActions {...props} _refer_leaveSelf={this._refer_leaveSelf}/>}/>
        </div>
        <div
          style={this.style.Cognition_NavFrontShelf_}>
          <NavFrontShelf {...this.props}/>
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
