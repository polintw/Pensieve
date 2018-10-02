import React from 'react';
import Shared from './Shared.jsx';

export default class CogMove extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_nav_range = this._handleClick_nav_range.bind(this);
    this.style={
      selfCom_CogMove_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogMove_nav_: {
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
      selfCom_CogMove_nav_span_: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
        cursor: 'pointer'
      },
      selfCom_CogMove_nav_span_inspired: {
        position: 'absolute',
        top: '0',
        left: '45%',
        cursor: 'pointer'
      },
      selfCom_CogMove_nav_span_broad: {
        position: 'absolute',
        top: '0',
        right: '0%',
        cursor: 'pointer'
      },
      selfCom_CogMove_main_: {
        width: '100%',
        position: 'absolute',
        top: '16vh',
        left: '0'
      }
    }
  }

  _handleClick_nav_range(event){
    event.stopPropagation();
    event.preventDefault();
    let rangeNext = event.currentTarget.getAttribute('tab');
    this.props._set_Range(rangeNext);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogMove_}>
        <nav
          style={this.style.selfCom_CogMove_nav_}>
          <span
            tab={"shared．response"}
            style={this.style.selfCom_CogMove_nav_span_}
            onClick={this._handleClick_nav_range}>
            {"shared．response"}</span>
          <span
            tab={"activities"}
            style={this.style.selfCom_CogMove_nav_span_}>
            {"activities"}<br></br>{"launched"}</span> 
          <span
            tab={"temp．workspace"}
            style={this.style.selfCom_CogMove_nav_span_}>
            {"temp．workspace"}</span>
        </nav>
        <div
          style={this.style.selfCom_CogMove_main_}>
          <Shared
            _refer_leaveSelf={this.props._refer_leaveSelf}/>
        </div>
      </div>
    )
  }
}
