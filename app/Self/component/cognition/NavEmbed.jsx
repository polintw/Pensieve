import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

const commonStyle={
  spanButtonNavEmbed: {
    fontSize: '1.4rem',
    fontWeight: '300',
    letterSpacing: '0.1rem'
  }
}

export default class NavEmbed extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogEmbed_nav_: {
        width: '100%',
        position: 'absolute',
        bottom: '0',
        boxSizing: 'border-box',
      },
      selfCom_CogEmbed_nav_span_: {
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
      style={this.style.selfCom_CogEmbed_nav_}>
      <Link
        to={this.props.match.url+"/inspireds"}
        className={'plainLinkButton'}>
        <span
          style={Object.assign({}, commonStyle.spanButtonNavEmbed, this.style.selfCom_CogEmbed_nav_span_)}>
          {"inpired"}</span>
      </Link>
      <Link
        to={this.props.match.url+"/broads"}
        className={'plainLinkButton'}>
        <span
          style={Object.assign({}, commonStyle.spanButtonNavEmbed, this.style.selfCom_CogEmbed_nav_span_)}>
          {"Broad"}</span>
      </Link>
      <span
        style={Object.assign({}, commonStyle.spanButtonNavEmbed, this.style.selfCom_CogEmbed_nav_span_)}>
        {"dialogues"}</span>
    </nav>
    )
  }
}
