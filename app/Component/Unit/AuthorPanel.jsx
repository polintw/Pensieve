import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

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
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_AuthorPanel_span: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3% 0 3%',
        verticalAlign: 'middle',
        fontSize: '1.6rem',
        letterSpacing: '0.16rem',
        textAlign: 'right',
        fontWeight: '400',
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
    //let cx = cxBind.bind(styles);
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
