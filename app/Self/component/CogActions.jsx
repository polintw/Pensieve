import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
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
        width: '64%',
        height: '16vh',
        position: 'absolute',
        top: '0',
        right: '10%',
        boxSizing: 'border-box',
        padding: '1vh 2%',
        fontSize: '1.3rem',
        fontWeight: '300',
        letterSpacing: '0.1rem'
      },
      selfCom_CogActions_nav_span_: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
        cursor: 'pointer'
      },
      selfCom_CogActions_nav_span_inspired: {
        position: 'absolute',
        top: '0',
        left: '45%',
        cursor: 'pointer'
      },
      selfCom_CogActions_nav_span_broad: {
        position: 'absolute',
        top: '0',
        right: '0%',
        cursor: 'pointer'
      },
      selfCom_CogActions_main_: {
        width: '100%',
        position: 'absolute',
        top: '16vh',
        left: '0'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogActions_}>
        <nav
          style={this.style.selfCom_CogActions_nav_}>
          <Link to={this.props.match.url+"/shareds"}>
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
