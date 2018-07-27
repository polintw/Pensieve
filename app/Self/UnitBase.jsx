import React from 'react';
import cxBind from 'classnames/bind';
import UnitBaseComposition from './UnitBase_Composition.jsx';

export default class UnitBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Self_pages_UnitBase_: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Self_pages_UnitBase_Composition: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        overflow: 'auto'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Self_pages_UnitBase_}>
        <div
          style={this.style.Self_pages_UnitBase_Composition}>
          <UnitBaseComposition/>
        </div>
      </div>
    )
  }
}
