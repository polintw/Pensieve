import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";

class UnitLayerScroll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      buffer: false
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
        boxSizing: 'border-box'
      },
      Com_Unit_LayerScroll_stick: {
        width: '94%',
        height: '3%',
        position: 'absolute',
        left: '3%',
        backgroundColor: '#23352A'
      }
    }
  }

  _handleWheel_moveCount(event){
    event.stopPropagation();
    event.preventDefault();
    let upward = event.deltaY>0 ? true : false;
    let localProps = Object.assign({}, this.props); //shallow copy, but it's enough for moveCount
    if(this.props.lockify){ //in the locking region
      if(!upward && (this.props.moveCount==0)) return; // do nothing if we are wanting to go down but already at bottom
      if( !this.state.buffer) this.setState({buffer: true}) //give it a static chance
      else{
        this.setState((prevState, props)=>{//there are some error if we move to 'relations' path
          props._set_layerstatus(false, localProps.moveCount + (upward ? 10*3 : (-10)*3));
          return {
            buffer: false //leave locking region so does buffer
          };
        })
      }
      return;
    }else{ //during the move
      this.setState((prevState, props)=>{
        //main params needed to be submit to parent
        let nowCount = localProps.moveCount + (upward ? 10 : (-10)),
            layerlocking = false;

        if( upward && (nowCount > 240)) return; // do nothing if we are going to go up but already at top-most
        //if the stick go into the locking region?
        let nextTop = this.coverLock-nowCount*this.basicMove;
        if(upward){ //if wheel up
          if(nextTop < this.upwardLock.secondBottom){
              if(nextTop < this.secondLock){ //there are some error if we move to 'relations' path
                if (nextTop < this.upwardLock.sumBottom && nextTop > this.sumLock){
                  layerlocking=false; nowCount= 200;//200 is good for all component to refer for summary state nomatter there is a beneathSrc or not
                };
              }else{
                  layerlocking = true; nowCount = this.props.unitCurrent.beneathSrc ? 100 : 200;
              };
          };
        }else{ // if wheel down
          if(nextTop > this.downwardLock.secondTop)
            if(nextTop > this.secondLock){
              if (nextTop > this.downwardLock.coverTop) { layerlocking = true; nowCount = 0;};
            }else{
              //due to we want to set layer 'unlock' if we are at summary,
                layerlocking = this.props.unitCurrent.beneathSrc? true : false; nowCount = this.props.unitCurrent.beneathSrc ? 100 : 200;
            }
        };
        props._set_layerstatus(layerlocking, nowCount);
        return {
          buffer: false
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
        return this.secondLock
        break;
      case 200:
        return this.sumLock
        break;
      default:
        return this.coverLock - this.props.moveCount*this.basicMove/(this.props.unitCurrent.beneathSrc? 1 : 2) // because the moveCount would jump to 200 at summary
    }
  }

  componentDidMount() {
    //we set these variable here because we need to use the component height
    let viewheight = this.stickBase.current.getBoundingClientRect().height;

    this.coverLock = viewheight*95/100; //bottom-most place as cover's static place
    this.basicMove = this.coverLock*4/5/(this.props.unitCurrent.beneathSrc ? 200 :100);
    this.sumLock = this.coverLock/5;
    this.secondLock = this.props.unitCurrent.beneathSrc ? (this.coverLock*3/5) : this.sumLock;

    //define the locking range
    let basicMove13 = this.basicMove*13;
    this.upwardLock = {
      sumBottom: this.sumLock+basicMove13,
      secondBottom: this.secondLock + basicMove13 //same secondBottom value as sumBottom if the beneathSrc wasn't exist
    };
    this.downwardLock = {
      secondTop: this.secondLock - basicMove13,
      coverTop: this.coverLock - basicMove13 //same secondBottom value as sumBottom if the beneathSrc wasn't exist
    };
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
