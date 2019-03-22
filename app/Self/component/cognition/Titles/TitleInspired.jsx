import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

export default class TitleInspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_Title_Inspired_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Title_Inspired_main_: {
        display: 'inline-block',
        width: '36%',
        float: 'left',
        boxSizing: 'border-box',
        margin: '0 3%',
        fontWeight: '700',
        fontSize: '2.8rem',
        letterSpacing: '0.54rem'
      },
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_Title_Inspired_}>
        <div
          style={this.style.selfCom_Title_Inspired_main_}>
          {"Inspired"}
        </div>
      </div>
    )
  }
}
