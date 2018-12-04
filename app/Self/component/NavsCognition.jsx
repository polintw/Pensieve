import React from 'react';
import cxBind from 'classnames/bind';
import NavFront from './NavFront.jsx';

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavsCognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_Front_: {
        width: '12%',
        height: '48%',
        position: 'absolute',
        top: '0%',
        left: '24%',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavsCognition_}>
        <div
          style={this.style.selfCom_NavsCognition_Front_}>
          <NavFront {...this.props}/>
        </div>
      </div>
    )
  }
}
