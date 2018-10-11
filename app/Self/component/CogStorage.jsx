import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Inspired from './Inspired.jsx';

export default class CogStorage extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogStorage_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogStorage_nav_: {
        width: '64%',
        height: '12vh',
        position: 'absolute',
        top: '0',
        right: '10%',
        fontSize: '1.3rem',
        fontWeight: '300',
        letterSpacing: '0.1rem'
      },
      selfCom_CogStorage_nav_span_inspired: {
        position: 'absolute',
        top: '0',
        left: '45%',
        cursor: 'pointer'
      },
      selfCom_CogStorage_nav_span_broad: {
        position: 'absolute',
        top: '0',
        right: '0%',
        cursor: 'pointer'
      },
      selfCom_CogStorage_main_: {
        width: '100%',
        position: 'absolute',
        top: '12vh',
        left: '0'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogStorage_}>
        <nav
          style={this.style.selfCom_CogStorage_nav_}>
          <Link to={this.props.match.url+"/inspireds"}>
            <span
              style={this.style.selfCom_CogStorage_nav_span_inspired}>
              {"inpired"}</span>
          </Link>
          <Link to={this.props.match.url+"/inspireds"}>
            <span
              style={this.style.selfCom_CogStorage_nav_span_broad}>
              {"Broad"}</span>
          </Link>
        </nav>
        <div
          style={this.style.selfCom_CogStorage_main_}>
          <Route path={this.props.match.path+"/inspireds"} render={(props)=> <Inspired {...props} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </div>
      </div>
    )
  }
}
