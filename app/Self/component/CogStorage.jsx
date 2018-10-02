import React from 'react';
import Inspired from './Inspired.jsx';

export default class CogStorage extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_CogStorage =this._render_CogStorage.bind(this);
    this._handleClick_nav_range = this._handleClick_nav_range.bind(this);
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
      selfCom_CogStorage_nav_span_shared: {
        position: 'absolute',
        top: '0',
        left: '0',
        cursor: 'pointer'
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

  _handleClick_nav_range(event){
    event.stopPropagation();
    event.preventDefault();
    let rangeNext = event.currentTarget.getAttribute('tab');
    this.props._set_Range(rangeNext);
  }

  _render_CogStorage(){
    switch (this.props.range) {
      case "broad":
        return
        break;
      case "inspired":
        return (
          <Inspired
            _refer_leaveSelf={this.props._refer_leaveSelf}/>
        )
        break;
      default:
        return
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogStorage_}>
        <nav
          style={this.style.selfCom_CogStorage_nav_}>
          <span
            tab={"inspired"}
            style={this.style.selfCom_CogStorage_nav_span_inspired}
            onClick={this._handleClick_nav_range}>
            {"inpired"}</span>
          <span
            tab={"broad"}
            style={this.style.selfCom_CogStorage_nav_span_broad}
            onClick={this._handleClick_nav_range}>
            {"Broad"}</span>
        </nav>
        <div
          style={this.style.selfCom_CogStorage_main_}>
          {this._render_CogStorage()}
        </div>
      </div>
    )
  }
}
