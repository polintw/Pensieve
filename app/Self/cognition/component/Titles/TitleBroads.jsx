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
      selfCom_Title_Inspired_main_: {
        fontWeight: '700',
        fontSize: '2.8rem',
        letterSpacing: '0.54rem'
      },
    }
  }

  render(){
    return(
      <div>
        <div
          style={this.style.selfCom_Title_Inspired_main_}>
          <span>{"Broads"}</span>
        </div>
      </div>
    )
  }
}
