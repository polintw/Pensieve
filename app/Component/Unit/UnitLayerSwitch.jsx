import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";

class UnitLayerSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_set_layerDown = this._handleClick_set_layerDown.bind(this);
    this._handleClick_set_layerUp = this._handleClick_set_layerUp.bind(this);
    this.style={
      Com_UnitLayerControl: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '5%'
      },
      Com_UnitLayerControl_svg_button: {
        width: '90%',
        height: '6%',
        position: 'absolute',
        left: '50%',
        transform: 'translate(-50%,0)',
        cursor: 'pointer'
      }
    };
  }

  _handleClick_set_layerDown(event){
    event.preventDefault();
    event.stopPropagation();

    let nowCount, lockify;
    if(this.props.moveCount > 199){ //200 or heigher
      nowCount = 240;lockify=false;
    }else{
      if(!this.props.unitCurrent.beneathSrc || this.props.moveCount > 99){ //to 200 situations
        nowCount = 200;lockify=false;
      }else{ //the rest, to 100 with beneathSrc
        nowCount = 100;lockify=true;
      }
    }

    this.props._set_layerstatus(true, nowCount);
  }

  _handleClick_set_layerUp(event){
    event.preventDefault();
    event.stopPropagation();

    let nowCount, lockify;
    if(!this.props.unitCurrent.beneathSrc || this.props.moveCount < 101){ //to 0 situations
      nowCount = 0;lockify=true;
    }else{
      nowCount = 100;lockify=true;
    }

    this.props._set_layerstatus(true, nowCount);
  }

  render(){
    const self = this;
    //here SVG important! if there are two SVG tag, distinguish the "class" to prevent style overlay!!
    return(
      <div
        style={this.style.Com_UnitLayerControl}>
        <svg
          style={Object.assign({top: "50%"}, self.style.Com_UnitLayerControl_svg_button)}
          onClick={self._handleClick_set_layerDown}
          xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 35 56"}>
          <defs>
            <style>{".cls-1-down{fill:#f7f4bc;stroke:#f7f4bc;stroke-miterlimit:10;}"}</style>
          </defs>
          <g id="圖層_2" data-name="圖層 2">
            <g id="圖層_2-2" data-name="圖層 2">
              <path className="cls-1-down" d="M.5.5v45c0,5.5,5.4,10,12,10h10c6.6,0,12-4.5,12-10V.5Z"/>
            </g></g>
        </svg>
        <svg
          style={Object.assign({top: "36%"}, self.style.Com_UnitLayerControl_svg_button)}
          onClick={self._handleClick_set_layerUp}
          xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 35 56"}>
          <defs>
            <style>
              {".cls-1-up{fill:none;stroke:#f7f4bc;stroke-miterlimit:10;}"}
            </style>
          </defs>
          <g id="圖層_2" data-name="圖層 2">
            <g id="圖層_2-2" data-name="圖層 2">
              <path className="cls-1-up" d="M.5,55.5v-45C.5,5,5.9.5,12.5.5h10c6.6,0,12,4.5,12,10v45Z"/></g></g>
        </svg>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(UnitLayerSwitch));
