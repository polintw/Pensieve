import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {setUnitView} from "../../../../redux/actions/unit.js";

class AuthorPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: true
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_UnitAction_Author = this._handleClick_UnitAction_Author.bind(this);
    this.style={
      Com_AuthorPanel_: {
        display: 'flex',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_AuthorPanel_span: {
        boxSizing: 'border-box',
        fontSize: '1.5rem',
        letterSpacing: '0.12rem',
        fontWeight: '300',
        cursor: 'pointer'
      }
    };
  }

  _handleClick_UnitAction_Author(event){
    event.preventDefault();event.stopPropagation();
    this.props._set_state_UnitView("editing");
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_AuthorPanel_}>
        <span
          style={this.style.Com_AuthorPanel_span}
          onClick={this._handleClick_UnitAction_Author}>
          {"edit"}
        </span>
        <span
          style={this.style.Com_AuthorPanel_span}>
          {"erase"}
        </span>
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

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorPanel));
