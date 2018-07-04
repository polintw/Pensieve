import React from 'react';
import cxBind from 'classnames/bind';
import SelfComposition from './Self_Composition.jsx';

export default class Self extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      div_Base: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Self_div_pages_SelfComposition: {
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
        style={this.style.div_Base}>
        <div
          style={this.style.Self_div_pages_SelfComposition}>
          <SelfComposition/>
        </div>
      </div>
    )
  }
}
