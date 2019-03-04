import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";

class UnitLayerScroll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      moveCount: null,
      stickTop: "95%",
      buffer: false
    };
    this.scrollStick = React.createRef();
    this.stickBase = React.createRef();
    this._check_Position = this._check_Position.bind(this);
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

  _check_Position(event){
    event.stopPropagation();
    event.preventDefault();
    let upward = event.deltaY>0 ? true : false;
    if(this.props.lockify){ //in the locking region
      if(!upward && (this.state.moveCount==0)) return; // do nothing if we are wanting to go down but already at bottom
      if( !this.state.buffer) this.setState({buffer: true}) //give it a static chance
      else{
        this.setState((prevState, props)=>{//there are some error if we move to 'relations' path
          let nowCount = prevState.moveCount + (upward ? 10*3 : (-10)*3);
          let nextTop = this.coverLock - nowCount * this.basicMove;

          props._set_layerstatus(false, nowCount);
          return {
            moveCount: nowCount,
            stickTop: nextTop,
            buffer: false //leave locking region so does buffer
          };
        })
      }
      return;
    }else{ //during the move
      this.setState((prevState, props)=>{
        //main params needed to be submit to parent
        let nowCount = prevState.moveCount + (upward ? 10 : (-10)),
            layerlocking = false;

        if( upward && (nowCount > this.toppestCount)) return; // do nothing if we are going to go up but already at top-most
        //if the stick go into the locking region?
        let nextTop = this.coverLock-nowCount*this.basicMove;
        if(upward){ //if wheel up
          if(nextTop < this.upwardLock.secondBottom){
              if(nextTop < this.secondLock){ //there are some error if we move to 'relations' path
                if(nextTop < this.upwardLock.sumBottom){
                  if(nextTop > this.sumLock){
                    nextTop = this.sumLock; layerlocking=false; nowCount= 200;//200 is good for all component to refer for summary state nomatter there is a beneathSrc or not
                  };
                };
              }else{
                  nextTop = this.secondLock; layerlocking = true; nowCount = this.props.unitCurrent.beneathSrc ? 100 : 200;
              };
          };
        }else{ // if wheel down
          if(nextTop > this.downwardLock.secondTop)
            if(nextTop > this.secondLock){
              if (nextTop > this.downwardLock.coverTop) { nextTop = this.coverLock; layerlocking = true; nowCount = 0;};
            }else{
              //due to we want to set layer 'unlock' if we are at summary,
                nextTop = this.secondLock; layerlocking = this.props.unitCurrent.beneathSrc? true : false; nowCount = this.props.unitCurrent.beneathSrc ? 100 : 200;
            }
        };
        props._set_layerstatus(layerlocking, nowCount);
        return {
          moveCount: nowCount,
          stickTop: nextTop,
          buffer: false
        };
      })
    }
  }

  componentDidMount() {
    //we set these variable here because we need to use the component height
    let viewheight = this.stickBase.current.getBoundingClientRect().height;

    this.coverLock = viewheight*95/100; //bottom-most place as cover's static place
    this.basicMove = this.coverLock*4/5/(this.props.unitCurrent.beneathSrc ? 200 :100);
    this.toppestCount = this.props.unitCurrent.beneathSrc ?　240 : 120;
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

    this.setState({
      moveCount: this.props.moveCount,
      stickTop: this.props.moveCount>0 ? this.secondLock : this.coverLock
    });
  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        ref={this.stickBase}
        style={this.style.Com_Unit_LayerScroll_}
        onWheel={this._check_Position}>
        <div
          ref={this.scrollStick}
          style={Object.assign({top: this.state.stickTop},this.style.Com_Unit_LayerScroll_stick)}>
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
