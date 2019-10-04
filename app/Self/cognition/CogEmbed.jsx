import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Inspired from './component/Inspired/Inspired.jsx';
import Broads from './component/Broads.jsx';
import NavEmbed from './Navs/NavEmbed.jsx';

export default class CogEmbed extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogEmbed_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogEmbed_Nav_: {
        width: '25vw',
        position: 'absolute',
        right: '0',
        top: '24px',
        boxSizing: 'border-box',
        borderBottom: 'solid 1px #a8a8a8'
      },
      selfCom_CogEmbed_main_: {
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
        style={this.style.selfCom_CogEmbed_}>
        <div
          style={this.style.selfCom_CogEmbed_main_}>
          <Route path={this.props.match.path+"/inspireds"} render={(props)=> <Inspired {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
          <Route path={this.props.match.path+"/broads"} render={(props)=> <Broads {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
        <div
          style={this.style.selfCom_CogEmbed_Nav_}>
          <NavEmbed
            {...this.props}/>
        </div>
      </div>
    )
  }
}
