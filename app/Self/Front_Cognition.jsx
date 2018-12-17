import React from 'react';
import {
  Route,
  Link,
  withRouter,
  Switch
} from 'react-router-dom';
import {connect} from "react-redux";
import CogActions from './component/CogActions.jsx';
import NavFront from './component/NavFront.jsx';

class FrontCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_leaveSelf = this._refer_leaveSelf.bind(this);
    this.style={
      Front_Cognition_: {
        width: '100%',
        height: '100%',
        position: 'static',
        top: '0%',
        left: '0%'
      },
      Front_Cognition_scroll_: {
        width: '76%',
        minHeight: '80%',
        position: 'absolute',
        top: '9%',
        left: '12%',
        boxSizing: 'border-box',
        padding: '2vh 0'
      },
      Front_Cognition_Collateral: {
        width: '76%',
        position: 'absolute',
        top: '9%',
        left: '12%',
        boxSizing: 'border-box'
      },
      Front_Cognition_backPlane_top: {
        width: '100%',
        height: '7%',
        position: 'fixed',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Front_Cognition_backPlane_bottom: {
        width: '100%',
        height: '8%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Front_Cognition_NavFront_:{
        width: '7%',
        height: '7%',
        position: 'fixed',
        bottom: '15%',
        left: '3%',
        boxSizing: 'border-box',
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/overview');
        }else{
          window.location.assign('/cosmic/people/'+identifier);
        }
        break;
      case 'noun':
        window.location.assign('/cosmic/nouns/'+identifier);
        break;
      default:
        return
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Front_Cognition_}>
        <div
          style={this.style.Front_Cognition_scroll_}>
          <Route path={this.props.match.path+"/actions"} render={(props)=> <CogActions {...props} _refer_leaveSelf={this._refer_leaveSelf}/>}/>
        </div>
        <div style={this.style.Front_Cognition_backPlane_top}/>
        <div style={this.style.Front_Cognition_backPlane_bottom}/>
        <div
          style={this.style.Front_Cognition_NavFront_}>
          <NavFront {...this.props}/>
        </div>
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
)(FrontCognition));
