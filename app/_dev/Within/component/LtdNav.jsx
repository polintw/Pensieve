import React from 'react';
import cxBind from 'classnames/bind';
import CreateShare from '../../Component/CreateShare.jsx';

export default class LtdNav extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleClick_selfEntrance = this._handleClick_selfEntrance.bind(this);
    this.style={
      withinCom_LtdNav_: {
        width: '100%',
        height: '100%',
        position: 'absolute'
      },
      withinCom_LtdNav_logo_: {
        width: '16%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '18%',
        boxSizing: 'border-box',
        fontSize: '4vh',
        letterSpacing: '0.5vh',
        color: '#FAFAFA'
      },
      withinCom_LtdNav_div_: {
        width: '25%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '18%',
        boxSizing: 'border-box',
        color: '#FAFAFA'
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
      withinCom_LtdNav_div_CreateShare_: {
        display: 'inline-block',
        width: '30%',
        height: '100%',
        position: 'relative',
        float: 'right',
        boxSizing: 'border-box'
      }
    }
  }

  _handleClick_selfEntrance(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user');
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user');
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_LtdNav_}>
        <div
          style={this.style.withinCom_LtdNav_logo_}>
          {"CORNER"}
        </div>
        <div
          style={this.style.withinCom_LtdNav_div_}>
          <span style={{display: 'inline-block', width: '20%', height: '100%', position: 'relative', float: 'right'}}>{"。。"}</span>
          <div
            style={this.style.withinCom_LtdNav_div_CreateShare_}>
            <img src="/vacancyWhite.png" style={{width: '100%', height: '100%'}}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}/>
          </div>
          <div
            style={this.style.withinCom_LtdNav_div_User_}>
            <div
              style={{width: '100%', position: 'absolute', top: '50%', transform: 'translate(0, -50%)', cursor: 'pointer'}}
              onClick={this._handleClick_selfEntrance}>
              {"Berlin"}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
