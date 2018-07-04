import React from 'react';
import CabinetShared from './CabinetShared.jsx';

export default class CompositionCabinet extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CCabinet_: {
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
        style={this.style.selfCom_CCabinet_}>
        <CabinetShared/>
      </div>
    )
  }
}
