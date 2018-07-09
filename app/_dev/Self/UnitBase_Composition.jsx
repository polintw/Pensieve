import React from 'react';
import CompositionCabinet from './component/CompositionCabinet.jsx';

export default class SelfComposition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      UnitBase_Composition_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      UnitBase_Composition_side_: {
        width: '16%',
        height: '100vh',
        position: 'fixed',
        top: '0',
        right: '8%'
      },
      UnitBase_Composition_side_top_: {
        width: '32%',
        height: '24%',
        position: 'absolute',
        top: '0',
        right: '0'
      },
      UnitBase_Composition_side_top_div_: {
        width: '100%',
        height: '33%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      UnitBase_Composition_side_top_div_svg: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      UnitBase_Composition_side_logo_: {
        width: '100%',
        height: '10%',
        position: 'absolute',
        top:'90%',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '5vh',
        letterSpacing: '0.6vh',
        color: '#222222'
      },
      UnitBase_Composition_lid_: {
        width: '64%',
        height: '8vh',
        position: 'fixed',
        top: '0',
        left: '16%',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      },
      UnitBase_Composition_lid_span_User: {
        width: '30%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1% 0',
        fontSize: '3.6vh',
        color: '#222222'
      },
      UnitBase_Composition_lid_span_Option: {
        display: 'inline-block',
        width: '8%',
        position: 'relative',
        top: '45%',
        transform: 'translate(0,-50%)',
        float: 'right',
        boxSizing: 'border-box',
        fontSize: '2.6vh',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        color: 'rgb(153, 153, 153)',
        cursor: 'pointer'
      },
      UnitBase_Composition_scroll_: {
        width: '56%',
        position: 'absolute',
        top: '12vh',
        left: '16%'
      }
    }
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.UnitBase_Composition_}>
        <div
          style={this.style.UnitBase_Composition_scroll_}>
          <CompositionCabinet/>
        </div>
        <div
          style={this.style.UnitBase_Composition_side_}>
          <div
            style={this.style.UnitBase_Composition_side_top_}>
            <div
              style={this.style.UnitBase_Composition_side_top_div_}>
              <svg
                style={this.style.UnitBase_Composition_side_top_div_svg}>
                <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
                <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
              </svg>
            </div>
            <div
              style={this.style.UnitBase_Composition_side_top_div_}>
              <svg
                style={this.style.UnitBase_Composition_side_top_div_svg}>
                <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="0.8px" fontSize='3vh'>{"搜"}</text>
                <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{curcor: 'pointer'}}/>
              </svg>
            </div>
            <div
              style={this.style.UnitBase_Composition_side_top_div_}>
              <svg
                style={this.style.UnitBase_Composition_side_top_div_svg}>
                <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="0.8px" fontSize='3vh'>{"螺"}</text>
                <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{curcor: 'pointer'}}/>
              </svg>
            </div>
          </div>
          <div
            style={this.style.UnitBase_Composition_side_logo_}>
            {"CORNER"}
          </div>
        </div>
        <div
          style={this.style.UnitBase_Composition_lid_}>
          <span style={this.style.UnitBase_Composition_lid_span_User}>{"Berlin Chou"}</span>
          <span style={this.style.UnitBase_Composition_lid_span_Option}>{"下拉"}</span>
          <span style={this.style.UnitBase_Composition_lid_span_Option}>{"封面"}</span>
        </div>
      </div>
    )
  }
}
