import React from 'react';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CreateShare from '../../Component/CreateShare.jsx';
import ModalBox from '../../Component/ModalBox.jsx';

class LtdNav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toolBoxify: false
    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleClick_selfEntrance = this._handleClick_selfEntrance.bind(this);
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._handleClick_LtdToolBox_logout = this._handleClick_LtdToolBox_logout.bind(this);
    this.style={
      withinCom_LtdNav_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        color: '#020202'
      },
      withinCom_LtdNav_logo_: {
        width: '16%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '18%',
        boxSizing: 'border-box'
      },
      withinCom_LtdNav_div_: {
        width: '25%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '18%',
        boxSizing: 'border-box'
      },
      withinCom_LtdNav_div_User_: {
        display: 'inline-block',
        width: '40%',
        height: '100%',
        position: 'relative',
        float: 'right',
        boxSizing: 'border-box',
        fontSize: '3.6vh',
        textAlign: 'center'
      },
      withinCom_LtdToolBox_: {
        width: '20%',
        position: 'absolute',
        bottom: '105%',
        right: '18%',
        boxSizing: 'border-box',
        boxShadow: '1px 1px 5px 0px',
        backgroundColor: '#FAFAFA'
      },
      withinCom_LtdToolBox_ol_: {
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

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds');
  }

  _handleClick_selfEntrance(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/overview');
  }

  _handleClick_navToolBox(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      return {toolBoxify: prevState.toolBoxify?false:true}
    })
  }

  _handleClick_LtdToolBox_logout(event){
    event.stopPropagation();
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.assign('/login');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        id="withinCom_LtdNav_"
        ref={(element)=>{this.withinCom_LtdNav_ = element;}}
        style={this.style.withinCom_LtdNav_}>
        <div
          style={this.style.withinCom_LtdNav_logo_}>
          <img src="/images/vacancy.png" style={{width: '100%', maxHeight: '100%'}}/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_leavevonLtd}/>
        </div>
        <div
          style={this.style.withinCom_LtdNav_div_}>
          <span
            style={{display: 'inline-block', width: '20%', height: '100%', position: 'relative', float: 'right', cursor: 'pointer'}}
            onClick={this._handleClick_navToolBox}>
            {"。。"}
          </span>
          <div
            style={this.style.withinCom_LtdNav_div_User_}>
            <div
              style={{width: '100%', position: 'absolute', top: '50%', transform: 'translate(0, -50%)', cursor: 'pointer'}}
              onClick={this._handleClick_selfEntrance}>
              {this.props.userInfo.account}
            </div>
          </div>
        </div>
        {
          this.state.toolBoxify &&
          <ModalBox containerId="withinCom_LtdNav_">
            <div
              style={this.style.withinCom_LtdToolBox_}>
              <ol
                style={this.style.withinCom_LtdToolBox_ol_}>
                <li
                  style={{cursor: 'pointer'}}
                  onClick={this._handleClick_LtdToolBox_logout}>
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
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(LtdNav);
