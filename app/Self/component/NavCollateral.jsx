import React from 'react';
import cxBind from 'classnames/bind';

export default class NavCollateral extends React.Component {
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
        style={this.style.selfCom_NavCollateral_}>
        {'系列'}
        {'通知'}
      </div>
    )
  }
}
