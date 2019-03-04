import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import UnitImgLayers from './UnitImgLayers.jsx';
import UnitLayerScroll from './UnitLayerScroll.jsx';

class UnitModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lockify: true,
      moveCount: this.props.unitInit.layer>0 ? 100 : 0,
    };
    this._set_layerstatus = (lockify, moveCount) => {this.setState({lockify: lockify, moveCount: moveCount});};
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_unitBack = this._handleClick_unitBack.bind(this);
    this.style={
      Com_Modal_UnitModal: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_UnitModal_straightBack_: {
        width: '12%',
        height: '10%',
        position: 'absolute',
        top: '2%',
        right: '5%'
      },
      Com_UnitModal_straightBack_span: {
        display: 'inline-block',
        float: 'right',
        boxSizing: 'border-box',
        margin: '2% 5%',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  }

  _refer_toandclose(source, identity){
    this.props._refer_von_unit(identity, source);
    this.props._close_modal_Unit();
  }

  _handleClick_unitBack(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._close_modal_Unit();
  }


  render(){
    <div
      style={this.style.Com_Modal_UnitModal}
      onClick={this._handleClick_unitBack}>
      <UnitLayerScroll
        lockify={this.state.lockify}
        moveCount={this.state.moveCount}
        _set_layerstatus={this._set_layerstatus}/>
      {
        (this.state.moveCount< 200) &&
        <UnitImgLayers/>
      }
      <div
        style={this.style.Com_UnitModal_straightBack_}>
        <span
          style={this.style.Com_UnitModal_straightBack_span}
          onClick={this._handleClick_unitBack}>
          {" X "}
        </span>
      </div>
    </div>
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(UnitModal));
