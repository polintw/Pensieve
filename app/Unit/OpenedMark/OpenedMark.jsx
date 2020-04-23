import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgCircle from '../../Components/Svg/SvgCircle.jsx';
import {
  baseHorizonRatial,
} from '../props.js';


class OpenedMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_CircleGroup = this._render_CircleGroup.bind(this);

  }

  _render_CircleGroup (coordinateCurrent){
    if(!!this.props.editingModal){
      const self = this;
      let circlesArr = this.props.marksList.map(function(id, index){
        const coordinate = self.props.markCircles[id];
        return (
          <div
            key={"key_OpenedMark_Circle_"+index}
            id={id}
            className={'boxMarkSpot'}
            style={{top: coordinate.top+"%", left: coordinate.left+'%'}}
            onClick={self.props._handleClick_ImgLayer_circle}>
            <SvgCircle
              current={(id== self.props.currentMark)? true: false}
              notify={false}
              serial={index+1}/>
          </div>
        )
      });
      return circlesArr;
    }
    else {
      /*
      data from props. are different from above, called by editingModal,
      because they inherit from different system:
      editing is direct from list & circles the parent's 'state' had, while
      view like beneath, is from a reformed 'marksData' system designed for the children (history reason)
      */
      return (
        <div
          key={"key_OpenedMark_Circle_"}
          id={this.props.currentMark}
          className={'boxMarkSpot'}
          style={{top: coordinateCurrent.top+"%", left: coordinateCurrent.left+'%'}}
          onClick={this.props._handleClick_ImgLayer_circle}>
          <SvgCircle
            current={true}
            notify={this.props.notify}
            serial={this.props.serial}/>
        </div>
      )
    }
  }

  render(){
    /*
    Beneath we are going to calculate the position the MarkBlocks should be.
    Why it's so complicated due to at the beginning, the img is not position to the center,
    we didn't even know how 'left' the img was.
    */
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
    let [blockLeft, blockRight] = ['26.56%',''];
    /*
    the block would always be at the center, unless it overlap itself(spot).
    At that situation, move the block aside the spot.
    */
    if(coordinate.left < 50 && (spotLeftPx+24+22) > this.props.boxWidth*0.2656){
      blockLeft = spotLeftPx + 24+22;
      if((this.props.boxWidth - spotLeftPx - 24 -22) < 300){ blockLeft = ''; blockRight = 1;}
    }
    else if(coordinate.left > 50 && (this.props.boxWidth - spotLeftPx + 24+22) > this.props.boxWidth*0.2656){
      blockLeft = '';
      blockRight = this.props.boxWidth - spotLeftPx + 24+22;
      if((spotLeftPx - 24 -22) < 300){ blockLeft = 1; blockRight = '';}
    }

    // because we want to pass left/right status as props to Block, we need to add from here
    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, {
        toCircleLeft: (coordinate.left > 50)? true : false,
        downToMdidline: downToMdidline,
      })
    );

    return (
      <div>
        <div
          className={'boxAbsoluteFull'}
          onClick={this.props._handleClick_ImgLayer_circle}/>
        <div
          className={'boxImgPosition'}
          style={{
            width: imgWidth,
            height: imgHeight,
            right: baseHorizonRatial+'%',
            transform: 'translate('+baseHorizonRatial+'%, -50%)'
          }}
          onClick={this.props._handleClick_ImgLayer_circle}>
          {this._render_CircleGroup(coordinate)}
        </div>
        <div
          className={classnames(styles.boxMarkBlock)}
          style={Object.assign({},{
            left: blockLeft,
            right: blockRight
          })}
          onClick={(e)=>{e.stopPropagation();}}>
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
    unitSubmitting: state.unitSubmitting,
  }
}

export default connect(
  mapStateToProps,
  null
)(OpenedMark);
