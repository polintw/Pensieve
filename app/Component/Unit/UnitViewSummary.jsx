import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

class UnitViewSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitViewSummary_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      }
    };
  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    if(this.props.moveCount == 240) return (<UnitSummaryNail  _close_modal_Unit={this.props._close_modal_Unit}/>);

    return(
      <div
        style={this.style.Com_UnitViewSummary_}>

      </div>
    )
  }
}

class UnitSummaryNail extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitViewSummary_: {
        width: '100%',
        height: '20%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      }
    };
  }

  componentDidMount(){
    //there should be some animation to toggle between close and extend, as a refer hint
    this.props._close_modal_Unit(); //temp method, should refer to /relations after relations component was created
  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitViewSummary_}>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(UnitViewSummary));
