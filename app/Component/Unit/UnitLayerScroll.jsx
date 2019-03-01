import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";

class UnitLayerScroll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
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
    if(this.props.lockify){ //in the locking region
      if( !this.state.buffer) this.setState({buffer: true}) //give it a static chance
      else{
        this.setState((prevState, props)=>{
          let nextTop = prevState.stickTop+(event.deltaY>0 ? this.scrollCardinal*(-1) : this.scrollCardinal)*2;
          return { stickTop: nextTop};
        }, ()=>{

          this.props._set_layerparam();
          _set_marksVisible false
        });
      }
      return;
    }else{ //during the move
      this.setState((prevState, props)=>{
        //if the stick go into the locking region?
      })
    }

    //move whole unit became a child, to use onWheel event everywhere
    //pass wheel delta portion(1/5 each time) to UnitLayerFrame
    //switch 'lock' state when leave/enter 'zero position'
  }

  componentDidMount() {
    let viewheight = this.stickBase.getBoundingClientRect().height;
    this.coverLock = viewheight*95/100; //bottom-most place as cover's static place
    this.secondLock = this.props.unitCurrent.beneathSrc ? this.coverLock*3/5 : this.coverLock*1/4;
    this.scrollCardinal = (this.coverLock-this.secondLock)/
      (this.props.unitCurrent.beneathSrc ? 8 : 10); // set the delta px /scroll
    this.setState({stickTop: this.coverLock});
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
