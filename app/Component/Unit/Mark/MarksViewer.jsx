import React from 'react';
import { connect } from "react-redux";
import ViewerBlock from './ViewerBlock.jsx';
import SvgCircle from '../../Svg/SvgCircle.jsx';
import SvgCircleSpot from '../../Svg/SvgCircleSpot.jsx';
import {widthDivisionRatial} from '../../config/styleParams.js'; //dividing markglayer width, used for determineing the position
import OpenedMark from '../../../OpenedMark.jsx';

const generalStyle = { //could included in a global style sheet
  absolute_FullVersion: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left:'0',
    boxSizing: 'border-box'
  }
}

class MarksViewer extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.Com_ImgLayer=React.createRef();
    this._render_SpotsorMark = this._render_SpotsorMark.bind(this);
    this._handleClick_ImgLayer_circle = this._handleClick_ImgLayer_circle.bind(this);
    this._handleClick_SpotsLayer = this._handleClick_SpotsLayer.bind(this);
    this.style = {

    };
  }

  _handleClick_ImgLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let param = this.props.markOpened ? (false) : (event.currentTarget.getAttribute('id'));
    this.props._set_Markvisible(param);
  }

  _handleClick_SpotsLayer(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_spotsVisible();
  }

  _render_SpotsorMark(){
    if(this.props.markOpened && (this.props.marksData.list.indexOf(this.props.currentMark) > (-1))){
      return (
        <OpenedMark
          {...this.props}
          widthDivisionRatial={widthDivisionRatial}
          _handleClick_ImgLayer_circle={this._handleClick_ImgLayer_circle}>
          <ViewerBlock
            markKey={this.props.currentMark}
            markData={this.props.marksData.data[this.props.currentMark]}/>
        </OpenedMark>
      );
    }else{
      const self = this,
      imgWidth = this.props.imgWidthHeight.width,
      imgHeight = this.props.imgWidthHeight.height;

      let circlesArr = self.props.marksData.list.map(function(id, index){
        const coordinate = {top: self.props.marksData.data[id].top, left: self.props.marksData.data[id].left};
        return self.props.unitCurrent.marksInteraction[id].notify ? (
          <div
            id={id}
            key={"key_Mark_Circle_"+index}
            className={'circleMarkSpotSvg'}
            style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
            onClick={self._handleClick_ImgLayer_circle}>
            <SvgCircleSpot/>
          </div>
        ):(
          <div
            id={id}
            key={"key_Mark_Circle_"+index}
            className={'circleMarkSpotSvg'}
            style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
            onClick={self._handleClick_ImgLayer_circle}>
            <SvgCircle/>
          </div>
        )
      });
      return (
        <div
          className={'boxImgPosition'}
          style={{
            width: imgWidth,
            height: imgHeight,
            right: this.props.baseHorizonRatial+'%',
            transform: 'translate('+this.props.baseHorizonRatial+'%,-50%)'}}>
            {circlesArr}
        </div>
      );
    }
  }

  render(){
    return(
      <div
        style={generalStyle.absolute_FullVersion}
        ref={this.Com_ImgLayer}
        onClick={this._handleClick_SpotsLayer}>
        {
          this.props.spotsVisible &&
          this._render_SpotsorMark()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(MarksViewer);
