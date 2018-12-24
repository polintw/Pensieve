import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import SvgPropic from '../../Component/SvgPropic.jsx';
import ModalBox from '../../Component/ModalBox.jsx';

class ExternalPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toolBoxify: false
    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
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
      Com_ExternalPanal_div_: {
        width: '100%',
        height: '32%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '1% 0'
      },
      Com_ExternalPanal_div_circle: {
        width: '48%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        right: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      Com_ExternalPanal_AccountBack_: {
        width: '136%',
        height: '35%',
        position: 'relative',
        boxSizing: 'border-box',
        float: 'right'
      },
      Com_ExternalPanal_AccountBack_span_: {
        display: 'inline-block',
        width: '100%',
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        padding: '1% 0',
        textAlign: 'right',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
        color: '#222222',
        cursor: 'pointer'
      },
      Com_ExternalPanal_options_:{
        width: '100%',
        height: '32%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '1% 0',
        float: 'right',
        textAlign: 'right'
      },
      Com_ExternalPanal_options_span: {
        display: 'inline-block',
        width: '48%',
        boxSizing: 'border-box',
        borderTop: 'solid 1px #909090',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
        color: '#909090',
        cursor: 'pointer'
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

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  }

  _handleClick_selfCover(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/user/overview');
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
          style={this.style.Com_ExternalPanal_div_}>
          <svg
            style={this.style.Com_ExternalPanal_div_circle}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
          </svg>
        </div>
        <div
          style={this.style.Com_ExternalPanal_AccountBack_}>
          <span
            style={this.style.Com_ExternalPanal_AccountBack_span_}
            onClick={this._handleClick_selfCover}>
            {this.props.userInfo.account}</span>
        </div>
        <div
          style={this.style.Com_ExternalPanal_options_}>
          <span
            style={this.style.Com_ExternalPanal_options_span}
            onClick={this._handleClick_navToolBox}>
            {"。。"}
          </span>
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
