import React from 'react';
import {
  Route,
  Link,
  withRouter,
  Switch
} from 'react-router-dom';
import {connect} from "react-redux";
import Cognition from './component/cognition/Cognition.jsx';
import Collaterals from './component/cognition/Collaterals.jsx';
import NavsCognition from './component/cognition/NavsCognition.jsx';
import NavOptions from '../Component/NavOptions.jsx';

class FrontCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_leaveSelf = this._refer_leaveSelf.bind(this);
    this.style={
      Front_Cognition_backPlane_top: {
        width: '100%',
        height: '4%',
        position: 'fixed',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Front_Cognition_NavOptions: {
        width: '1.4%',
        height: '4.2%',
        position: 'fixed',
        bottom: '21%',
        right: '3%',
        boxSizing: 'border-box'
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
        window.location.assign('/cosmic/nouns/'+identifier);
        break;
      default:
        return
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div>
        <Switch>
          <Route path={this.props.match.path+"/collaterals"} render={(props)=> <Collaterals {...props} _refer_leaveSelf={this._refer_leaveSelf}/>}/>
          <Route path={this.props.match.path} render={(props)=> <Cognition {...props} _refer_leaveSelf={this._refer_leaveSelf}/>}/>
        </Switch>
        <div style={this.style.Front_Cognition_backPlane_top}/>
        <div
          style={this.style.Front_Cognition_NavOptions}>
          <NavOptions {...this.props}/>
        </div>
        <NavsCognition {...this.props}/>
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
