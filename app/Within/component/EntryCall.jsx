import React from 'react';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CreateShare from '../../Component/CreateShare.jsx';
import SvgCreateCoral from '../../Component/SvgCreateCoral.jsx';

class EntryCall extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.dateObj = new Date();
    this._handleClick_selfEntrance = this._handleClick_selfEntrance.bind(this);
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

  _handleClick_selfEntrance(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/screen');
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
          style={this.style.withinCom_EntryCall_logo_}>
          {"CORNER"}
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
        <div
          style={this.style.withinCom_EntryCall_CreateShare_}>
          <SvgCreateCoral/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_leavevonLtd}/>
        </div>
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
