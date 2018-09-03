import React from 'react';
import Cognition from './component/Cognition.jsx';
import NavFront from './component/NavFront.jsx';
import NavCognition from './component/NavCognition.jsx';
import NavCollateral from './component/NavCollateral.jsx';

export default class FrontCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      focus: 'move',
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
      Front_Cognition_scroll_: {
        width: '76%',
        minHeight: '100%',
        position: 'absolute',
        top: '9%',
        left: '12%',
        boxSizing: 'border-box',
        padding: '2vh 0'
      },
      Front_Cognition_backPlane_top: {
        width: '100%',
        height: '7%',
        position: 'fixed',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Front_Cognition_backPlane_bottom: {
        width: '100%',
        height: '10%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Front_Cognition_Navs_:{
        width: '78%',
        height: '9%',
        position: 'fixed',
        bottom: '0',
        left: '15%',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF'
      },
      Front_Cognition_Navs_Cognition_: {
        width: '40%',
        height: '100%',
        position: 'absolute',
        bottom: '0%',
        right: '2%',
        boxSizing: 'border-box'
      },
      Front_Cognition_Navs_Collateral_: {
        width: '12%',
        height: '100%',
        position: 'absolute',
        bottom: '0%',
        left: '2%',
        boxSizing: 'border-box'
      },
      Front_Cognition_Navs_Front_: {
        width: '12%',
        height: '48%',
        position: 'absolute',
        top: '0%',
        left: '18%',
        boxSizing: 'border-box'
      },
      Front_Cognition_UserName_: {
        width: '24%',
        height: '7%',
        position: 'fixed',
        top: '0',
        left: '13%',
        boxSizing: 'border-box'
      },
      Front_Cognition_UserName_svg_: {
        display: 'inline-block',
        width: '10%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
        padding: '1rem 0 0 0'
      },
      Front_Cognition_UserName_span_: {
        display: 'inline-block',
        position: 'absolute',
        bottom: '18%',
        left: '0',
        boxSizing: 'border-box',
        padding: '1% 0',
        fontSize: '1.6rem',
        letterSpacing: '0.12rem',
        color: '#222222'
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
          style={this.style.Front_Cognition_backPlane_top}>
        </div>
        <div
          style={this.style.Front_Cognition_backPlane_bottom}>
        </div>
        <div
          style={this.style.Front_Cognition_UserName_}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182 182"
            style={this.style.Front_Cognition_UserName_svg_}>
            <defs><style>{".cls-1{fill:none;stroke:#000;stroke-miterlimit:10;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2">
              <g id="圖層_1-2" data-name="圖層 1">
                <path d="M91,2A89,89,0,1,1,2,91,89.11,89.11,0,0,1,91,2m0-2a91,91,0,1,0,91,91A91,91,0,0,0,91,0Z"/>
                <path className="cls-1" d="M113.14,109.53c15.47,5.49,40,14.62,47.36,20l2,6a58.09,58.09,0,0,1,1,10"/>
                <path className="cls-1" d="M16.5,142.5s0-8,2-12c.08-.16,1.89-3.86,2-4,2.05-2.73,30.84-11.74,49-17.19"/>
                <path d="M91.5,25A44.51,44.51,0,1,1,47,69.5,44.55,44.55,0,0,1,91.5,25m0-1A45.5,45.5,0,1,0,137,69.5,45.5,45.5,0,0,0,91.5,24Z"/>
              </g>
            </g>
          </svg>
          <span style={this.style.Front_Cognition_UserName_span_}>{this.props.userBasic.account}</span>
        </div>
        <div
          style={this.style.Front_Cognition_Navs_}>
          <div
            style={this.style.Front_Cognition_Navs_Collateral_}>
            <NavCollateral
              _set_Focus={this._set_Focus}/>
          </div>
          <div
            style={this.style.Front_Cognition_Navs_Cognition_}>
            <NavCognition
              focus={this.state.focus}
              _set_Focus={this._set_Focus}/>
          </div>
          <div
            style={this.style.Front_Cognition_Navs_Front_}>
            <NavFront
              userBasic={this.props.userBasic}/>
          </div>
        </div>
      </div>
    )
  }
}
