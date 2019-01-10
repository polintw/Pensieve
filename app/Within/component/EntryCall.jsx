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
        textAlign: 'center',
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1242 175"
            style={{
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            preserveAspectRatio="none">
            <defs><style>{".cls-1{fill:#fff;}.cls-2{fill:#494949;}.cls-3{fill:none;stroke:#000;stroke-miterlimit:10;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2"><g id="圖層_1-2" data-name="圖層 1">
              <rect class="cls-1" x="0.25" y="0.25" width="1241.5" height="174.5" rx="58.75" ry="58.75"/>
              <path class="cls-2" d="M1183,.5A58.56,58.56,0,0,1,1241.5,59v57a58.56,58.56,0,0,1-58.5,58.5H59A58.56,58.56,0,0,1,.5,116V59A58.56,58.56,0,0,1,59,.5H1183m0-.5H59A59.17,59.17,0,0,0,0,59v57a59.17,59.17,0,0,0,59,59H1183a59.17,59.17,0,0,0,59-59V59a59.17,59.17,0,0,0-59-59Z"/>
              <line class="cls-3" x1="97" y1="132.5" x2="968.5" y2="132.5"/>
            </g></g>
          </svg>
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
