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
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }
    }
  }

  _handleClick_ImgPreview_preview(event){
    /*
    In this Click, we didnt stop Propagation, niether preventing default.
    So the parent need to NOtice this for they have to stop it by themself
    */
    this.props._handleClick_ImgPreview_preview(this.props.blockName);
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={Object.assign({}, this.style.Com_div_ImgPreview_ImgPreview, {backgroundImage: 'url('+this.props.previewSrc+')'})}
        onClick={this._handleClick_ImgPreview_preview}>
      </div>
    )
  }
}
