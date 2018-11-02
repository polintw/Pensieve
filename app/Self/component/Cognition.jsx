import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import CogStorage from './CogStorage.jsx';
import CogMutual from './CogMutual.jsx';
import CogMove from './CogMove.jsx';

export default class Cognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_Cognition_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Cognition_}>
        <Route path={this.props.match.path+"/wall"} render={(props)=> <CogStorage {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        <Route path={this.props.match.path+"/actions"} render={(props)=> <CogMove {...props} userBasic={this.props.userBasic} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        <Route path={this.props.match.path+"/mutuals"} render={(props)=> <CogMutual {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}
