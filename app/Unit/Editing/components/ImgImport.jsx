import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import stylesFont from '../stylesFont.module.css';
import ImgChoose from '../../../Components/ImgChoose.jsx';
import SvgUpload from '../../../Components/Svg/SvgUpload.jsx';
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

    };
    this.axiosSource = axios.CancelToken.source();
    this._handle_newImgSrc = this._handle_newImgSrc.bind(this);
    this.style={
      Com_div_ImgImport_ImgEmpty: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundImage: "linear-gradient(to bottom, #fffdfa, #fff9f2)"
        borderRadius: '4px',
        border: "dashed 2px #ff8168",
        overflow: 'hidden'
      },
      Com_div_ImgImport_ImgEmpty_Guiding: {
        position: 'absolute',
        top: '83.33%',
        left: '50%',
        transform: 'translate(-50%, 0)',
      },
      Com_div_ImgImport_ImgEmpty_symbol: {
        width: '18.75%',
        height: '20%',
        minWidth: '120px',
        position: 'absolute',
        top: '27.78%',
        left: '50%',
        transform: 'translate(-50%, 0)',
      },
      Com_div_ImgImport_ImgEmpty_Choose: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'42.188%',
        height: '40px',
        position: 'absolute',
        top: '66.6%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        borderRadius: '4px',
        backgroundColor: '#ff8168',
        cursor: 'pointer'
      },
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

  }

  render(){
    return(
      <div
        style={this.style.Com_div_ImgImport_ImgEmpty}>
        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_symbol}>
          <SvgUpload/>
        </div>
        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_Choose}>
          <span
            className={classnames(stylesFont.colorWhite, stylesFont.fontSubmit)}>
            {this.props.i18nUIString.catalog['submit_Unit_upload']}
          </span>
          <ImgChoose
             _handle_newImgSrc={this._handle_newImgSrc}/>
        </div>
        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_Guiding}>
          <span
            className={classnames(stylesFont.colorEditLightBlack, stylesFont.fontDescript)}>
            {this.props.i18nUIString.catalog['guiding_UnitEdit_upload']}
          </span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
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
