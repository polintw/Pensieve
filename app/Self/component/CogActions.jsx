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
      selfCom_CogActions_nav_span_: {
        display: 'block',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3% 0.8rem 3%',
        cursor: 'pointer'
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
        <nav
          style={this.style.selfCom_CogActions_nav_}>
          <Link
            to={this.props.match.url+"/shareds"}
            style={{textDecoration: 'none'}}>
            <span
              style={this.style.selfCom_CogActions_nav_span_}>
              {"shared．response"}</span>
          </Link>
          <span
            style={this.style.selfCom_CogActions_nav_span_}>
            {"activities"}<br></br>{"launched"}</span>
          <span
            style={this.style.selfCom_CogActions_nav_span_}>
            {"temp．workspace"}</span>
        </nav>
        <div
          style={this.style.selfCom_CogActions_main_}>
          <Route path={this.props.match.path+"/shareds"} render={(props)=> <Shared {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
      </div>
    )
  }
}
