import React from 'react';
import cxBind from 'classnames/bind';
import Shared from 'Self_Shared.jsx';

export default class Self extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      div_Base: {
        width: "100%",
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      div_Nav: {
        width: '76%',
        height: '15%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)'
      },
      div_Pages: {
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
        <div>
          {"Corner"}
        </div>
        <div
          style={this.style.div_Nav}>
          <span>{'周柏霖'}</span>
          <span>{'icon'}</span>
          <span>{'icon'}</span>
          <span>{'icon'}</span>
        </div>
        <div
          style={this.style.div_Pages}>
          <Shared/>
        </div>
        <div>
          <span>{'-'}</span>
          <span>{'X'}</span>
        </div>
      </div>
    )
  }
}
