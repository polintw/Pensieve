import React from 'react';

export default class ImgPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_ImgPreview_preview = this._handleClick_ImgPreview_preview.bind(this);
    this.style={
      Com_div_ImgPreview_ImgPreview: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1% 0'
      },
      Com_img_ImgPreview_ImgPreview: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        boxSizing: 'border-box',
        borderRadius: '0.5vw',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_ImgPreview_preview(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_ImgPreview_preview(this.props.blockName);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.Com_div_ImgPreview_ImgPreview}
        onClick={this._handleClick_ImgPreview_preview}>
        <img
          ref={(element)=>{this.imgBackground=element;}}
          src={this.props.previewSrc}
          style={this.style.Com_img_ImgPreview_ImgPreview}/>
      </div>
    )
  }
}
