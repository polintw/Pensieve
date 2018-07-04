import React from 'react';
import cxBind from 'classnames/bind';

export default class LtdUnits extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      withinCom_LtdUnits_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_LtdUnits_}>
        
      </div>
    )
  }
}
