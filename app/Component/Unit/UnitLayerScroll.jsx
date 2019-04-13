import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import {
  unitLockBufferLimit,
  unitBasicMoveCount
} from '../config/interactionsParams.js';

class UnitLayerScroll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      buffer: 0
    };
    this.scrollStick = React.createRef();
    this.stickBase = React.createRef();
    this._set_stickTop = this._set_stickTop.bind(this);
    this._handleWheel_moveCount = this._handleWheel_moveCount.bind(this);
    this.style={
      Com_Unit_LayerScroll_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0%',
        boxSizing: 'border-box',
        touchAction: 'pan-y'
      },
      Com_Unit_LayerScroll_stick: {
        width: '94%',
        height: '2.4%',
        position: 'absolute',
        left: '3%',
        borderRadius: '20px',
        backgroundColor: '#cec9a6'
      }
    }
  }

  _handleWheel_moveCount(event){
    event.stopPropagation();
    //event.preventDefault();
    //due to a break through of Chrome new version, the Wheel(touch) event was handled differently forever
    //still we can control the 'touch' part, like touch screen or touchpad by set a CSS property: 'touchAction'

    if(this.props.markOpened) return;//stop process if the mark still open

    let upward = event.deltaY>0 ? true : false;
    let localProps = Object.assign({}, this.props); //shallow copy, but it's enough for moveCount
    if(this.props.lockify){ //in the locking region
      if(!upward && (this.props.moveCount==0)) return; // do nothing if we are wanting to go down but already at bottom
      if(this.state.buffer < unitLockBufferLimit) this.setState((prevState,props)=>{return {buffer: prevState.buffer+1};}) //give it a static chance
      else{
        this.props._set_layerstatus(false, localProps.moveCount + (upward ? this.basicCount*3 : (-1)*this.basicCount*3));
      }
      return;
    }else{ //during the move
      this.setState((prevState, props)=>{
        //main params needed to be submit to parent
        let nowCount = localProps.moveCount + (upward ? this.basicCount : (-1)*this.basicCount),
            layerlocking = false;

        //if the stick go into the locking region?
        if(nowCount < 200){ //200 or >200, just pass the var
          if(upward){ //if wheel up
            if(nowCount> this.bounderTopBottom){
              layerlocking=false; nowCount= 200;//200 is good for all component to refer for summary state nomatter there is a beneathSrc or not
            }else{ //we donn't use 'else if' because the upMiddle was euqal to bounderTop when without beneath
              if(nowCount < this.upMiddle && nowCount > (this.upMiddle-this.checkRange)){
                layerlocking=true; nowCount= this.upMiddle;
              }
            }
          }else{ // if wheel down
            if(nowCount > this.bounderTopBottom){
              layerlocking=false; nowCount= this.bounderTop-this.basicCount;
            }else{
              if(nowCount < this.checkRange){
                layerlocking=true; nowCount= 0;
              }else{ //we donn't use 'else if' because the downMiddle was euqal to 0 when without beneath
                if(nowCount > this.downMiddle && nowCount < this.downMiddle+this.checkRange){layerlocking=true; nowCount= this.downMiddle;}
              }
            }
          };
        }

        props._set_layerstatus(layerlocking, nowCount);
        return {
          buffer: 0
        };
      })
    }
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

  componentDidMount() {
    //we set these variable here because we need to use the component height
    let viewheight = this.stickBase.current.getBoundingClientRect().height;

    this.coverLock = viewheight*95/100; //bottom-most place as cover's static place
    this.sumLock = this.coverLock/5;
    this.basicMove = this.coverLock*4/5/(this.props.unitCurrent.beneathSrc ? 200 :100);

    this.basicCount = unitBasicMoveCount; //set single 'step'
    this.checkRange = this.basicCount+1; //11 if we set basicCount as 10
    this.bounderTop = this.props.unitCurrent.beneathSrc? 200:100; //mark the toppest reachable count
    this.bounderTopBottom = this.bounderTop-this.checkRange;
    //only defin 'top' beacuse the 'lowest' is 0
    //then definr the middle lines for multiple layers
    this.downMiddle = this.props.unitCurrent.beneathSrc? 100:0;
    this.upMiddle = this.props.unitCurrent.beneathSrc? 100:this.bounderTop;
  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        ref={this.stickBase}
        style={this.style.Com_Unit_LayerScroll_}
        onWheel={this._handleWheel_moveCount}>
        <div
          ref={this.scrollStick}
          style={Object.assign({top: this._set_stickTop()},this.style.Com_Unit_LayerScroll_stick)}>
        </div>
        {this.props.children}
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
)(UnitLayerScroll));
