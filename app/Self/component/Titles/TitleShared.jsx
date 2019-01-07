import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

export default class TitleShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogActions_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogActions_main_: {
        display: 'inline-block',
        width: '36%',
        float: 'left',
        boxSizing: 'border-box',
        margin: '0 5%',
        fontWeight: '700',
        fontSize: '3rem',
        letterSpacing: '0.6rem'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogActions_}>
        <div
          style={this.style.selfCom_CogActions_main_}>
          {"Shared"}
        </div>
        <div style={{display: 'inline-block', float: 'right', boxSizing: 'border-box', margin: '0 5%'}}>
          <p style={{fontStyle: 'italic',fontSize: '1.4rem', letterSpacing: '0.15rem'}}>{"share your own, release your power"}</p>
        </div>
      </div>
    )
  }
}
