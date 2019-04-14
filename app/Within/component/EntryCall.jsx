import React from 'react';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CreateShare from '../../Component/CreateShare.jsx';
import SvgCreateCoral from '../../Component/SvgCreateCoral.jsx';
import ModalBox from '../../Component/ModalBox.jsx';

class EntryCall extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toolBoxify: false
    };
    this.dateObj = new Date();
    this._handleClick_currentReload = this._handleClick_currentReload.bind(this);
    this._handleClick_selfEntrance = this._handleClick_selfEntrance.bind(this);
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      withinCom_EntryCall_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0'
      },
      withinCom_EntryCall_CreateShare_: {
        width: '28%',
        height: '47%',
        position: 'absolute',
        top: '50%',
        left: '42%',
        transform: 'translate(0,-50%)',
        boxSizing: 'border-box'
      },
      withinCom_EntryCall_options_: {
        width: '3%',
        position: 'absolute',
        top: '50%',
        left: '70.5%',
        transform: 'translate(0,-50%)',
        boxSizing: 'border-box',
      },
      withinCom_LtdToolBox_: {
        position: 'absolute',
        top: '107%',
        left: '32%',
        boxSizing: 'border-box',
        boxShadow: '1px 1px 5px 0px',
        backgroundColor: '#FAFAFA'
      },
      withinCom_LtdToolBox_ol_: {
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '0 18% 0 10%',
        listStyle: 'none',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '300',
        color: '#222222'
      },
      withinCom_EntryCall_Info_: {
        width: '28%',
        position: 'absolute',
        top: '50%',
        right: '0',
        boxSizing: 'border-box',
      },
      withinCom_EntryCall_Info_Date_: {
        position: 'absolute',
        top: '0%',
        left: '15%',
        boxSizing: 'border-box',
        fontSize: '1vh',
        letterSpacing: '0.125vh',
        fontWeight: '300',
        color: '#222222'
      },
      withinCom_EntryCall_Info_User_: {
        position: 'absolute',
        bottom:'0%',
        left: '12%',
        boxSizing: 'border-box',
        fontWeight: '300',
        fontSize: '2.8vh',
        letterSpacing: '0.24vh',
        cursor: 'pointer'
      },
      withinCom_EntryCall_logo_: {
        position: 'absolute',
        top:'46%',
        left: '0%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        padding: '0 2%',
        fontWeight: '700',
        fontSize: '9vh',
        letterSpacing: '1vh',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_currentReload(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_leavevonIndex('','reload')
  }

  _handleClick_selfEntrance(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._refer_leavevonIndex(this.props.userInfo.id,'user')
  }

  _handleClick_navToolBox(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      return {toolBoxify: prevState.toolBoxify?false:true}
    })
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_EntryCall_}>
        <div
          style={this.style.withinCom_EntryCall_logo_}
          onClick={this._handleClick_currentReload}>
          {"CORNER"}
        </div>
        <div
          style={this.style.withinCom_EntryCall_CreateShare_}>
          <SvgCreateCoral/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_leavevonIndex}/>
        </div>
        <div
          id={"withinCom_EntryCall_options"}
          style={this.style.withinCom_EntryCall_options_}>
          <span
            style={{display: 'inline-block', position: 'relative', fontSize: '1rem', writingMode: 'vertical-rl', cursor: 'pointer'}}
            onClick={this._handleClick_navToolBox}>
            {"。。"}
          </span>
        </div>
        <div
          style={this.style.withinCom_EntryCall_Info_}>
          <div
            style={this.style.withinCom_EntryCall_Info_Date_}>
            <span>{(this.dateObj.getMonth()+1)+' ﹒'}</span>
            <span>{this.dateObj.getDate()+' ﹒'}</span>
            <span>{this.dateObj.getFullYear()}</span>
          </div>
          <div
            style={this.style.withinCom_EntryCall_Info_User_}
            onClick={this._handleClick_selfEntrance}>
            {this.props.userInfo.account}
          </div>
        </div>
        {
          this.state.toolBoxify &&
          <ModalBox containerId="withinCom_EntryCall_options">
            <div
              style={this.style.withinCom_LtdToolBox_}>
              <ol
                style={this.style.withinCom_LtdToolBox_ol_}>
                <li
                  style={{position: 'relative', whiteSpace: 'pre', cursor: 'pointer'}}
                  onClick={this.props._handleClick_LtdToolBox_logout}>
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
)(EntryCall);
