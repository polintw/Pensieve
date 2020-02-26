import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

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
        justifyContent: 'space-between',
        width: '131%',
        position: 'relative',
        transform:'translate(-34%,0)',
        boxSizing: 'border-box'
      },
      Com_AuthorPanel_span: {
        boxSizing: 'border-box',
        fontSize: '1.5rem',
        letterSpacing: '0.12rem',
        fontWeight: '300',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    };
  }

  _handleClick_UnitAction_Author(event){
    event.preventDefault();event.stopPropagation();
    this.props._set_Modalmode("author_editing");
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

export default withRouter(connect(
  mapStateToProps,
  null
)(AuthorPanel));
