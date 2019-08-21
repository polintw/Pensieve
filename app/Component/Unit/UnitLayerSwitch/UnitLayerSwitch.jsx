import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  LayerSwitch,
  LayerSpot,
  LayerSwitUp
} from '../../Svg/SvgUnitSwit.jsx';

class UnitLayerSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_stickTop = this._set_stickTop.bind(this);
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
      nowCount = 242; //bigger than 240
      lockify=false;
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

  _set_stickTop(){
    if(this.coverLock == null) return "95%";
    switch (this.props.moveCount) {
      case 0:
        return this.coverLock
        break;
      case 100:
        return this.coverLock-this.basicMove*100
        break;
      case 200:
        return this.sumLock
        break;
      default:
        let delta = this.props.moveCount*this.basicMove/((this.props.moveCount>200 && !this.props.unitCurrent.beneathSrc)? 2:1);
        return  (this.coverLock-delta);// because the moveCount would jump to 200 at summary
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_UnitLayerControl}>
        <div
          style={Object.assign({top: ""})}>
          <LayerSpot/>
        </div>
        <div
          className={classnames(styles.boxSwitch)}>
          <LayerSwitch/>
          <div
            className={classnames(styles.boxSwitchDN)}
            onClick={self._handleClick_set_layerDown}></div>
        </div>
        <div
          style={Object.assign({})}
          onClick={self._handleClick_set_layerDown}>
          <LayerSwitUp/>
        </div>

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
