import React from 'react';
import Cognition from './component/Cognition.jsx';
import NavFront from './component/NavFront.jsx';
import NavCognition from './component/NavCognition.jsx';
import NavCollateral from './component/NavCollateral.jsx';
import SvgPropic from '../Component/SvgPropic.jsx';

export default class FrontCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_leaveSelf = this._refer_leaveSelf.bind(this);
    this.style={
      Front_Cognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        overflowY: "scroll"
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

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userBasic.id){
          window.location.assign('/self');
        }else{
          window.location.assign('/cosmic/user?id='+identifier);
        }
        break;
      case 'noun':
        window.location.assign('/cosmic/pick/noun?id='+identifier);
        break;
      default:
        return
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Front_Cognition_}>
        <div
          style={this.style.Front_Cognition_scroll_}>
          <Cognition
            {...this.props}
            _refer_leaveSelf={this._refer_leaveSelf}/>
        </div>
        <div
          style={this.style.Front_Cognition_backPlane_top}>
        </div>
        <div
          style={this.style.Front_Cognition_backPlane_bottom}>
        </div>
        <div
          style={this.style.Front_Cognition_UserName_}>
          <div
            style={this.style.Front_Cognition_UserName_svg_}>
            <SvgPropic/>
          </div>
          <span style={this.style.Front_Cognition_UserName_span_}>{this.props.userBasic.account}</span>
        </div>
        <div
          style={this.style.Front_Cognition_Navs_}>
          <div
            style={this.style.Front_Cognition_Navs_Collateral_}>
            <NavCollateral/>
          </div>
          <div
            style={this.style.Front_Cognition_Navs_Cognition_}>
            <NavCognition
              {...this.props}/>
          </div>
          <div
            style={this.style.Front_Cognition_Navs_Front_}>
            <NavFront
              {...this.props}/>
          </div>
        </div>
      </div>
    )
  }
}
