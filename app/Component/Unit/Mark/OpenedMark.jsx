import React from 'react';
import { connect } from "react-redux";
import SvgCircle from '../../Svg/SvgCircle.jsx';

const commonStyle = {
  absolute_FullVersion: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left:'0',
    boxSizing: 'border-box'
  }
}

class OpenedMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style = {
      Com_ImgLayer_MarkBlock_: {
        maxHeight: '64%',
        minHeight: '30%',
        position: 'absolute'
      }
    };
  }

  render(){
    const markId = this.props.currentMark,
          imgWidth = this.props.imgWidthHeight.width,
          imgHeight = this.props.imgWidthHeight.height,
          imgLeft=this.props.imgPosition.left;
    const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
    let [left, right, top, bottom, width] = ['','','','', ''],
        spotLeftPx = coordinate.left/100*imgWidth+imgLeft+imgWidth*(this.props.baseHorizonRatial/100);
        //the position of circle relative to img, position img original at in the frame, and transform/translate we set
        //--- due to offsetLeft wouldn't take the transform property

    width = ((this.props.widthDivisionRatial/2)-2.4)/this.props.widthDivisionRatial*100;
    (spotLeftPx) > (this.props.boxWidth/2) ? ( //check which side of the box the circle at
      right = this.props.boxWidth-(spotLeftPx)+this.props.boxWidth/this.props.widthDivisionRatial //if circle st the right side, put the box 'left' to the circle
    ): (
      left = spotLeftPx+this.props.boxWidth/this.props.widthDivisionRatial
    );
    coordinate.top > 50 ? ( //move between 0 - 28%, depend on location
      bottom = (28 - ((coordinate.top-50)/50) * (28-3)) + '%'
    ):(
      top = (3 + (coordinate.top/50) * (28-3)) + '%'
    );

    return (
      <div>
        <div
          style={commonStyle.absolute_FullVersion}
          onClick={this.props._handleClick_ImgLayer_circle}/>
        <div
          className={'boxImgPosition'}
          style={{
            width: imgWidth,
            height: imgHeight,
            right: this.props.baseHorizonRatial+'%',
            transform: 'translate('+this.props.baseHorizonRatial+'%,-50%)',
            backgroundColor: 'rgba(30, 30, 30, 0.2)'
          }}
          onClick={this.props._handleClick_ImgLayer_circle}>
            <div
              id={markId}
              className={'circleMarkSpotSvg'}
              style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
              onClick={this.props._handleClick_ImgLayer_circle}>
              <SvgCircle/>
            </div>
        </div>
        <div
          style={Object.assign({
            top: top,
            left: left,
            right: right,
            bottom: bottom,
            width: width+"%"}, this.style.Com_ImgLayer_MarkBlock_)}>
            {this.props.children}
        </div>
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
)(OpenedMark);
