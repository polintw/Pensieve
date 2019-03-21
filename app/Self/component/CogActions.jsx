import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import NavActions from './NavActions.jsx';
import Shared from './Shared.jsx';

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
      selfCom_CogActions_main_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogActions_Nav_: {
        width: '27%',
        height: '12vh',
        position: 'absolute',
        right: '-2%',
        top: '0',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogActions_}>
        <div
          style={this.style.selfCom_CogActions_main_}>
          <Route path={this.props.match.path+"/shareds"} render={(props)=> <Shared {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
        <div
          style={this.style.selfCom_CogActions_Nav_}>
          <NavActions
            {...this.props} />
        </div>
      </div>
    )
  }
}
