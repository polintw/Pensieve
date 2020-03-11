import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgCircle from '../../Components/Svg/SvgCircle.jsx';
import {
  baseHorizonRatial,
  baseVertivalRatial,
  widthDivisionRatial
} from '../props.js';

const styleMiddle = {
  absolute_FullVersion: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left:'0',
    boxSizing: 'border-box'
  },
}


class OpenedMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_CircleGroup = this._render_CircleGroup.bind(this);
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

  _render_CircleGroup (coordinate){
    return (
      <div
        id={this.props.currentMark}
        className={'boxMarkSpot'}
        style={{top: coordinate.top+"%", left: coordinate.left+'%'}}>
        <div
          onClick={this.props._handleClick_ImgLayer_circle}>
          <SvgCircle
            current={true}
            notify={this.props.notify}
            serial={this.props.serial}/>
        </div>

      </div>
    )
  }

  render(){
    const markId = this.props.currentMark,
          imgWidth = this.props.imgWidthHeight.width,
          imgHeight = this.props.imgWidthHeight.height,
          imgLeft=this.props.imgPosition.left;
    const coordinate = {top: this.props.marksData.data[markId].top, left: this.props.marksData.data[markId].left};
    const downToMdidline = (coordinate.top > 50) ? true : false;
    const spotLeftPx = coordinate.left/100*imgWidth+imgLeft+imgWidth*(baseHorizonRatial/100);
      //the position of circle relative to img, position img original at in the frame, and transform/translate we set
      //--- due to offsetLeft wouldn't take the transform property

    //then cauculate position of opened mark here in render()
    //to make the mark would change the position when jumping between different spot
    let [
      blockLeft,
      blockRight,
      inBlockHeight,
    ] = ['','',''];

    (spotLeftPx) > (this.props.boxWidth/2) ? ( //check which side of the box the circle at
      //if circle st the right side, put the box 'left' to the circle
      blockRight = this.props.boxWidth-(spotLeftPx)+3*(this.props.boxWidth/widthDivisionRatial)
      //which means, block would be 3/20 of boxWidth left to the spot (if the widthDivisionRatial='20')
      //(about 15% when the widthDivisionRatial='20')
    ): (
      blockLeft = spotLeftPx+3*(this.props.boxWidth/widthDivisionRatial)
    );

    //set height of scroll area between 81% ~ 69% depend on spot's top,
    //use 50(downToMdidline) as base to cauculate the portion
    //basically it would equal to 'vh' as we set the block height 100% to vh
    //and keep them as a num first
    inBlockHeight = (100-87) + ((coordinate.top/ 100) * (87-65))

    // because we want to pass left/right status as props to Block, we need to add from here
    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, {
        toCircleLeft: blockRight > 0? true : false,
        downToMdidline: downToMdidline,
        inBlockHeight: inBlockHeight
      })
    );

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
            top: baseVertivalRatial+'%',
            right: baseHorizonRatial+'%',
            transform: 'translate('+baseHorizonRatial+'%, -'+ baseVertivalRatial+'%)',
            backgroundImage: 'radial-gradient(ellipse at '+
              (coordinate.left+ (blockRight > 0?6:(-6)))+
              '% '+
              (coordinate.top+ (downToMdidline? (-12): 12))+
              '%, rgba(30, 30, 30, 0) 0px, rgba(30, 30, 30, 0.1) 16%, rgba(30, 30, 30, 0.2) 28%,rgba(30, 30, 30, 0.32) 37%, rgba(30, 30, 30, 0.39) 44%, rgba(33, 33, 33, 0.47) 50%, rgba(33, 33, 33, 0.56) 56% )'
          }}
          onClick={this.props._handleClick_ImgLayer_circle}>
          {this._render_CircleGroup(coordinate)}
        </div>

        <div
          className={classnames(styles.boxMarkBlock)}
          style={Object.assign(
            {},
            {
              left: blockLeft,
              right: blockRight
            }
          )}
          onClick={(e)=>{e.stopPropagation();}}>
          <div
            className={classnames(styles.boxMarkinBlock)}>
            {childrenWithProps}
          </div>
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
