import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import UnitImgLayers from './UnitImgLayers.jsx';
import UnitLayerScroll from './UnitLayerScroll.jsx';
import UnitViewSummary from './UnitViewSummary.jsx';
import UnitAuthorSummary from './UnitAuthorSummary.jsx';
import UnitLayerSwitch from './UnitLayerSwitch/UnitLayerSwitch.jsx';

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
    this._render_ScrollLayers = this._render_ScrollLayers.bind(this);
    this._handleClick_unitBack = this._handleClick_unitBack.bind(this);
    this.style={
      Com_Modal_UnitModal: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0%',
        boxSizing: 'border-box',
        overflowY: 'scroll'
      },
      Com_UnitModal_blocks_Scroll: {
        width: '93.2%',
        minWidth: '900px',
        height: '99.2%',
        minHeight: '320px',
        position: 'absolute',
        top: '0',
        left: '4.8%',
        boxSizing: 'border-box'
      },
      Com_UnitModal_blocks_SumLayer_ : {
        width: '78%',
        minWidth: '840px',
        height: '95%',
        minHeight: '300px',
        position: 'absolute',
        top: '0',
        left: '49%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box'
      },
      Com_UnitModal_blocks_ImgLayer_: {
        width: '96.8%',
        height: '100%',
        position: 'absolute',
        boxSizing: 'border-box',
      },
      Com_UnitModal_blocks_SwitchBar_: {
        width:'1.6%',
        height:'100%',
        position: 'absolute',
        right: '0',
        overflow:'visible'
      },
      Com_UnitModal_straightBack_: {
        display:'flex',
        justifyContent:'space-around',
        width: '2rem',
        height: '5%',
        position: 'absolute',
        top: '2%',
        right: '1.4%',
        fontSize:'1.23rem',
        fontWeight: '500',
        color: '#F0F0F0',
        cursor:'pointer'
      },
      Com_UnitModal_straightBack_span: {
        boxSizing: 'border-box',
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

  _render_ScrollLayers(){
    return (this.state.moveCount< 200) ? (
      <div
        style={this.style.Com_UnitModal_blocks_ImgLayer_}>
        <UnitImgLayers
          lockify={this.state.lockify}
          moveCount={this.state.moveCount}
          marksStatus={this.state.marksStatus}
          _set_markOpened={this._set_markOpened}
          _set_layerstatus={this._set_layerstatus}
          _set_Modalmode={this.props._set_Modalmode}
          _refer_toandclose={this._refer_toandclose}/>
      </div>
    ): (
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
    )

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
                {this._render_ScrollLayers()}
                <div
                  style={this.style.Com_UnitModal_blocks_SwitchBar_}>
                  <UnitLayerSwitch
                    moveCount={this.state.moveCount}
                    _set_layerstatus={this._set_layerstatus}/>
                </div>
              </UnitLayerScroll>
            ): (
              <div
                style={this.style.Com_UnitModal_blocks_SumLayer_}>
                <div
                  style={{backgroundColor:'#F0F0F0',width: '20%', height: '20%', position: 'absolute', top: '40%', left: '40%'}}/>
              </div>
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
