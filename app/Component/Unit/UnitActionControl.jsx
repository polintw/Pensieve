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
      axios: true
    };
    this._handler_eventGeneral = (event)=>{event.preventDefault();event.stopPropagation();};
    this.axiosSource = axios.CancelToken.source();
    this._axios_ErrHandler = this._axios_ErrHandler.bind(this);
    this._render_ActionControl_authorify = this._render_ActionControl_authorify.bind(this);
    this._handleClick_UnitAction_Author = this._handleClick_UnitAction_Author.bind(this);
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
    };
  }

  _axios_ErrHandler(thrown){
    if (axios.isCancel(thrown)) {
      console.log('Request canceled: ', thrown.message);
    } else {
      if (thrown.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        alert('Something went wrong: '+thrown.response.data.message)
        if(thrown.response.status == 403){
          window.location.assign('/login');
        }
      } else if (thrown.request) {
          // The request was made but no response was received
          // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(thrown.request);
      } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error: ', thrown.message);
      }
      console.log("Error config: "+thrown.config);
    }
  }

  _handleClick_UnitAction_Response(event){
    this._handler_eventGeneral(event);
    this.props._set_Modalmode(true);
  }

  _handleClick_UnitAction_Author(event){
    this._handler_eventGeneral(event);
    this.props._set_Modalmode("editing");
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
          onClick={this._handleClick_UnitAction_Author}>
          {"編輯"}
        </span>
        <span
          style={this.style.Com_UnitActionControl_span}>
          {"刪除"}
        </span>
      </div>
    ):(
      <div>
        <span
          style={this.style.Com_UnitActionControl_span}
          onClick={this._handleClick_UnitAction_Response}>
          {"回應"}
        </span>
      </div>
    );
    return component;
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
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
