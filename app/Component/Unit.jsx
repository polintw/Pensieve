import React from 'react';
import {
  Link,
  Redirect
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import UnitModal from './UnitModal.jsx';
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';

export default class Unit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      close: false
    };
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={

    };
  }

  _close_modal_Unit(){
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    if(this.state.close){return <Redirect to={this.props.location.state.from}/>}

    return(
      <ModalBox containerId="root">
        <ModalBackground onClose={this._close_modal_Unit} style={{position: "fixed"}}>
          <UnitModal
            unitId={this.props.match.params.id}
            unitInit={this.props._construct_UnitInit(this.props.match, this.props.location)}
            _close_modal_Unit={this._close_modal_Unit}
            _refer_von_unit={this.props._refer_von_unit}/>
        </ModalBackground>
      </ModalBox>
    )
  }
}
