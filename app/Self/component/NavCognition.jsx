import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';

export default class NavCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavCognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavCognition_nav_span: {
        display: 'inline-block',
        width: '30%',
        boxSizing: 'border-Box',
        verticalAlign: 'middle',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem',
        cursor: 'pointer'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavCognition_}>
        <Link to={this.props.match.url+"/moves/shareds"}>
          <span
            style={this.style.selfCom_NavCognition_nav_span}>
            {"行動"}
          </span>
        </Link>
        <Link to={this.props.match.url+"/wall/inspireds"}>
          <span
            style={this.style.selfCom_NavCognition_nav_span}>
            {"見聞"}
          </span>
        </Link>
        <Link to={this.props.match.url+"/mutuals/dialogues"}>
          <span
            style={this.style.selfCom_NavCognition_nav_span}>
            {"來往"}
          </span>
        </Link>
      </div>
    )
  }
}
