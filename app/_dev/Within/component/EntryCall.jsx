import React from 'react';
import cxBind from 'classnames/bind';
import CreateShare from '../../Component/CreateShare.jsx';

export default class EntryCall extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.dateObj = new Date();
    this._render_getDay = this._render_getDay.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      withinCom_EntryCall_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      withinCom_EntryCall_welcome_: {
        width: '68%',
        height: '40%',
        position: 'absolute',
        top: '35%',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '11.5vh',
        letterSpacing: '0.8vh',
        fontWeight: '700',
        color: '#222222'
      },
      withinCom_EntryCall_rectangle_: {
        width: '25%',
        height: '50%',
        position: 'absolute',
        bottom: '10%',
        right: '0',
        boxSizing: 'border-box'
      },
      withinCom_EntryCall_rectangle_CreateShare_: {
        width: '100%',
        height: '40%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2% 0'
      },
      withinCom_EntryCall_rectangle_Info_: {
        width: '100%',
        height: '56%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
      },
      withinCom_EntryCall_rectangle_Info_Day: {
        width: '30%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '5vh',
        letterSpacing: '0.6vh',
        fontWeight: '700',
        writingMode: 'vertical-lr',
        color: '#222222'
      },
      withinCom_EntryCall_rectangle_Info_Place: {
        width: '70%',
        height: '54%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        fontSize: '3.2vh',
        letterSpacing: '0.4vh',
        textAlign: "right",
        color: '#222222'
      },
      withinCom_EntryCall_rectangle_Info_Date_: {
        width: '70%',
        height: '40%',
        position: 'absolute',
        bottom: '6%',
        right: '0%',
        boxSizing: 'border-box',
        padding: '1% 0',
        fontSize: '3vh',
        letterSpacing: '0.3vh',
        textAlign: 'right',
        color: '#222222'
      }
    }
  }

  _render_getDay(dateObj){
    switch (dateObj.getDay()) {
      case 0:
        return "SUN"
        break;
      case 1:
        return "MON"
        break;
      case 2:
        return "TUE"
        break;
      case 3:
        return "WED"
        break;
      case 4:
        return "THU"
        break;
      case 5:
        return "FRI"
        break;
      case 6:
        return "SAT"
        break;
      default:
        return "SUN"
    }
  }

  _submit_Share_New(dataObj){
    window.location.assign('/self/units?id=userid');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_EntryCall_}>
        <div
          style={this.style.withinCom_EntryCall_welcome_}>
          <span style={{display: "block", position: 'absolute', bottom:'0'}}>{"Welcome Back"}</span>
        </div>
        <div
          style={this.style.withinCom_EntryCall_rectangle_}>
          <div
            style={this.style.withinCom_EntryCall_rectangle_Info_}>
            <span style={this.style.withinCom_EntryCall_rectangle_Info_Day}>{this._render_getDay(this.dateObj)}</span>
            <span style={this.style.withinCom_EntryCall_rectangle_Info_Place}>{"Taipei City"}</span>
            <div
              style={this.style.withinCom_EntryCall_rectangle_Info_Date_}>
              <span>{(this.dateObj.getMonth()+1)+' ﹒'}</span>
              <span>{this.dateObj.getDate()+' ﹒'}</span>
              <span>{this.dateObj.getFullYear()}</span>
            </div>
          </div>
          <div
            style={this.style.withinCom_EntryCall_rectangle_CreateShare_}>
            <img src="/vacancy.png" style={{width: '100%', maxHeight: '100%'}}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}/>
          </div>
        </div>
      </div>
    )
  }
}
