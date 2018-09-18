import React from 'react';
import Statics from './component/Statics.jsx';

export default class FrontStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_statics_return = this._handleClick_statics_return.bind(this);
    this.style={
      Front_Statics_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      Front_Statics_return_: {
        width: '6%',
        height: '6%',
        position: 'absolute',
        top: '80%',
        right: '9%',
        boxSizing: 'border-box',
        border: '1px solid black',
        borderRadius: '1rem',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem',
        color: '#222222',
        cursor: 'pointer'
      },
      Front_Statics_scroll_: {
        width: '68%',
        position: 'absolute',
        top: '0',
        left: '15%',
        boxSizing: 'border-box'
      }
    }
  }

  _handleClick_statics_return(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_frontPage("Statics");
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Front_Statics_}>
        <div
          style={this.style.Front_Statics_return_}
          onClick={this._handleClick_statics_return}>
          {"return"}
        </div>
        <div
          style={this.style.Front_Statics_scroll_}>
          <Statics
            userBasic={this.props.userBasic}/>
        </div>
      </div>
    )
  }
}
