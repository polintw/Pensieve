import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ViewerBlock from '../../OpenedMark/MarkBlocks/ViewerBlock/ViewerBlock.jsx';
import OpenedMark from '../../OpenedMark/OpenedMark.jsx';
import SvgCircle from '../../../Components/Svg/SvgCircle.jsx';

class MarksLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_markJump = this._set_markJump.bind(this);
    this._render_SpotsorMark = this._render_SpotsorMark.bind(this);
    this._handleClick_ImgLayer_circle = this._handleClick_ImgLayer_circle.bind(this);
    this._handleClick_SpotsLayer = this._handleClick_SpotsLayer.bind(this);
  }

  _handleClick_ImgLayer_circle(event){
    event.preventDefault();
    event.stopPropagation();
    let markKey = this.props.markOpened ? (false) : (event.currentTarget.getAttribute('id'));
    if(!markKey) markKey = false; //prevent "undefined" situation
    this.props._set_Markvisible(markKey);
  }

  _handleClick_SpotsLayer(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_spotsVisible();
  }

  _set_markJump(direction, currentSerial){
    let markKey;
    switch (direction) {
      case 'next':
        markKey = this.props.marksData.list[(currentSerial+1)];
        this.props._set_Markvisible(markKey);
        break;
      case 'previous':
        markKey = this.props.marksData.list[(currentSerial-1)];
        this.props._set_Markvisible(markKey);
        break;
      case 'continue':
        this.props._set_layerstatus();
        break;
      default:
        return
    }
  }

  _render_SpotsorMark(){
    //already order the list by serial records when mount at Unit
    // 'currentMark' would be: #id of a mark/ 'all'/ 'first'
    // only #id would be incl. in 'props.marksData.list'
    let currentSerial = this.props.marksData.list.indexOf(this.props.currentMark);
    if(this.props.currentMark == 'first') currentSerial = 0;

    //there are two possibility for currentSerial='-1': 'all' or not in this 'layer'
    //So it's important to check currentSerial when markOpened,
    //because we don't open anything if the id is not belong to this layer
    if(this.props.markOpened && currentSerial>(-1)){
      let markKey = this.props.currentMark;
      return (
        <OpenedMark
          key={
            /*Important!! This key, was the 'key' point to 'refresh the ViewerBlock to the bottom', the way to update DraftDisplay,
            especially during the 'jump'.
            */
            "key_OpenedMark_" + markKey}
          {...this.props}
          serial={currentSerial+1}
          currentSerial={currentSerial}
          notify={false}
          editingModal = {false}
          _handleClick_ImgLayer_circle={this._handleClick_ImgLayer_circle}>
          <ViewerBlock
            {...this.props}
            currentSerial={currentSerial}
            markKey={markKey}
            marksLength={this.props.marksData.list.length}
            markData={this.props.marksData.data[markKey]}
            _set_markJump={this._set_markJump}/>
        </OpenedMark>
      );
    }
    else{
      const self = this,
      imgWidth = this.props.imgWidthHeight.width,
      imgHeight = this.props.imgWidthHeight.height;

      let circlesArr = self.props.marksData.list.map(function(id, index){
        const markData = self.props.marksData.data[id];
        const coordinate = {top: markData.top, left: markData.left};
        return (
          <div
            id={id}
            key={"key_Mark_Circle_"+index}
            className={classnames('boxMarkSpot')}
            style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
            onClick={self._handleClick_ImgLayer_circle}>
            <SvgCircle
              serial={index+1}
              notify={false}
              current={(currentSerial==markData.serial)? true :false}/>
          </div>
        )
      });
      return (
        <div
          className={classnames('boxImgPosition')}
          onClick={this._handleClick_SpotsLayer}
          style={{
            width: imgWidth,
            height: imgHeight}}>
            {
              this.props.spotsVisible && //this is the way we 'switch' spotsLayer
              circlesArr
            }
        </div>
      );
    }
  }

  render(){
    return(
      <div>
        { this._render_SpotsorMark() }
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
)(MarksLayer);
