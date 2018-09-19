import React from 'react';
import cxBind from 'classnames/bind';
import ModalBox from './ModalBox.jsx';

export default class ExternalPanel extends React.Component {
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
        height: '33%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_ExternalPanal_div_svg: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
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
    window.location.assign('/self?id=userid');
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
            style={this.style.Com_ExternalPanal_div_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
          </svg>
        </div>
        <div
          style={this.style.Com_ExternalPanal_div_}>
          <svg
            style={this.style.Com_ExternalPanal_div_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="0.8px" fontSize='3vh'>{"<-"}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfCover}/>
          </svg>
        </div>
        <div
          style={this.style.Com_ExternalPanal_div_}>
          <svg
            style={this.style.Com_ExternalPanal_div_svg}>
            <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="0.8px" fontSize='3vh'>{""}</text>
            <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_navToolBox} />
          </svg>
          <span
            style={{display: 'inline-block', width: '60%', height: '30%', position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%,-50%)"}}>
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
