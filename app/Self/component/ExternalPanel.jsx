import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import ModalBox from '../../Component/ModalBox.jsx';

class ExternalPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toolBoxify: false
    };
    this._handleClick_selfCover = this._handleClick_selfCover.bind(this);
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._handleClick_ToolBox_logout = this._handleClick_ToolBox_logout.bind(this);
    this.style={
      Com_ExternalPanal_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_ExternalPanal_AccountBack_: {
        display:'inline-block',
        height: '92%',
        position: 'absolute',
        top: '8%',
        right: '36%',
        boxSizing: 'border-box',
        padding: '0.5vh 0',
        borderTop: '1px solid #909090',
        textAlign: 'center',
        cursor: 'pointer'
      },
      Com_ExternalPanal_AccountBack_span_: {
        display: 'block',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0.5vh 0',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
        color: '#222222'
      },
      Com_ExternalPanal_options_:{
        width: '20%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        padding: '2vh 5%',
        cursor: 'pointer'
      },
      Com_ExternalPanal_options_span: {
        display: 'block',
        width: '100%',
        height: '42%',
        position: 'relative',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
        color: '#909090'
      },
      Com_ExternalPanal_modal_ToolBox_: {
        boxSizing: 'border-box',
        boxShadow: '1px 1px 5px 0px',
        backgroundColor: '#FAFAFA'
      },
      Com_ExternalPanal_modal_ToolBox_ol: {
        width: '100%',
        top: '0',
        left: '0',
        boxSizing: 'boder-box',
        padding: '0 5%',
        listStyle: 'none',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '300',
        color: '#222222'
      }
    }
  }

  _handleClick_selfCover(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/user/screen');
  }

  _handleClick_navToolBox(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      return {toolBoxify: prevState.toolBoxify?false:true}
    })
  }

  _handleClick_ToolBox_logout(event){
    event.stopPropagation();
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.assign('/login');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        id="Com_ExternalPanal_"
        style={this.style.Com_ExternalPanal_}>
        <div
          style={this.style.Com_ExternalPanal_AccountBack_}
          onClick={this._handleClick_selfCover}>
          <span style={this.style.Com_ExternalPanal_AccountBack_span_}>
            {this.props.userInfo.firstName}</span>
          <span style={this.style.Com_ExternalPanal_AccountBack_span_}>
            {this.props.userInfo.lastName}</span>
        </div>
        <div
          style={this.style.Com_ExternalPanal_options_}
          onClick={this._handleClick_navToolBox}>
          <span
            style={this.style.Com_ExternalPanal_options_span}>
            {"。"}</span>
          <span
            style={this.style.Com_ExternalPanal_options_span}>
            {"。"}</span>
        </div>
        {
          this.state.toolBoxify &&
          <ModalBox containerId="Com_ExternalPanal_">
            <div
              style={this.style.Com_ExternalPanal_modal_ToolBox_}>
              <ol
                style={this.style.Com_ExternalPanal_modal_ToolBox_ol}>
                <li
                  style={{cursor: 'pointer'}}
                  onClick={this._handleClick_ToolBox_logout}>
                  {"Log Out"}
                </li>
              </ol>
            </div>
          </ModalBox>
        }
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
)(ExternalPanel));
