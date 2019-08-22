import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  baseHorizonRatial,
  baseVertivalRatial,
  widthDivisionRatial
} from '../config/styleParams.js';
import SvgCircle from '../Svg/SvgCircle.jsx';
import SvgNextCir from '../Svg/SvgNextCir.jsx';

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
    this._handleClick_jumpMark = this._handleClick_jumpMark.bind(this);
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

  _handleClick_jumpMark (event){
    event.preventDefault();
    event.stopPropagation();
    let direction = event.currentTarget.getAttribute('jump');
    this.props._set_markJump(direction, this.props.currentSerial);
  }

  _render_CircleGroup (coordinate){
    return (
      <div
        id={this.props.currentMark}
        className={'circleMarkSpotSvg'}
        style={{top: coordinate.top+"%", left: coordinate.left+'%'}}>
        <div
          onClick={this.props._handleClick_ImgLayer_circle}>
          <SvgCircle
            current={true}
            notify={this.props.notify}
            serial={this.props.serial}/>
        </div>
        <div
          className={'boxMarkNextCir'}
          style={{
            top: coordinate.top > 90? '-72%': '124%',
            left: coordinate.left > 90 ? '-56%': '100%'}}
          jump={(this.props.currentSerial==(this.props.marksData.list.length-1)) ? 'continue':'next'}
          onClick={this._handleClick_jumpMark}>
          <SvgNextCir
            pathStyle={{
              fill: '#fff',
              stroke: '#fff'
            }}/>
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
    //then cauculate position of opened mark here in render()
    //to make the mark would change the position when jumping between different spot
    let [
      blockLeft,
      blockRight,
      inBlockTop,
      inBlockBottom
    ] = ['','','',''];
    let spotLeftPx = coordinate.left/100*imgWidth+imgLeft+imgWidth*(baseHorizonRatial/100);
        //the position of circle relative to img, position img original at in the frame, and transform/translate we set
        //--- due to offsetLeft wouldn't take the transform property

    (spotLeftPx) > (this.props.boxWidth/2) ? ( //check which side of the box the circle at
      blockRight = this.props.boxWidth-(spotLeftPx)+1.7*(this.props.boxWidth/widthDivisionRatial) //if circle st the right side, put the box 'left' to the circle
    ): (
      blockLeft = spotLeftPx+1.7*(this.props.boxWidth/widthDivisionRatial)
    );

    if(coordinate.top > 50){
      //move between 0 - 28%, depend on location
       //28% above bottom if .top just at 50%, then lower follow the portion change
      inBlockBottom = (28 - ((coordinate.top-50)/50) * (28-3)) + '%';
    }else{inBlockTop = (3 + (coordinate.top/50) * (28-3)) + '%';}

    // because we want to pass left/right status as props to Block, we need to add from here
    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, { toCircleLeft: blockRight > 0? true : false, downToMdidline: inBlockBottom.length>0 ? true:false })
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
              (coordinate.top+ (inBlockTop > 0? 12: (-12)))+
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
          )}>
          <div
            className={classnames(styles.boxMarkinBlock)}
            style={Object.assign({
              top: inBlockTop,
              bottom: inBlockBottom})
            }>
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
