import React from 'react';
import {
  Route,
  Link,
  withRouter,
  Switch
} from 'react-router-dom';
import {connect} from "react-redux";
import Cognition from './Space/Cognition.jsx';
import NavSpace from './Space/component/Navs/NavSpace/NavSpace.jsx';
import NavOptions from '../Component/NavOptions.jsx';

class FrontSpace extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_leaveSelf = this._refer_leaveSelf.bind(this);
    this.style={
      Front_Space_backPlane_top: {
        width: '100%',
        height: '4%',
        position: 'fixed',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: 'rgb(252,252,252)'
      },
      Front_Space_NavOptions: {
        width: '1.4%',
        height: '3.2%',
        position: 'fixed',
        bottom: '6.9%',
        right: '1%',
        boxSizing: 'border-box'
      },
      Front_Space_backplane: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          window.location.assign('/cosmic/users/'+identifier+'/accumulated');
        }
        break;
      case 'noun':
        window.location.assign('/cosmic/nodes/'+identifier);
        break;
      default:
        return
    }
  }

  render(){
    return(
      <div>
        <div style={this.style.Front_Space_backplane}></div>
        <Switch>
          <Route path={this.props.match.path} render={(props)=> <Cognition {...props} _refer_leaveSelf={this._refer_leaveSelf}/>}/>
        </Switch>
        <div style={this.style.Front_Space_backPlane_top}/>
        <NavSpace {...this.props}/>
        <div
          style={this.style.Front_Space_NavOptions}>
          <NavOptions {...this.props}/>
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
)(FrontSpace));
