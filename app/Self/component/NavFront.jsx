import React from 'react';
import cxBind from 'classnames/bind';

export default class NavFront extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavFront_}>
        {'靜態'}
        {'未來'}
      </div>
    )
  }
}
