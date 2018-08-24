import React from 'react';
import Cognition from './component/Cognition.jsx';
import NavFront from './component/NavFront.jsx';
import NavCognition from './component/NavCognition.jsx';
import NavCollateral from './component/NavCollateral.jsx';

export default class FrontCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      focus: 'storage',
      range: 'shared'
    };
    this._set_Focus = this._set_Focus.bind(this);
    this._set_Range = this._set_Range.bind(this);
    this.style={
      Front_Cognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      Front_Cognition_NavCognition_: {
        width: '30%',
        height: '10%',
        position: 'fixed',
        bottom: '8%',
        left: '50%',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Front_Cognition_NavCollateral_: {
        width: '54%',
        height: '8%',
        position: 'fixed',
        top: '2%',
        left: '24%',
        boxSizing: 'border-box'
      },
      Front_Cognition_NavFront_: {
        width: '58%',
        height: '8%',
        position: 'fixed',
        bottom: '1%',
        left: '20%',
        boxSizing: 'border-box'
      },
      Front_Cognition_scroll_: {
        width: '76%',
        height: '76%',
        position: 'absolute',
        top: '12%',
        left: '12%',
        boxSizing: 'border-box',
        padding: '2vh 0',
        overflow: "auto"
      }
    }
  }

  _set_Focus(focusTo, rangeTo){
    this.setState({focus: focusTo, range: rangeTo});
  }

  _set_Range(range){
    this.setState({range: range});
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Front_Cognition_}>
        <div
          style={this.style.Front_Cognition_scroll_}>
          <Cognition
            range={this.state.range}
            focus={this.state.focus}
            _set_Range={this._set_Range}/>
        </div>
        <div
          style={this.style.Front_Cognition_NavCollateral_}>
          <NavCollateral
            _set_Focus={this._set_Focus}/>
        </div>
        <div
          style={this.style.Front_Cognition_NavCognition_}>
          <NavCognition
            focus={this.state.focus}
            _set_Focus={this._set_Focus}/>
        </div>
        <div
          style={this.style.Front_Cognition_NavFront_}>
          <NavFront
            userBasic={this.props.userBasic}/>
        </div>
      </div>
    )
  }
}
