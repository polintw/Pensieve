import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import SvgOptions from './Svg/SvgOptions.jsx';
import ModalBox from './ModalBox.jsx';

const commonStyle = {

}

export default class NavOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toolBoxify: false
    };
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._handleClick_ToolBox_logout = this._handleClick_ToolBox_logout.bind(this);
    this.style={
      selfCom_NavOptions_: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavOptions_svg_:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      selfCom_NavOptions_ToolBox_: {
        minWidth: '132px',
        position: 'absolute',
        top: '-36%',
        right: '-16%',
        boxSizing: 'border-box',
        boxShadow: '1px 1px 5px 0px',
        backgroundColor: '#FFFFFF'
      },
      selfCom_NavOptions_ToolBox_ol_: {
        boxSizing: 'border-box',
        padding: '0 10%',
        margin: '1.2rem 0',
        listStyle: 'none',
        fontSize: '1.3rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#000000'
      }
    }
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
        style={this.style.selfCom_NavOptions_}>
        <div
          id={"NavOptions_Self"}
          style={{width: "100%", height: '100%', position: 'absolute',boxSizing: 'border-box'}}></div>
        <div
          style={this.style.selfCom_NavOptions_svg_}
          onClick={this._handleClick_navToolBox}>
          <SvgOptions/>
        </div>
        {
          this.state.toolBoxify &&
          <ModalBox containerId="NavOptions_Self">
            <div
              style={this.style.selfCom_NavOptions_ToolBox_}>
              <ol
                style={this.style.selfCom_NavOptions_ToolBox_ol_}>
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
