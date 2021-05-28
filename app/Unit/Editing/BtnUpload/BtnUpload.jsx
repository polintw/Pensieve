import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../CreateShare.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class BtnUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingOpen: false,
      typeWriterText: '',
      onCreate: false,
      onCreateWideScreen: false,
    };
    this._handleEnter_Upload = this._handleEnter_Upload.bind(this);
    this._handleLeave_Upload = this._handleLeave_Upload.bind(this);
    this._handleEnter_UploadWideScreen = this._handleEnter_UploadWideScreen.bind(this);
    this._handleLeave_UploadWideScreen = this._handleLeave_UploadWideScreen.bind(this);
    this._setInterval_typeWriter = this._setInterval_typeWriter.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.onCreateWideScreen && !prevState.onCreateWideScreen) this._setInterval_typeWriter();
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={{width: '100%'}}>
        <div
          className={classnames(
            "smallDisplayNone",
            styles.comBtnUpload, styles.btnBorderWide,
            {
              [styles.comMouseEnterWideScreen]: (this.state.onCreateWideScreen),
            }
          )}
          onMouseEnter={this._handleEnter_UploadWideScreen}
          onMouseLeave={this._handleLeave_UploadWideScreen}>
          <div
            className={classnames(
              styles.boxWriter)}>
              <span
                className={classnames(
                  styles.spanWriter, 'fontNodesEqual', 'lineHeight15',
                  {
                    [styles.spanWriterTyping]: (this.state.onCreateWideScreen),
                    ['colorStandard']: (this.state.onCreateWideScreen),
                    ['colorGrey']: (!this.state.onCreateWideScreen),
                  }
                )}>
                {
                   this.state.onCreateWideScreen ? this.state.typeWriterText :
                    this.props.i18nUIString.catalog['title_upload_daily']
                  }
                </span>
              </div>
          <CreateShare
            {...this.props}
            forceCreate={this.state.editingOpen}/>
        </div>
        <div
          className={classnames(
            "smallDisplayBox",
            styles.comBtnUpload,styles.btnBorderSmall,
            {
              [styles.comMouseEnter]: (this.state.onCreate),
            }
          )}
          onTouchStart={this._handleEnter_Upload}
          onTouchEnd={this._handleLeave_Upload}
          onMouseEnter={this._handleEnter_Upload}
          onMouseLeave={this._handleLeave_Upload}>
          <div
            className={classnames(
              styles.boxWriter)}>
              <span
                className={classnames(
                  styles.spanWriter, 'lineHeight15', "fontNodesEqual", "weightBold",
                  {
                    ['colorStandard']: (this.state.onCreate),
                    ['colorGrey']: (!this.state.onCreate),
                  }
                )}>
                {this.props.i18nUIString.catalog['title_upload_daily'] }
              </span>
            </div>
          <CreateShare
            {...this.props}
            forceCreate={this.state.editingOpen}/>
        </div>
      </div>
    )
  }

  _setInterval_typeWriter(){
    this._timer_typeWriter = setInterval(function(){
      let textShareUpload = this.props.i18nUIString.catalog["title_shareUpload_typewriter"];
      let currentTypeWriter = this.state.typeWriterText;

      if(currentTypeWriter.length < textShareUpload.length){
        this.setState((prevState,props)=>{
          return {typeWriterText: prevState.typeWriterText+ textShareUpload[prevState.typeWriterText.length]}
        })
      }
      else {
        clearInterval(this._timer_typeWriter)
      }
    }.bind(this), 200);
  }

  _handleEnter_Upload(e){
    this.setState({onCreate: true})
  }

  _handleLeave_Upload(e){
    clearInterval(this._timer_typeWriter);
    this.setState({
      typeWriterText: '',
      onCreate: false})
  }

  _handleEnter_UploadWideScreen(e){
    this.setState({onCreateWideScreen: true})
  }

  _handleLeave_UploadWideScreen(e){
    clearInterval(this._timer_typeWriter);
    this.setState({
      typeWriterText: '',
      onCreateWideScreen: false})
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BtnUpload));
