import React from 'react';
import ImgChoose from './ImgChoose.jsx';
import SvgButton from '../Svg/SvgButton.jsx';

export default class ImgImport extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_newImgSrc = this._handle_newImgSrc.bind(this);
    this.style={
      Com_div_ImgImport_ImgEmpty: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_div_ImgImport_ImgEmpty_Choose: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      Com_ImgImport_MarksPreview_: {
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
        style={this.style.Com_div_ImgImport_ImgEmpty}>
        <SvgButton/>
        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_Choose}>
          <ImgChoose
             _handle_newImgSrc={this._handle_newImgSrc}/>
        </div>
      </div>
    )
  }
}
