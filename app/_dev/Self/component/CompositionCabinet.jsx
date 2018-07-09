import React from 'react';
import CabinetShared from './CabinetShared.jsx';
import CabinetCollection from './CabinetCollection.jsx';

export default class CompositionCabinet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cabinet: 'shared'
    };
    this._render_Cabinet =this._render_Cabinet.bind(this);
    this._set_cabinet = this._set_cabinet.bind(this);
    this.style={
      selfCom_CCabinet_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      }
    }
  }

  _set_cabinet(tab){
    if(tab !== this.state.cabinet){
      this.setState({cabinet: tab});
    }
  }

  _render_Cabinet(){
    switch (this.state.cabinet) {
      case "shared":
        return (
          <CabinetShared
            _set_cabinet={this._set_cabinet}/>
        )
        break;
      case "collection":
        return (
          <CabinetCollection
            _set_cabinet={this._set_cabinet}/>
        )
        break;
      default:
        return (
          <CabinetShared
            _set_cabinet={this._set_cabinet}/>
        )
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CCabinet_}>
        {this._render_Cabinet()}
      </div>
    )
  }
}
