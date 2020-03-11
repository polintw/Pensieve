import React from 'react';

export default class ImgChoose extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_ImgChoose = this._handleClick_ImgChoose.bind(this);
    this._handleChange_FileInput = this._handleChange_FileInput.bind(this);
    this.validFileType = this.validFileType.bind(this);
    this.style={
      Com_div_ImgChoose: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        cursor: 'pointer'
      }
    }
  }

  validFileType(file) {
    var imageType = /^image\//;
    if(imageType.test(file.type)){
      return true;
    }
    return false;
  }

  _handleChange_FileInput(){
    let self = this;
    let imgChosen = self.fileInput.files

    if(this.validFileType(imgChosen[0])) {
      var reader = new FileReader();

      reader.onload = function(event){
        self.props._handle_newImgSrc(reader.result);
      }
      reader.readAsDataURL(imgChosen[0]);
    }
  }

  _handleClick_ImgChoose(event){
    event.stopPropagation();
    event.preventDefault();
    //this.props._set_focusBlock('cover');
    let inputFile = document.getElementById('imgFileInput');
    inputFile.click();
  }

  render(){
    return(
      <div
        style={this.style.Com_div_ImgChoose}
        onClick={this._handleClick_ImgChoose}>
        <input
          type="file"
          id="imgFileInput"
          accept="image/*"
          style={{width:0, opacity:0}}
          ref={(element) => {this.fileInput = element}}
          onClick={(event)=>{event.stopPropagation();}}
          onChange={this._handleChange_FileInput}/>
      </div>
    )
  }
}
