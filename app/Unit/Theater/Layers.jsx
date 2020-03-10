import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import WrapperImg from './LayerImgs/Wrapper.jsx';

import LayerScroll from './components/LayerScroll.jsx';

class Layers extends React.Component {
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
    this._handleClick_modalBack = this._handleClick_modalBack.bind(this);
    this.style={
      Com_Layers: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0%',
        boxSizing: 'border-box',
        overflowY: 'scroll'
      },
      Com_Layers_blocks_Scroll: {
        width: '93.2%',
        minWidth: '900px',
        height: '99.2%',
        minHeight: '320px',
        position: 'absolute',
        top: '0',
        left: '4.8%',
        boxSizing: 'border-box'
      },
      Com_Layers_blocks_SumLayer_ : {
        width: '79%',
        minWidth: '840px',
        height: '95%',
        minHeight: '300px',
        position: 'absolute',
        top: '1%',
        left: '50%',
        transform: 'translate(-48%, 0)',
        boxSizing: 'border-box'
      },
      Com_Layers_blocks_ImgLayer_: {
        width: '96.8%',
        height: '100%',
        position: 'absolute',
        boxSizing: 'border-box',
      },
    }
  }

  _refer_toandclose(source, identity){
    this.props._refer_von_unit(identity, source);
    this.props._close_theater();
  }

  _handleClick_modalBack(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._close_theater();
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
    return (
      <div
        style={this.style.Com_Layers_blocks_ImgLayer_}>
        <WrapperImg
          lockify={this.state.lockify}
          moveCount={this.state.moveCount}
          marksStatus={this.state.marksStatus}
          _set_markOpened={this._set_markOpened}
          _set_layerstatus={this._set_layerstatus}
          _set_Modalmode={this.props._set_Modalmode}
          _refer_toandclose={this._refer_toandclose}/>
      </div>
    )
    /*

    Beneath, are the remain of the complete version,
    which has Summary layer.
    We just ignore it in simplified ver.

    if(this.state.moveCount< 200) {

    }else{
      return (
        <div
          style={this.style.Com_Layers_blocks_SumLayer_}>
          {
            this.props.unitCurrent.identity=="author" ? (
               //temp method, before a true AuthorSummary was created
              <UnitAuthorSummary
                moveCount={this.state.moveCount}
                _set_layerstatus={this._set_layerstatus}
                _set_Modalmode={this.props._set_Modalmode}
                _refer_toandclose={this._refer_toandclose}/>
            ):(
              <UnitViewSummary
                moveCount={this.state.moveCount}
                _set_layerstatus={this._set_layerstatus}
                _set_Modalmode={this.props._set_Modalmode}
                _refer_toandclose={this._refer_toandclose}/>
            )
          }
        </div>
      )
    }*/
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //check if the Modal should be cloed by Count
    if(this.state.moveCount> 201) this.props._close_theater();
    /*
    Beneath, are the remain of the complete version,
    which has Summary layer.
    We have to close the theater earlier due to the lack of Summary layer.

    if(this.state.moveCount> 250) this.props._close_theater();
    */
  }


  render(){
    //Notice! it's important to let the WrapperImg unmount if >200, due to we need the re-render, not just css change
    return(
      <div
        style={this.style.Com_Layers}
        onClick={this._handleClick_modalBack}>
        <div
          style={this.style.Com_Layers_blocks_Scroll}
          onClick={(event)=>{event.stopPropagation();}}>
          {
            (this.props.unitCurrent.coverSrc) ? (
              <LayerScroll
                lockify={this.state.lockify}
                moveCount={this.state.moveCount}
                markOpened={this.state.marksStatus.marksify}
                _set_layerstatus={this._set_layerstatus}>
                {this._render_ScrollLayers()}

              </LayerScroll>
            ): (
              <div
                style={this.style.Com_Layers_blocks_SumLayer_}>
                <div
                  style={{backgroundColor:'#F0F0F0',width: '20%', height: '20%', position: 'absolute', top: '40%', left: '40%'}}/>
              </div>
            )
          }
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
)(Layers));
