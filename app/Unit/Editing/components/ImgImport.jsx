import React from 'react';
import {connect} from "react-redux";
import ImgChoose from '../../../Components/ImgChoose.jsx';
import {
  switchUnitSubmitting
} from "../../../redux/actions/unit.js";
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class ImgImport extends React.Component {
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
    //situation similar to submitting, everything forbidden
    //need cover mask, warning modal if disobey
    self.props._set_unitSubmitting(true);
    axios.post('/router/img/resize', base64URL, {
      headers: {
        'Content-Type': 'text/plain',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      let resizedURL = resObj.main.resizedURL;
      self.props._set_newImgSrc(resizedURL);
      self.props._set_unitSubmitting(false);
    }).catch(function (thrown) {
      self.props._set_unitSubmitting(false);
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
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

        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_Choose}>
          <ImgChoose
             _handle_newImgSrc={this._handle_newImgSrc}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    _set_unitSubmitting: (bool)=>{dispatch(switchUnitSubmitting(bool));},
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImgImport);
