import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

class UnitActionControl extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_ActionControl_authorify = this._render_ActionControl_authorify.bind(this);
    this._handleClick_UnitAction_Response = this._handleClick_UnitAction_Response.bind(this);
    this.style={
      Com_UnitActionControl_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Com_UnitActionControl_span: {
        display: 'inline-block',
        width: '43%',
        height: '49%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3% 0 3%',
        verticalAlign: 'middle',
        fontSize: '2rem',
        letterSpacing: '0.16rem',
        textAlign: 'center',
        fontWeight: '400',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_UnitAction_Response(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_Modalmode(true);
  }

  _render_ActionControl_authorify(){
    let component =  this.props.unitCurrent.identity=="author" ?(
      <div>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Response}>
          {"回應"}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Response}>
          {"編輯"}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Response}>
          {"統計"}
        </span>
      </div>
    ):(
      <div>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Response}>
          {"回應"}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}>
          {'推廣'}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}>
          {'追蹤'}
        </span>
      </div>
    );
    return component;
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitActionControl_}>
        {this._render_ActionControl_authorify()}
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
)(UnitActionControl));
