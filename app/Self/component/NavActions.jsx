import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

export default class NavActions extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
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
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
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
    )
  }
}
