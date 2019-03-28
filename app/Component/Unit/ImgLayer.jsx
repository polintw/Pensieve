import React from 'react';
import { connect } from "react-redux";
import AuthorMarks from './AuthorMarks.jsx';
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
      imgWidthHeight: false
    };
    this.Com_ImgLayer_img = React.createRef();
    this._set_imgSize = this._set_imgSize.bind(this);
    this._render_MarksLayer = this._render_MarksLayer.bind(this);
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
    let imgWidth = this.Com_ImgLayer_img.current.clientWidth,
        imgHeight = this.Com_ImgLayer_img.current.clientHeight;

    this.setState({
      imgWidthHeight: {
        width: imgWidth,
        height: imgHeight
      }
    });
  }

  _render_MarksLayer(){
    return this.props.unitCurrent.identity=="author" ? (
      <AuthorMarks
        imgWidthHeight={this.state.imgWidthHeight}
        marksData={this.props.marksData}
        spotsVisible={this.props.spotsVisible}
        markOpened={this.props.markOpened}
        currentMark={this.props.currentMark}
        _set_Markvisible={this.props._set_Markvisible}
        _set_spotsVisible={this.props._set_spotsVisible}/>
    ):(
      <ViewerMarks
        imgWidthHeight={this.state.imgWidthHeight}
        marksData={this.props.marksData}
        spotsVisible={this.props.spotsVisible}
        markOpened={this.props.markOpened}
        currentMark={this.props.currentMark}
        _set_Markvisible={this.props._set_Markvisible}
        _set_spotsVisible={this.props._set_spotsVisible}/>
    )
  }

  render(){
    return(
      <div
        style={commonStyle.absolute_FullVersion}>
        <img
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
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(ImgLayer);
