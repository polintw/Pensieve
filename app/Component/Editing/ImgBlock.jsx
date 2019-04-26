import React from 'React';
import ImgChoose from './ImgChoose.jsx';

export default class ImgBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_newImgSrc = this._handle_newImgSrc.bind(this);
    this._handleClick_ImgBlock_preview = this._handleClick_ImgBlock_preview.bind(this);
    this.style={
      Com_ImgBlock_img_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_div_ImgBlock_ImgPreview: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1% 0'
      },
      Com_img_ImgBlock_ImgPreview: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        boxSizing: 'border-box',
        borderRadius: '0.5vw',
        cursor: 'pointer'
      },
      Com_div_ImgBlock_ImgEmpty: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_svg_ImgBlock_ImgEmpty: {
        width: '96%',
        height: '94%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      },
      Com_div_ImgBlock_ImgEmpty_Choose: {
        width: '96%',
        height: '94%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      },
      Com_ImgBlock_MarksPreview_: {
        width: '36%',
        height: '92%',
        position: 'absolute',
        top: '50%',
        right: '0%',
        transform: 'translate(0%, -50%)',
        boxSizing: 'border-box',
        overflow: 'auto'
      }
    }
  }

  _handleClick_ImgBlock_preview(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._open_ContentModal(this.props.blockName);
  }

  _handle_newImgSrc(base64URL){
    const self = this;
    this.setState({axios: true});
    axios.post('/router/img/resize', base64URL, {
      headers: {
        'Content-Type': 'text/plain',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      self.setState({axios: false});
      let resObj = JSON.parse(res.data);
      let resizedURL = resObj.main.resizedURL;
      self.props._set_newImgSrc(resizedURL, self.props.blockName);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        console.log(thrown);
        self.setState({axios: false});
        alert("Failed, please try again later");
      }
    });
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_ImgBlock_img_}>
        {
          this.props.previewSrc ?
          <div
            style={this.style.Com_div_ImgBlock_ImgPreview}
            onClick={this._handleClick_ImgBlock_preview}>
            <img
              ref={(element)=>{this.imgBackground=element;}}
              src={this.props.previewSrc}
              style={this.style.Com_img_ImgBlock_ImgPreview}/>
          </div>
          :
          <div
            style={this.style.Com_div_ImgBlock_ImgEmpty}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 218.95 111.11" preserveAspectRatio="none" style={this.style.Com_svg_ImgBlock_ImgEmpty}>
              <defs><style>{".cls-1{fill:#51514A;}"}</style></defs>
              <g id="圖層_2" data-name="圖層 2">
                <g id="圖層_1-2" data-name="圖層 1">
                  <path className="cls-1" d="M207.52,0h-12V1h12V0Zm-24,0h-12V1h12V0Zm-24,0h-12V1h12V0Zm-24,0h-12V1h12V0Zm-24,0h-12V1h12V0Zm-24,0h-12V1h12V0Zm-24,0h-12V1h12V0Zm-24,0h-12V1h12V0Zm-24,0H9l-.07,0H8.61l-.06,0H8.49L8.43.4H8.37l-.06,0H8.24l-.07,0H8.12l-.07,0H8l-.06,0H7.89l-.07,0H7.77l-.08,0H7.64l-.07,0H7.52l-.08,0h0l-.08,0h0l-.07,0h0L7.1.85h0L7,.9h0L6.86,1h0L6.75,1h0l-.06,0h0l-.08,0h0l-.08,0H6.35l-.06,0h0l-.07,0h0l-.06,0H6L6,1.4h0l0,0H5.8l-.06,0H5.68l0,0H5.58l0,0H5.48l-.06,0H5.36l0,0H5.26l0,0H5.14l0,0H5L5,2H4.94l0,0H4.73l0,0H4.64l0,0H4.54l0,0H4.34l0,0H4.14l.63.77A10.47,10.47,0,0,1,11.44,1h4.08V0ZM1,13.39H0v12H1v-12Zm0,24H0v12H1v-12Zm0,24H0v12H1v-12Zm0,24H0v12H1v-12Zm3.55,22.12-.67.75a12.36,12.36,0,0,0,1.22.94h0l.1.07h.09l.06,0H6l0,0h.13l0,0h.1l.07,0h.1l.07,0h.09l.1,0h.08l.1,0H7l.11.05h.08l.1,0h.09l.09,0h.08l.1,0h.08l.09,0h.09l.09,0h.11l.08,0h.11l.07,0h.11l.08,0h.11l.08,0h6.46v-1H11.44a10.39,10.39,0,0,1-6.89-2.6Zm34.64,2.6h-12v1h12v-1Zm24,0h-12v1h12v-1Zm24,0h-12v1h12v-1Zm24,0h-12v1h12v-1Zm24,0h-12v1h12v-1Zm24,0h-12v1h12v-1Zm24,0h-12v1h12v-1Zm24,0h-12v1h12v-1ZM219,94h-1v5.7a10.35,10.35,0,0,1-1.54,5.46l.86.53a13,13,0,0,0,.89-1.79h0l.09-.23h0v0h0v0h0v0h0l0-.05h0v0h0v0h0v0h0v0h0v0h0l0,0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0V94Zm0-24h-1V82h1V70Zm0-24h-1V58h1V46Zm0-24h-1V34h1V22Zm-7-21.1-.38.93a10.43,10.43,0,0,1,6.35,8.3l1-.12a11.44,11.44,0,0,0-7-9.11Z"/>
                </g>
              </g>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 218.95 111.11" preserveAspectRatio="xMidYMid" style={this.style.Com_svg_ImgBlock_ImgEmpty}>
              <defs><style>{".cls-2{fill:white;font-size:16px;font-family:SourceHanSansTW-Normal-B5pc-H, Source Han Sans TW;letter-spacing:0.09em;}"}</style></defs>
              <g id="圖層_1" data-name="圖層 1">
                <text className="cls-2" transform="translate(68.88 59.17)">請上傳圖片</text>
              </g>
            </svg>
            <div
              style={this.style.Com_div_ImgBlock_ImgEmpty_Choose}>
              <ImgChoose
                 _handle_newImgSrc={this._handle_newImgSrc}/>
            </div>
          </div>
        }
      </div>
    )
  }
}
