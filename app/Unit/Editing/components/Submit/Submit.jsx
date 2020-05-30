import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../../stylesFont.module.css';
import DateConverter from '../../../../Components/DateConverter.jsx';
import AccountPalette from '../../../../Components/AccountPalette.jsx';

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    width: '96px',
    height: '32px',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '4px',
    cursor: 'default'
  },
  roundRecBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '2.4vh',
    overflow: 'hidden',
    cursor: 'pointer'
  },
}

class Submit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterSubmit: false,
      onEnterCancel: false,
      onPrimerLine: false
    };
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleEnter_Cancel = this._handleEnter_Cancel.bind(this);
    this._handleLeave_Cancel = this._handleLeave_Cancel.bind(this);
    this._handleEnter_primerLine = this._handleEnter_primerLine.bind(this);
    this._handleLeave_primerLine = this._handleLeave_primerLine.bind(this);
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
          className={classnames(styles.boxDate)}>
          <DateConverter
            datetime={editDate}/>
          {
            this.props.unitView == 'respond' &&
            <div
              className={classnames(stylesFont.fontContent, stylesFont.colorGrey)}>
              <span style={{cursor: 'default'}}>{this.props.i18nUIString.catalog["descript_Unit_Primer"][0]}</span>
              <div
                className={classnames(stylesFont.colorStandard)}
                style={{
                  display: 'inline-block', cursor: 'default',
                  textDecoration: this.state.onPrimerLine? "underline": "none"
                }}
                onMouseEnter={this._handleEnter_primerLine}
                onMouseLeave={this._handleLeave_primerLine}>
                <div
                  style={{display: 'inline-block'}}>
                  <AccountPalette
                    styleFirst={{
                      fontSize: '1.4rem', fontWeight: '400',
                      textDecoration: this.state.onPrimerLine? "underline": "none"
                    }}
                    styleLast={{
                      fontSize: '1.4rem',
                      textDecoration: this.state.onPrimerLine? "underline": "none"
                    }}
                    accountFirstName={this.props.unitCurrent.authorBasic.firstName}
                    accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
                </div>
                <span>{this.props.i18nUIString.catalog["descript_Unit_Primer"][1]}</span>
              </div>
            </div>

          }
        </div>
        <div
          className={classnames(styles.boxButtons)}>
          <div
            style={Object.assign({},
              styleMiddle.boxNavButton,
              {marginRight: '11px'},
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
            style={Object.assign({},
              styleMiddle.boxNavButton,
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
              {this.props.i18nUIString.catalog["submit_complete"]}
            </span>
          </div>

        </div>
      </div>
    )
  }

  _handleEnter_primerLine(e){
    this.setState({onPrimerLine: true})
  }

  _handleLeave_primerLine(e){
    this.setState({onPrimerLine: false})
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

export default connect(
  mapStateToProps,
  null
)(Submit);
