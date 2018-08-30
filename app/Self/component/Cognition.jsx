import React from 'react';
import CogStorage from './CogStorage.jsx';
import CogMutual from './CogMutual.jsx';
import CogToday from './CogToday.jsx';

export default class Cognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_Cognition =this._render_Cognition.bind(this);
    this.style={
      selfCom_Cognition_: {
        width: '100%',
        minHeight: '100vh',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  _render_Cognition(){
    switch (this.props.focus) {
      case "storage":
        return (
          <CogStorage
            range={this.props.range}
            _set_Range={this.props._set_Range}/>
        )
        break;
      case "mutual":
        return (
          <CogMutual
            range={this.props.range}
            _set_Range={this.props._set_Range}/>
        )
        break;
      case "today":
        return (
          <CogToday/>
        )
        break;
      default:
        return (
          <CogToday/>
        )
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Cognition_}>
        {this._render_Cognition()}
      </div>
    )
  }
}
