import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../../stylesFont.module.css';

class Submit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterSubmit: false,
      onEnterCancel: false,
    };
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleEnter_Cancel = this._handleEnter_Cancel.bind(this);
    this._handleLeave_Cancel = this._handleLeave_Cancel.bind(this);
    this._handleClick_Editing_Submit = this._handleClick_Editing_Submit.bind(this);
    this._handleClick_Editing_Cancell = this._handleClick_Editing_Cancell.bind(this);
  }

  _handleEnter_Submit(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onEnterSubmit: true
    })
  }

  _handleLeave_Submit(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onEnterSubmit: false
    })
  }

  _handleEnter_Cancel(e){
    this.setState({
      onEnterCancel: true
    })
  }

  _handleLeave_Cancel(e){
    this.setState({
      onEnterCancel: false
    })
  }

  _handleClick_Editing_Cancell(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.props.unitSubmitting || this.props.warningDialog || this.props.confirmDialog) return;
    this.props._set_Clear();
  }

  _handleClick_Editing_Submit(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.props.unitSubmitting || this.props.warningDialog || this.props.confirmDialog) return;
    this.props._submit_newShare();
  }

  render(){
    let editDate = new Date();
    let submitPermit = (!this.props.editing && this.props.contentPermit) ? true : false;
    return(
      <div
        className={classnames(styles.comSubmit)}>
        <div
          className={classnames(styles.boxButtons)}>
          <div
            className={classnames(
              styles.boxNavButtons,
              styles.boxNavButtonsCancel
            )}
            style={Object.assign({},
              (this.state.onEnterCancel )? {backgroundColor: "#757575", cursor: 'pointer'}:{}
            )}
            onClick={this._handleClick_Editing_Cancell}
            onMouseEnter={this._handleEnter_Cancel}
            onMouseLeave={this._handleLeave_Cancel}>
            <span
              className={classnames(
                'centerAlignChild',
                stylesFont.fontSubmit,
                {[stylesFont.colorEditBlack]: !this.state.onEnterCancel},
                {[stylesFont.colorWhite]: this.state.onEnterCancel}
              )}>
              {this.props.i18nUIString.catalog["submit_cancel"]}
            </span>
          </div>
          <div
            className={classnames(styles.boxNavButtons)}
            style={Object.assign({},
              (this.state.onEnterSubmit && submitPermit)? {backgroundColor: "#ff8168", cursor: 'pointer'}:
              {backgroundColor: 'rgba(255, 129, 104, 0.1)'}
            )}
            onClick={this._handleClick_Editing_Submit}
            onMouseEnter={this._handleEnter_Submit}
            onMouseLeave={this._handleLeave_Submit}>
            <span
              className={classnames(
                'centerAlignChild',
                stylesFont.fontSubmit,
                {[stylesFont.colorStandard]: (!this.state.onEnterSubmit || !submitPermit)},
                {[stylesFont.colorWhite]: (this.state.onEnterSubmit && submitPermit)}
              )}>
              {this.props.i18nUIString.catalog["submit_unitPublish"]}
            </span>
          </div>

        </div>
      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitView: state.unitView,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Submit);
