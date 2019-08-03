import React from 'react';
import { connect } from "react-redux";
import {
  baseHorizonRatial,
  widthDivisionRatial
} from './config/styleParams.js';
import SvgCircle from './Svg/SvgCircle.jsx';

const styleMiddle = {
  absolute_FullVersion: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left:'0',
    boxSizing: 'border-box'
  },
  Com_ImgLayer_MarkBlock_: {
    position: 'absolute',
    boxShadow: '0 0 2px 0',
    overflow: 'hidden'
  }
}

const _render_CircleGroup = (props, coordinate)=> {
  return (
    <div
      id={props.currentMark}
      className={'circleMarkSpotSvg'}
      style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
      onClick={props._handleClick_ImgLayer_circle}>
      <SvgCircle
        current={false}
        notify={props.notify}
        serial={props.serial}/>
    </div>
  )
}

class OpenedMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style = {
      dependent_radius_Bottom: {
        borderBottomLeftRadius: '3%',
        borderBottomRightRadius: '3%'
      },
      dependent_radius_Top: {
        borderTopLeftRadius: '3%',
        borderTopRightRadius: '3%'
      }
    };
  }

  render(){
    const markId = this.props.currentMark,
          imgWidth = this.props.imgWidthHeight.width,
          imgHeight = this.props.imgWidthHeight.height,
          imgLeft=this.props.imgPosition.left;
    const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
    let [left, right, top, bottom, width, radiusObj] = ['','','','', '', ''],
        spotLeftPx = coordinate.left/100*imgWidth+imgLeft+imgWidth*(baseHorizonRatial/100);
        //the position of circle relative to img, position img original at in the frame, and transform/translate we set
        //--- due to offsetLeft wouldn't take the transform property

    width = ((widthDivisionRatial/2)-(1.7+2.3))/widthDivisionRatial*100;
    (spotLeftPx) > (this.props.boxWidth/2) ? ( //check which side of the box the circle at
      right = this.props.boxWidth-(spotLeftPx)+1.7*(this.props.boxWidth/widthDivisionRatial) //if circle st the right side, put the box 'left' to the circle
    ): (
      left = spotLeftPx+1.7*(this.props.boxWidth/widthDivisionRatial)
    );
    if(coordinate.top > 50){
      bottom = 0; radiusObj=this.style.dependent_radius_Top
    }else{top = 0 ; radiusObj=this.style.dependent_radius_Bottom}

    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, { toCircleLeft: right > 0? true : false, downToMdidline: bottom.length>0 ? true:false })
    );// because we want to pass left/right status as props to Block, we need to add from here

    return (
      <div>
        <div
          style={styleMiddle.absolute_FullVersion}
          onClick={this.props._handleClick_ImgLayer_circle}/>
        <div
          className={'boxImgPosition'}
          style={{
            width: imgWidth,
            height: imgHeight,
            right: baseHorizonRatial+'%',
            transform: 'translate('+baseHorizonRatial+'%,-50%)',
            backgroundImage: 'radial-gradient(ellipse at '+
              (coordinate.left+ (right > 0?6:(-6)))+
              '% '+
              (coordinate.top+ (top > 0? 12: (-12)))+
              '%, rgba(30, 30, 30, 0) 0px, rgba(30, 30, 30, 0.1) 16%, rgba(30, 30, 30, 0.2) 28%,rgba(30, 30, 30, 0.32) 37%, rgba(30, 30, 30, 0.39) 44%, rgba(33, 33, 33, 0.47) 50%, rgba(33, 33, 33, 0.56) 56% )'
          }}
          onClick={this.props._handleClick_ImgLayer_circle}>
          {_render_CircleGroup(markId, coordinate)}
        </div>
        <div
          style={Object.assign({
            top: top,
            left: left,
            right: right,
            bottom: bottom,
            width: width+"%"},
            radiusObj,
            styleMiddle.Com_ImgLayer_MarkBlock_)}>
            {childrenWithProps}
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
