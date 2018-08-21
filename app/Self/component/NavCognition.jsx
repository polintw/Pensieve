import React from 'react';
import cxBind from 'classnames/bind';

export default class NavCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_NavFocusRange = this._render_NavFocusRange.bind(this);
    this._handleClick_nav_focus = this._handleClick_nav_focus.bind(this);
    this.style={
      selfCom_NavCognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavCognition_nav_: {
        width: '30%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '25%'
      },
      selfCom_NavCognition_nav_span: {
        display: 'inline-block',
        width: '30%',
        boxSizing: 'border-Box',
        verticalAlign: 'middle',
        fontSize: '1.6rem',
        fontWeight: '700',
        letterSpacing: '0.2rem',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_nav_focus(event){
    event.stopPropagation();
    event.preventDefault();
    let focusNext = event.currentTarget.getAttribute('tab');
    if(focusNext=='storage'){
      this.props._set_Focus('storage', 'shared');
    }else{
      this.props._set_Focus(focusNext, null);
    }
  }

  _render_NavFocusRange(){
    switch (this.props.focus) {
      case "storage":
        return(
          <nav>
            <span>{"inpired"}</span>
            <span>{"shared"}</span>
            <span>{"Broad"}</span>
          </nav>
        )
        break;
      case "mutual":
        return(
          <nav>
            <span>{"Dialogue"}</span>
          </nav>
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
        style={this.style.selfCom_NavCognition_}>
        <nav
          style={this.style.selfCom_NavCognition_nav_}>
          <span
            tab={"storage"}
            style={this.style.selfCom_NavCognition_nav_span}
            onClick={this._handleClick_nav_focus}>
            {"收納"}
          </span>
          <span
            tab={"today"}
            style={this.style.selfCom_NavCognition_nav_span}
            onClick={this._handleClick_nav_focus}>
            {"Today"}
          </span>
          <span
            tab={"mutual"}
            style={this.style.selfCom_NavCognition_nav_span}
            onClick={this._handleClick_nav_focus}>
            {"往來"}
          </span>
        </nav>
        {
          this._render_NavFocusRange()
        }
      </div>
    )
  }
}
