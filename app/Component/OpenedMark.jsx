import React from 'react';
import { connect } from "react-redux";
import {
  baseHorizonRatial,
  widthDivisionRatial
} from './config/styleParams.js';
import SvgCircle from './Svg/SvgCircle.jsx';

const generalStyle = {
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
        height: '32%', //the target MaxHeight is 64%
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
        spotLeftPx = coordinate.left/100*imgWidth+imgLeft+imgWidth*(baseHorizonRatial/100);
        //the position of circle relative to img, position img original at in the frame, and transform/translate we set
        //--- due to offsetLeft wouldn't take the transform property

    width = ((widthDivisionRatial/2)-2.6)/widthDivisionRatial*100;
    (spotLeftPx) > (this.props.boxWidth/2) ? ( //check which side of the box the circle at
      right = this.props.boxWidth-(spotLeftPx)+1.6*(this.props.boxWidth/widthDivisionRatial) //if circle st the right side, put the box 'left' to the circle
    ): (
      left = spotLeftPx+1.6*(this.props.boxWidth/widthDivisionRatial)
    );
    coordinate.top > 50 ? ( //move between 0 - 28%, depend on location
      //28% above bottom if .top just at 50%, then lower follow the portion change
      bottom = (28 - ((coordinate.top-50)/50) * (28-3)) + '%'
    ):(
      top = (3 + (coordinate.top/50) * (28-3)) + '%'
    );

    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, { toCircleLeft: right > 0? true : false, downToMdidline: bottom.length>0 ? true:false })
    );// because we want to pass left/right status as props to Block, we need to add from here

    return (
      <div>
        <div
          style={generalStyle.absolute_FullVersion}
          onClick={this.props._handleClick_ImgLayer_circle}/>
        <div
          className={'boxImgPosition'}
          style={{
            width: imgWidth,
            height: imgHeight,
            right: baseHorizonRatial+'%',
            transform: 'translate('+baseHorizonRatial+'%,-50%)',
            backgroundImage: 'radial-gradient(ellipse at '+
              (coordinate.left+ (right > 0?5:(-5)))+
              '% '+
              (coordinate.top+ (top > 0?3:(-3)))+
              '% , rgba(30, 30, 30,0) 0, rgba(30, 30, 30,0.2) 11%, rgba(30, 30, 30,0.46) 20%, rgba(33, 33, 33,0.67) 27%, rgba(33, 33, 33,0.7) 32%, rgba(33, 33, 33,0.68) 40%,rgba(30, 30, 30,0.56) 51%,rgba(30, 30, 30,0.45) 64%, rgba(30, 30, 30,0.36) 76%, rgba(30, 30, 30,0.3) 87%, rgba(30, 30, 30,0.27) 100%)'
          }}
          onClick={this.props._handleClick_ImgLayer_circle}>
            <div
              id={markId}
              className={'circleMarkSpotSvg'}
              style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
              onClick={this.props._handleClick_ImgLayer_circle}>
              <SvgCircle
                current={false}
                notify={this.props.notify}
                serial={this.props.serial}/>
            </div>
        </div>
        <div
          style={Object.assign({
            top: top,
            left: left,
            right: right,
            bottom: bottom,
            width: width+"%"}, this.style.Com_ImgLayer_MarkBlock_)}>
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
