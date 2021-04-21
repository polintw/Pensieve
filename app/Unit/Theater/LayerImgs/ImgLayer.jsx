import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import MarksLayer from './MarksLayer.jsx';

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
        imgWidthHeight={imgWidthHeight}/>
    )

  }

  render(){
    return(
      <div
        ref={this.Com_ImgLayer_box}
        className={classnames(styles.comImgLayer)}>
        {
          this.state.imgWidthHeight &&
          <div
            className={classnames(styles.boxSmallRelative)}
            style={{height: this.Com_ImgLayer_img.current.clientHeight}}/>
        }
        <img
          className={classnames(
            'boxImgPosition', styles.boxImg)}
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
