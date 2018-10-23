import React from 'react';
import cxBind from 'classnames/bind';

export default class UnitActionControl extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_UnitAction_Response = this._handleClick_UnitAction_Response.bind(this);
    this.style={
      Com_UnitActionControl_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Com_UnitActionControl_span: {
        display: 'inline-block',
        width: '43%',
        height: '100%',
        position: 'relative',
        top: '0',
        boxSizing: 'border-box',
        margin: '0 3% 0 3%',
        verticalAlign: 'middle',
        fontSize: '3.2vh',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        fontWeight: '400',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_UnitAction_Response(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_Modalmode(true);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitActionControl_}>
        <div>
          <span
            style={this.style.Com_UnitActionControl_span}
            onClick={this._handleClick_UnitAction_Response}>
            {"回應"}
          </span>
          <span
            style={this.style.Com_UnitActionControl_span}>
            {'推廣'}
          </span>
        </div>
      </div>
    )
  }
}
