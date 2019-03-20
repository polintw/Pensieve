import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

const commonStyle={
  spanButtonNavActions: {
    fontSize: '1.4rem',
    fontWeight: '300',
    letterSpacing: '0.1rem'
  }
}

export default class NavActions extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogActions_nav_: {
        width: '100%',
        position: 'absolute',
        bottom: '0',
        boxSizing: 'border-box',
      },
      selfCom_CogActions_nav_span_: {
        display: 'inline-block',
        width: '27%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
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
        className={'plainLinkButton'}>
        <span
          style={Object.assign({}, commonStyle.spanButtonNavActions, this.style.selfCom_CogActions_nav_span_)}>
          {"shared"}</span>
      </Link>
      <span
        style={Object.assign({}, commonStyle.spanButtonNavActions, this.style.selfCom_CogActions_nav_span_)}>
        {"launched"}</span>
      <span
        style={Object.assign({}, commonStyle.spanButtonNavActions, this.style.selfCom_CogActions_nav_span_)}>
        {"workspace"}</span>
    </nav>
    )
  }
}
