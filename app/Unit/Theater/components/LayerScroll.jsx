import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import {
  unitLockBufferLimit,
  unitBasicMoveCount
} from '../../props.js';

class LayerScroll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      buffer: 0
    };
    this.scrollBase = React.createRef();
    this._handleWheel_moveCount = this._handleWheel_moveCount.bind(this);
    this.style={
      Com_Unit_LayerScroll_: {
        touchAction: 'pan-y'
      },
    }
  }

  _handleWheel_moveCount(event){
    event.stopPropagation();
    event.preventDefault();
    //due to a break through of Chrome new version, the Wheel(touch) event was handled differently forever(see below 'addEventListener')
    //about the scroll from 'touch' part, like touch screen or touchpad should control by set a CSS property: 'touchAction'

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

  componentDidMount() {

    this.basicCount = unitBasicMoveCount; //set single 'step'
    this.checkRange = this.basicCount+1; //11 if we set basicCount as 10
    this.bounderTop = this.props.unitCurrent.beneathSrc? 200:100; //mark the toppest reachable count
    this.bounderTopBottom = this.bounderTop-this.checkRange;
    //only defin 'top' beacuse the 'lowest' is 0
    //then definr the middle lines for multiple layers
    this.downMiddle = this.props.unitCurrent.beneathSrc? 100:0;
    this.upMiddle = this.props.unitCurrent.beneathSrc? 100:this.bounderTop;

    this.scrollBase.current.addEventListener('wheel', this._handleWheel_moveCount, {passive: false})
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //it would block the e.preventDefault() useage
    //so we could only add listener manually like this way
  }

  componentWillUnmount() {
    //and don't forget to move any exist evetListener
    this.scrollBase.current.removeEventListener('wheel',this._handleWheel_moveCount);
  }

  render(){
    return(
      <div
        className={'boxAbsoluteFull'}
        ref={this.scrollBase}
        style={this.style.Com_Unit_LayerScroll_}>
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
)(LayerScroll));
