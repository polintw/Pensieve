import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../../Unit/Editing/CreateShare.jsx';

class ShareUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingOpen: false,
      typeWriterText: '',
      onCreate: false,
    };
    this._handleEnter_Upload = this._handleEnter_Upload.bind(this);
    this._handleLeave_Upload = this._handleLeave_Upload.bind(this);
    this._setInterval_typeWriter = this._setInterval_typeWriter.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.onCreate && !prevState.onCreate) this._setInterval_typeWriter();
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(
          styles.comShareUpload,
          {[styles.comMouseEnter]: this.state.onCreate}
        )}
        onMouseEnter={this._handleEnter_Upload}
        onMouseLeave={this._handleLeave_Upload}>
        <div
          className={classnames(
            styles.boxWriter)}>
            <span
              className={classnames(
                styles.spanWriter, 'fontTitleBig', 'colorStandard',
                {[styles.spanWriterTyping]: this.state.onCreate}
              )}>
              {this.state.typeWriterText}
            </span>
        </div>
        <CreateShare
          {...this.props}
          forceCreate={this.state.editingOpen}/>
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
)(ShareUpload));
