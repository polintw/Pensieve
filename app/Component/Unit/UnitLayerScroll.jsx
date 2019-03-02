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
        width: '100vw',
        height: '100vh',
        position: 'fixed',
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
      if( !this.state.buffer) this.setState({buffer: true}) //give it a static chance
      else{
        this.setState((prevState, props)=>{//there are some error if we move to 'relations' path
          let nowCount = prevState.moveCount + (upward ? 10*3 : (-10)*3); 
          let nextTop = prevState.stickTop + nowCount * this.basicMove;
          
          props._set_layerstatus(false, nowCount);
          return {
            stickTop: nextTop,
            buffer: false //leave locking region so does buffer
          };
        })
      }
      return;
    }else{ //during the move
      this.setState((prevState, props)=>{
        //main params needed to be submit to parent
        let nowCount = prevState.moveCount+(upward ? 10 : -10),
            layerlocking = false;
        
        //if the stick go into the locking region?
        let nextTop = prevState.stickTop+nowCount*this.basicMove;
        if(upward){ //if wheel up
          if(nextTop < this.upward.secondBottom){
              if(nextTop < this.secondLock) //there are some error if we move to 'relations' path
                if(nextTop < this.upward.sumBottom){nextTop = this.sumLock; layerlocking=true; nowCount=this.props.unitCurrent.beneathSrc? 200:100;} //lock
              else{
                  nextTop = this.secondLock; layerlocking = true; nowCount = this.props.unitCurrent.beneathSrc ? 100 : 200;
              };
          };
        }else{ // if wheel down
          if(nextTop > this.upwardLock.secondTop)
            if(nextTop > this.secondLock)
              if (nextTop > this.upwardLock.coverTop) { nextTop = this.coverLock; layerlocking = true; nowCount = 0;}
            else{
                nextTop = this.secondLock; layerlocking = true; nowCount = this.props.unitCurrent.beneathSrc ? 100 : 200;
            }
        };
        props._set_layerstatus(layerlocking, nowCount);
        return {
          stickTop: nextTop,
          buffer: false
        };
      })
    }
  }

  componentDidMount() {
    //we set these variable here because we need to use the component height
    let viewheight = this.stickBase.getBoundingClientRect().height;
    
    this.coverLock = viewheight*95/100; //bottom-most place as cover's static place
    this.basicMove = this.coverLock*4/5/(this.props.unitCurrent.beneathSrc ? 200 :100);    
    this.sumLock = this.coverLock/5;
    this.secondLock = this.props.unitCurrent.beneathSrc ? (this.coverLock*3/5) : this.sumLock;
    
    //define the locking range
    let basicMove10 = this.basicMove*10;
    this.upwardLock = {
      sumBottom: this.sumLock+basicMove10,
      secondBottom: this.secondLock + basicMove10 //same secondBottom value as sumBottom if the beneathSrc wasn't exist
    };
    this.dowardLock = {
      secondTop: this.secondLock - basicMove10,
      coverTop: this.coverLock - basicMove10 //same secondBottom value as sumBottom if the beneathSrc wasn't exist
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
