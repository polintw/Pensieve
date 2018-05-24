import React from 'React';
import ImgChoose from './ImgChoose.jsx';

export default class ImgBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_ImgBlock_preview = this._handleClick_ImgBlock_preview.bind(this);
    this.style={

    }
  }

  _handleClick_ImgBlock_preview(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_focusBlock(this.props.blockName);
    this.props._set_contentModalify(true);
  }

  render(){
    return(
      <div
        style={this.props.componentStyle}>
        {
          this.props.previewSrc ?
          <div
            style={this.style.div_Com_ImgBlock_Preview}
            onClick={this._handleClick_ImgBlock_preview}>
            <img
              ref={(element)=>{this.imgBackground=element;}}
              src={this.props.previewSrc}
              style={this.style.div_Com_ImgBlock_Preview_Img}/>
          </div>
          :
          <div
            style={this.style.div_Com_ImgBlock_Empty}>
            {"選擇圖像"}
            <ImgChoose
              chooseFor={this.props.blockName}
              _set_newImgSrc={this.props._set_newImgSrc}/>
          </div>
        }
      </div>
    )
  }
}
