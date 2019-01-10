import React from 'react';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CreateShare from '../../Component/CreateShare.jsx';
import SvgCreate from '../../Component/SvgCreate.jsx';

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
        width: '30%',
        height: '50%',
        position: 'absolute',
        top: '50%',
        left: '40%',
        transform: 'translate(0,-50%)',
        boxSizing: 'border-box'
      },
      withinCom_EntryCall_Info_: {
        width: '30%',
        height: '100%',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box',
      },
      withinCom_EntryCall_Info_Date_: {
        position: 'absolute',
        bottom: '0%',
        left: '50%',
        transform: 'translate(-50%,0%)',
        boxSizing: 'border-box',
        fontSize: '0.8vh',
        letterSpacing: '0.1vh',
        fontWeight: '300',
        textAlign: 'left',
        color: '#222222'
      },
      withinCom_EntryCall_Info_User_: {
        position: 'absolute',
        top:'0%',
        left: '50%',
        transform: 'translate(-50%, 0%)',
        boxSizing: 'border-box',
        fontWeight: '400',
        fontSize: '1vh',
        letterSpacing: '0.12vh',
        textAlign: 'center'
      },
      withinCom_EntryCall_logo_: {
        position: 'absolute',
        top:'50%',
        left: '0%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        padding: '0 2%',
        fontWeight: '700',
        fontSize: '2rem',
        letterSpacing: '0.4rem'
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
          <SvgCreate/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_leavevonIndex}/>
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
