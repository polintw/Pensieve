import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import MarksLayer from './MarksLayer.jsx';
import {
  baseHorizonRatial,
} from '../../props.js';

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

class ImgLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidthHeight: false
    };
    this.Com_ImgLayer_box = React.createRef();
    this.Com_ImgLayer_img = React.createRef();
    this._set_imgSize = ()=>{this.setState({imgWidthHeight:true})};
    this._render_MarksLayer = this._render_MarksLayer.bind(this);
    this.style = {
      Com_ImgLayer_img: {
        maxWidth: '100%',
        maxHeight: '100%',
        right: baseHorizonRatial+'%',
        transform: 'translate('+baseHorizonRatial+'%, -50%)'
        //we use the params managed in a single file to assure the position always consistent across component
      }
  };
  }

  _render_MarksLayer(){

    let imgWidthHeight = {
      width: this.Com_ImgLayer_img.current.clientWidth,
      height: this.Com_ImgLayer_img.current.clientHeight
    },
      //create the 'relation between img and box', then pass to marklayer as a reference for counting
      //don't use customized statics, raising the maintanance difficulty
      imgPosition = {
        left: this.Com_ImgLayer_img.current.offsetLeft
      },
      boxWidth=this.Com_ImgLayer_box.current.clientWidth;

    return (
      <MarksLayer
        {...this.props}
        boxWidth={boxWidth}
        imgPosition={imgPosition}
        imgWidthHeight={imgWidthHeight}
        baseHorizonRatial={baseHorizonRatial}/>
    )

  }

  render(){
    return(
      <div
        ref={this.Com_ImgLayer_box}
        style={generalStyle.absolute_FullVersion}>
        <img
          className={classnames('boxImgPosition')}
          style={this.style.Com_ImgLayer_img}
          ref={this.Com_ImgLayer_img}
          src={this.props.imgSrc}
          onLoad={this._set_imgSize}/>
        {
          (this.state.imgWidthHeight && this.props.lockify) &&
          this._render_MarksLayer()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
  }
}

export default connect(
  mapStateToProps,
  null
)(ImgLayer);
