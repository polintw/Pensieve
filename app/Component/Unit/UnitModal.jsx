import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import UnitImgLayers from './UnitImgLayers.jsx';
import UnitLayerScroll from './UnitLayerScroll.jsx';
import UnitLayerSwitch from './UnitLayerSwitch.jsx';
import UnitViewSummary from './UnitViewSummary.jsx';
import UnitAuthorSummary from './UnitAuthorSummary.jsx';

class UnitModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lockify: true,
      marksStatus: {marksify: this.props.initStatus.marksify, initMark: this.props.initStatus.initMark},
      moveCount: this.props.initStatus.layer>0 ? 100 : 0
    };
    this._set_markOpened = (bool, markKey)=>{this.setState((prevState,props)=>{return {marksStatus: {marksify: bool, initMark: markKey?markKey: "all"}};});};
    this._set_layerstatus = this._set_layerstatus.bind(this);
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
      Com_UnitModal_blocks_Scroll: {
        width: '90.6%',
        height: '99.2%',
        position: 'absolute',
        top: '0.7%',
        left: '50%',
        transform: 'translate(-48%, 0)',
        boxSizing: 'border-box'
      },
      Com_UnitModal_blocks_SumLayer_ : {
        width: '90%',
        height: '96%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#101010',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      },
      Com_UnitModal_blocks_ImgLayer_: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(196, 180, 180, 0.2)'
      },
      Com_UnitModal_blocks_SwitchBar_: {
        width: '2%',
        height: '90%',
        position: 'absolute',
        top: '0',
        right: '1%',
        boxSizing: 'border-box',
        backgroundColor: 'transparent'
      },
      Com_UnitModal_straightBack_: {
        width: '12%',
        height: '10%',
        position: 'absolute',
        top: '2%',
        right: '3%'
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

  _set_layerstatus(lockify, moveCount, marksStatus){
    this.setState((prevState, props)=>{
      return {
        lockify: lockify,
        moveCount: moveCount,
        marksStatus: marksStatus ? marksStatus: prevState.marksStatus
      }
    });
  }


  render(){
    //Notice! it's important to let the ImgLayers unmount if >200, due to we need the re-render, not just css change
    return(
      <div
        style={this.style.Com_Modal_UnitModal}
        onClick={this._handleClick_unitBack}>
        <div
          style={this.style.Com_UnitModal_blocks_Scroll}
          onClick={(event)=>{event.stopPropagation();}}>
          {
            (this.props.unitCurrent.coverSrc) ? (
              <UnitLayerScroll
                lockify={this.state.lockify}
                moveCount={this.state.moveCount}
                markOpened={this.state.marksStatus.marksify}
                _set_layerstatus={this._set_layerstatus}>
                <div
                  style={this.style.Com_UnitModal_blocks_SumLayer_}>
                  {
                    this.props.unitCurrent.identity=="author" ? (
                       //temp method, before a true AuthorSummary was created
                      <UnitAuthorSummary
                        moveCount={this.state.moveCount}
                        _set_layerstatus={this._set_layerstatus}
                        _set_Modalmode={this.props._set_Modalmode}
                        _close_modal_Unit={this.props._close_modal_Unit}
                        _refer_toandclose={this._refer_toandclose}/>
                    ):(
                      <UnitViewSummary
                        moveCount={this.state.moveCount}
                        _set_layerstatus={this._set_layerstatus}
                        _set_Modalmode={this.props._set_Modalmode}
                        _close_modal_Unit={this.props._close_modal_Unit}
                        _refer_toandclose={this._refer_toandclose}/>
                    )
                  }
                </div>
                <div
                  style={this.style.Com_UnitModal_blocks_ImgLayer_}>
                  {
                    (this.state.moveCount< 200) &&
                    <UnitImgLayers
                      lockify={this.state.lockify}
                      moveCount={this.state.moveCount}
                      marksStatus={this.state.marksStatus}
                      _set_markOpened={this._set_markOpened}
                      _set_layerstatus={this._set_layerstatus}
                      _set_Modalmode={this.props._set_Modalmode}
                      _refer_toandclose={this._refer_toandclose}/>
                  }
                </div>
                <div
                  style={this.style.Com_UnitModal_blocks_SwitchBar_}>
                  <UnitLayerSwitch
                    moveCount={this.state.moveCount}
                    _set_layerstatus={this._set_layerstatus}/>
                </div>
              </UnitLayerScroll>
            ): (
              <div
                style={this.style.Com_UnitModal_blocks_SumLayer_}></div>
            )
          }
        </div>
        <div
          style={this.style.Com_UnitModal_straightBack_}>
          <span
            style={this.style.Com_UnitModal_straightBack_span}
            onClick={this._handleClick_unitBack}>
            {" X "}
          </span>
        </div>
      </div>
    )
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
