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
    this._render_LayerSpots = this._render_LayerSpots.bind(this);
    this._handleClick_set_layerDown = this._handleClick_set_layerDown.bind(this);
    this._handleClick_set_layerUp = this._handleClick_set_layerUp.bind(this);
    this.style={

    };
    //and preparing the params needed by render
    this.coverLock = 1; //could not be '0' because we need to cauculate basicMove by this
    this.sumLock = (-44); //keep sumLock as an indepent var to set 200 position no matter how big is the basicMove
    this.basicMove = 44/(this.props.unitCurrent.beneathSrc ? 200 :100);
      //'44' just because for now, the box height was 44% longer than Switch
      //distribution depends on beneathSrc in order to have a different move 'speed'
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
    if(this.coverLock == null) return "1%"; //just as default coverLock
    switch (this.props.moveCount) {
      case 0:
        return (this.coverLock+"%")
        break;
      case 100:
        return (this.coverLock-this.basicMove*100)+"%"
        break;
      case 200:
        return this.sumLock+"%"
        break;
      default:
        let delta = this.props.moveCount*this.basicMove/((this.props.moveCount>200 && !this.props.unitCurrent.beneathSrc)? 2:1);
        return  (this.coverLock-delta)+"%";// because the moveCount would jump to 200 at summary
    }
  }

  _render_LayerSpots(){
    let spotsDOM = [];
    let beneathify = this.props.unitCurrent.beneathSrc? true : false;

    let portion = Math.abs((this.props.moveCount-100)/100); //we use '100' due to the system was base on the 0, 100, 200 range
    let _renderBinSpots = (second)=>{
      //second: if true, meaning rendering for beneathSrc situation
      return(
        <div
          key={"key_UnitSpotBin_"+ (second? "1": "0")}
          className={classnames(styles.boxSpotBin)}
          style={Object.assign({}, second? {bottom: '0'}: {top: '0'})}>
          <div
            className={classnames(styles.boxSpotSing)}
            style={Object.assign(
              {},
              {top: beneathify? '0': '13%'},
              second? {opacity: this.props.moveCount> 199? '1': '0'}:{opacity: this.props.moveCount> 99? '1': '0'}
            )}>
            <LayerSpot/>
          </div>
          <div
            className={classnames(styles.boxSpotSing)}
            style={Object.assign(
              {},
              {bottom: '0'},
              second? {opacity: this.props.moveCount> 100? (1-portion): '1'}:{opacity: this.props.moveCount< 100? portion: '0'}
            )}>
            <LayerSpot/>
          </div>
        </div>
      )
    }

    spotsDOM.push(
      _renderBinSpots(false)
    )
    if(beneathify){
      spotsDOM.push(
        _renderBinSpots(true)
      )
    }

    return spotsDOM;
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        className={styles.boxUnitLayerSwitch}>
        <div
          className={classnames(styles.boxSwitch)}>
          <div
            className={classnames(styles.boxSwitchSvg)}
            style={{cursor: 'pointer'}}
            onClick={this._handleClick_set_layerUp}>
            <LayerSwitUp/>
          </div>
          <div
            className={classnames(styles.boxSwitchSvg)}>
            <LayerSwitch/>
            <div
              className={classnames(styles.boxSwitDn)}
              onClick={this._handleClick_set_layerDown}></div>
          </div>
          <div
            className={classnames(styles.boxSpots)}
            style={{top: this._set_stickTop()}}>
            {this._render_LayerSpots()}
          </div>
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
