import React from 'react';
import { connect } from "react-redux";
import ViewerMarks from './ViewerMarks.jsx';

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

class ImgLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidthHeight: null
    };
    this._set_imgSize = this._set_imgSize.bind(this);
    this.style = {
      Com_ImgLayer_img: {
        maxWidth: '99%',
        maxHeight: '100%',
        position: 'absolute',
        top: '50%',
        right: '40%',
        transform: 'translate(40%,-50%)'
      }
    };
  }

  _set_imgSize(){
    let imgWidth = self.Com_ImgLayer_img.clientWidth,
        imgHeight = self.Com_ImgLayer_img.clientHeight;

    this.setState({
      imgWidthHeight: {
        width: imgWidth,
        height: imgHeight
      }
    });
  }

  render(){
    return(
      <div
        style={commonStyle.absolute_FullVersion}
        ref={(element) => {this.Com_ImgLayer = element;}}>
        <img
          style={this.style.Com_ImgLayer_img}
          ref={(element) => {this.Com_ImgLayer_img = element;}}
          src={this.props.imgSrc}
          onLoad={this._set_imgSize}/>
        {
          this.state.imgWidthHeight && this.props.lockify &&
          this.props.unitCurrent.identity=="author" ? (
            <AuthorMarks/>
          ):(
            <ViewerMarks/>
          )
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
)(ImgLayer);
