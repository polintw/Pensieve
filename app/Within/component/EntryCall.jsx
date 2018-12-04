import React from 'react';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import CreateShare from '../../Component/CreateShare.jsx';

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
        height: '80%',
        position: 'absolute',
        top: '50%',
        left: '0',
        transform: 'translate(0, -50%)'
      },
      withinCom_EntryCall_CreateShare_: {
        width: '30%',
        height: '36%',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box'
      },
      withinCom_EntryCall_Info_: {
        width: '40%',
        height: '30%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
      },
      withinCom_EntryCall_Info_Date_: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '1% 0',
        fontSize: '2.2rem',
        letterSpacing: '0.2rem',
        fontWeight: '400',
        textAlign: 'left',
        color: '#222222'
      },
      withinCom_EntryCall_logo_: {
        display: 'inline-block',
        position: 'absolute',
        top:'40%',
        left: '0%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        fontSize: '3rem',
        fontWeight: '700',
        letterSpacing: '0.5rem'
      },
      withinCom_EntryCall_div_User_: {
        display: 'inline-block',
        width: '40%',
        height: '40%',
        position: 'absolute',
        top:'40%',
        left: '60%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        fontSize: '2.2rem',
        fontWeight: '400',
        letterSpacing: '0.2rem',
        textAlign: 'center'
      }
    }
  }

  _handleClick_selfEntrance(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/overview');
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
          style={this.style.withinCom_EntryCall_div_User_}>
          <div
            style={{width: '100%', position: 'absolute', top: '50%', transform: 'translate(0, -50%)', cursor: 'pointer'}}
            onClick={this._handleClick_selfEntrance}>
            {this.props.userInfo.account}
          </div>
        </div>
        <div
          style={this.style.withinCom_EntryCall_Info_}>
          <div
            style={this.style.withinCom_EntryCall_Info_Date_}>
            <span>{(this.dateObj.getMonth()+1)+' ﹒'}</span>
            <span>{this.dateObj.getDate()+' ﹒'}</span>
            <span>{this.dateObj.getFullYear()}</span>
          </div>
        </div>
        <div
          style={this.style.withinCom_EntryCall_CreateShare_}>
          <img src="/images/vacancy.png" style={{width: '100%', maxHeight: '100%'}}/>
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
