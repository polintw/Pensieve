import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";

class UnitLayerScroll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stickPortion: null,
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
        this.setState((prevState, props)=>{
          let nextTop = prevState.stickTop+(upward ? this.scrollCardinal*(-1) : this.scrollCardinal)*3;
          return {
            stickTop: nextTop,
            buffer: false //leave locking region so does buffer
          };
        })
        //unlock
        this.props._set_layerparam();
        _set_layerstatus false
      }
      return;
    }else{ //during the move
      this.setState((prevState, props)=>{
        //if the stick go into the locking region?
        let nextTop = prevState.stickTop+(upward ? this.scrollCardinal*(-1) : this.scrollCardinal);

        if(upward){ //if wheel up
          if(nextTop < this.upward.secondBottom){
              if(nextTop < this.secondLock)
                if(nextTop < this.upward.sumBottom){nextTop = this.sumLock; props._set_layerstatus(true, 200);} //lock
              else{
                nextTop = this.secondLock; props._set_layerstatus(true, this.props.beneathSrc ? 100:200);
              };
          };
        }else{ // if wheel down
          if(nextTop > this.upwardLock.secondTop)
            if(nextTop > this.secondLock)
              if(nextTop > this.upwardLock.coverTop){nextTop = this.coverLock; props._set_layerstatus(true);}
            else{
              nextTop = this.secondLock; props._set_layerstatus(true);
            }
        };
0 this.coverLock
100 this.secondLock
200 this.sumLock
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
    this.sumLock = this.coverLock/5;
    this.secondLock = this.props.unitCurrent.beneathSrc ? (this.coverLock*3/5) : this.sumLock;
    this.scrollCardinal = this.coverLock/ (this.props.unitCurrent.beneathSrc ? 32 : 20) ; // set the delta px /scroll
    this.portionNmr = this.props.unitCurrent.beneathSrc ? 200/(32*4/5) : (20*4/5)/200; //to LayerFrame, it need the portion base on range 0-200
    this.upwardLock = {
      sumBottom: this.sumLock+this.scrollCardinal,
      secondBottom: this.secondLock+this.scrollCardinal //same secondBottom value as sumBottom if the beneathSrc wasn't exist
    };
    this.dowardLock = {
      secondTop: this.secondLock-this.scrollCardinal,
      coverTop: this.coverLock-this.scrollCardinal //same secondBottom value as sumBottom if the beneathSrc wasn't exist
    };

    this.setState({
      stickPortion: this.props.unitInit.layer>0 ?  : 0,
      stickTop: this.props.unitInit.layer>0 ? this.secondLock : this.coverLock
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
