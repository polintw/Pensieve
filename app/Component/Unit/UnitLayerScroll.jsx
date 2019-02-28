import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";

class UnitLayerScroll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stickTop: 95,
    };
    this.scrollOrigin = 95;
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
    let cardinal = this.props.unitCurrent.beneathSrc ?
      (this.scrollOrigin/(2.5*5)) : (this.scrollOrigin/(3.2*5));

    let delta = (event.deltaY>0) ? (cardinal*(-1)) : cardinal;
    this.setState((prevState, props)=>{
      return {stickTop: prevState.stickTop+delta}
    });
    this.props._set_layerparam();
    //move whole unit became a child, to use onWheel event everywhere
    //pass wheel delta portion(1/5 each time) to UnitLayerFrame
    //switch 'lock' state when leave/enter 'zero position'
  }

  componentDidMount() {

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
          style={Object.assign({top: (this.state.stickTop)+'%'},this.style.Com_Unit_LayerScroll_stick)}>
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
