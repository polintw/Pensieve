import React from 'react';
import SvgBell from '../../../Component/Svg/SvgBell.jsx';

const generalStyle = { //could included in a global style sheet
  boxRelativeFull: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box'
  }
};

const styleMiddle = {
  boxBell: {
    width: '6%',
    position: "absolute",
    boxSizing: 'border-box',
    right: '6.4%',
    top:'50%',
    transform: 'translate(0,-39%)',
    cursor: 'pointer'
  }
};

export default class NotifyBell extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <div
        style={generalStyle.boxRelativeFull}>
        <div
          style={styleMiddle.boxBell}>
          <SvgBell/>
        </div>
      </div>
    )
  }
}
