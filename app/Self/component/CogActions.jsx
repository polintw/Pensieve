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
      selfCom_CogActions_nav_: {
        display: 'inline-block',
        width: '24%',
        position: 'relative',
        top: '0',
        right: '-4%',
        boxSizing: 'border-box',
        padding: '1vh 2%',
        margin: '0 0 2vh',
        float: 'right',
        fontSize: '1.4rem',
        fontWeight: '300',
        letterSpacing: '0.15rem'
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
        <div>
          <NavActions
            {...this.props}/>
        </div>
        <div
          style={this.style.selfCom_CogActions_main_}>
          <Route path={this.props.match.path+"/shareds"} render={(props)=> <Shared {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
      </div>
    )
  }
}
