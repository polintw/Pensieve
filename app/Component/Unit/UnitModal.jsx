import React from 'react';
import UnitLayerFrame from './UnitLayerFrame.jsx';
import UnitLayerControl from './UnitLayerControl.jsx';
import UnitActionControl from './UnitActionControl.jsx';
import {DateConverter, NounsExtensible} from './UnitComponent.jsx';
import {AuthorPlate} from '../AccountPlate.jsx';

export default class UnitModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      layer: this.props.unitInit.layer,
      marksify: this.props.unitInit.marksify
    };
    this._set_makrsVisible = (bool) => {this.setState({marksify: bool});};
    this._set_layer = (index) => {this.setState({layer: index});};
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._handleClick_unitBack = this._handleClick_unitBack.bind(this);
    this.style={
      Com_Modal_UnitModal: {
        width: '89%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      },
      Com_Modal_UnitModal_atRes_:{
        width: '13%',
        height: '20%',
        position: 'absolute',
        top: '60%',
        left: '1%',
        boxSizing: 'border-box',
        boxShadow: '0px 1.2vh 2.4vw 0vw',
        overflow: 'hidden'
      },
      Com_Modal_UnitModal_atRes_img: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      },
      Com_UnitModal_ImgSection_div: {
        width: '84%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_UnitModal_layerControl: {
        width: '3%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '13%',
        boxSizing: 'border-box',
        backgroundColor: '#989898'
      },
      Com_UnitModal_ControlSection_: {
        width: '13%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box'
      },
      Com_UnitModal_ControlSection_actionControl_: {
        width: '100%',
        height: '12%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_UnitModal_ControlSection_Author_: {
        width: '100%',
        height: '12%',
        position: 'absolute',
        top: '75%',
        left: '0%',
        boxSizing: 'border-box',
        cursor:'pointer'
      },
      Com_UnitModal_ControlSection_nouns_: {
        width: '100%',
        height: '50%',
        position: 'absolute',
        top: '20%',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_UnitModal_ControlSection_back_: {
        width: '20%',
        height: '10%',
        position: 'absolute',
        top: '0%',
        left: '80%'
      },
      Com_UnitModal_ControlSection_back_span: {
        display: 'inline-block',
        float: 'right',
        boxSizing: 'border-box',
        margin: '2% 5%',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      Com_UnitModal_ControlSection_DateConverter: {
        width: '80%',
        height: '12%',
        position: 'absolute',
        top: '2%',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.4rem',
        letterSpacing: '0.15rem',
        textAlign: 'center',
        fontWeight: '400',
        color: '#FAFAFA',
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
    return this.props.mode?(
      <div
        style={this.style.Com_Modal_UnitModal_atRes_}>
        <img
          style={this.style.Com_Modal_UnitModal_atRes_img}
          src={this.props.unitSet.coverSrc}/>
      </div>
    ):(
      <div
        style={this.style.Com_Modal_UnitModal}>
        <div
          style={this.style.Com_UnitModal_ControlSection_}>
          <div
            style={this.style.Com_UnitModal_ControlSection_back_}>
            <span
              style={this.style.Com_UnitModal_ControlSection_back_span}
              onClick={this._handleClick_unitBack}>
              {" X "}
            </span>
          </div>
          {
            this.props.unitSet.nouns &&
            <div
              style={this.style.Com_UnitModal_ControlSection_nouns_}>
              <NounsExtensible
                nouns={this.props.unitSet.nouns}
                _handleClick_listNoun={this._refer_toandclose}/>
            </div>
          }
          {
            this.props.unitSet.authorBasic &&
            <div
              style={this.style.Com_UnitModal_ControlSection_Author_}>
              <AuthorPlate
                authorBasic={this.props.unitSet.authorBasic}
                _handleClick_Account={this._refer_toandclose}/>
            </div>
          }
          <div
            style={this.style.Com_UnitModal_ControlSection_actionControl_}>
            <UnitActionControl
              _set_Modalmode={this.props._set_Modalmode}/>
          </div>
          <div
            style={this.style.Com_UnitModal_ControlSection_DateConverter}>
            <DateConverter
              datetime={this.props.unitSet.created}/>
          </div>
        </div>
        <div
          style={this.style.Com_UnitModal_layerControl}>
          <UnitLayerControl
            unitId={this.props.unitId}
            layer={this.state.layer}
            marks = {this.state.marksify}
            _set_makrsVisible={this._set_makrsVisible}
            _set_layer={this._set_layer}/>
        </div>
        <div
          style={this.style.Com_UnitModal_ImgSection_div}>
          <UnitLayerFrame
            layer={this.state.layer}
            marksify={this.state.marksify}
            initMark={this.props.unitInit.initMark}
            identity={this.props.unitSet.identity}
            coverSrc={this.props.unitSet.coverSrc}
            beneathSrc={this.props.unitSet.beneathSrc}
            coverMarks={this.props.unitSet.coverMarks}
            beneathMarks={this.props.unitSet.beneathMarks}/>
        </div>
      </div>
    )
  }
}
