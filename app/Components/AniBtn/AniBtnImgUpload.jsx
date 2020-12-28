import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './stylesImgUpload.module.css';
import stylesFont from './stylesFont.module.css';
import ImgChoose from '../ImgChoose.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class AniBtnImgUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      processing: false
    };
    this.boxProgressBar = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._handle_newImgSrc = this._handle_newImgSrc.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={styles.comImgUpload}>
        <span
          className={classnames(styles.spanText, stylesFont.colorWhite, stylesFont.fontSubmit)}>
          {this.props.i18nUIString.catalog['submit_Unit_upload'][this.state.processing? 1 : 0]}
        </span>
        <div
          ref={this.boxProgressBar}
          className={classnames(
            styles.progressbar,
            {[styles.progressed]: this.state.processing}
          )}></div>

        <ImgChoose
           _handle_newImgSrc={this._handle_newImgSrc}/>
      </div>
    )
  }

  _handle_newImgSrc(base64URL){
    if(this.state.axios) return; // stop the process if something already on the way

    const self = this;
    //situation similar to submitting, everything forbidden
    //need cover mask, warning modal if disobey
    this.setState({
      axios: true, //set locally
      processing: true//and, the special of this comp. start a animation
    });
    this.props._set_Submitting(true); //and set parent

    // now we req by axios
    axios.post('/router/img/resize', base64URL, {
      headers: {
        'Content-Type': 'text/plain',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        exif: true
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      let resObj = JSON.parse(res.data);
      let resizedURL = resObj.main.resizedURL;
      let imageExif = resObj.main.exif; // an obj

      self.setState({
        axios: false,
        processing: false
      });
      // pass the res img to parent
      self.props._set_newImgSrc({
        resizedURL: resizedURL,
        imageExif: imageExif
      });
      self.props._set_Submitting(false);
    }).catch(function (thrown) {
      self.setState({axios: false});
      self.props._set_Submitting(false);
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AniBtnImgUpload);
