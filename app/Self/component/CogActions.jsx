import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Shared from './Shared.jsx';
import TitleShared from './Titles/TitleShared.jsx';

export default class CogActions extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogActions_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogActions_title_: {
        display: 'inline-block',
        width: '97%',
        position: 'relative',
        float: 'left'
      },
      selfCom_CogActions_main_: {
        width: '100%',
        position: 'relative',
        top: '0',
        left: '0',
        float: 'left'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogActions_}>
        <div
          style={this.style.selfCom_CogActions_title_}>
          <Route path={this.props.match.path+"/shareds"} render={(props)=> <TitleShared {...props}/>}/>
        </div>
        <div
          style={this.style.selfCom_CogActions_main_}>
          <Route path={this.props.match.path+"/shareds"} render={(props)=> <Shared {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
      </div>
    )
  }
}
