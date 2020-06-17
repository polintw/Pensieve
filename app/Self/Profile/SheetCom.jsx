import React from 'react';
import {
  Route,
  withRouter,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class Basic extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this._render_Gender = this._render_Gender.bind(this);
  }


  _render_Gender(dbRecords){
    switch (dbRecords) {
      case 0:
        return ({
          gender: 'Female',
          subtitle: this.props.i18nUIString.catalog['subtitle_Sign_gender']
        })
        break;
      case 1:
      return ({
        gender: 'Male',
        subtitle: this.props.i18nUIString.catalog['subtitle_Sign_gender']
      })
        break;
      case 30:
      return ({
        gender: this.props.i18nUIString.catalog['options_genderPronoun'][1],
        subtitle: "Pronoun"
      })
        break;
      case 31:
      return ({
        gender: this.props.i18nUIString.catalog['options_genderPronoun'][0],
        subtitle: "Pronoun"
      })
        break;
      default:
        return ({gender: '', subtitle:''})
    }
  }

  render(){
    const sheetRec = this.props.userSheet;
    let genderText = this._render_Gender(sheetRec.gender);

    return(
      <div
        className={classnames(styles.rowSheet)}>
        <span
          className={classnames(styles.spanTag, "fontContent", "colorSignBlack")}>
          {genderText.subtitle}
        </span>
        <span
          className={classnames("fontContent", "colorBlack85")}>
          {genderText.gender}
        </span>


      </div>
    )
  }
}

class AccountatSheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterChangePwd: false
    };
    this._handleEnter_PassChange = this._handleEnter_PassChange.bind(this);
    this._handleLeave_PassChange = this._handleLeave_PassChange.bind(this);
  }

  render(){
    return(
      <div
        className={classnames(styles.comAccountSheet)}>
        <div
          className={classnames(styles.rowSheet, styles.boxAccountSet)}>
          <span
            className={classnames(styles.spanTag, "fontContent", "colorSignBlack")}>
            {this.props.i18nUIString.catalog['subtitle_Sign_name'][0]}
          </span>
          <span
            className={classnames(styles.inputSign, "fontNodesEqual", "colorBlack85")}>
            {this.props.userInfo.firstName}
          </span>
        </div>
        <div
          className={classnames(styles.rowSheet, styles.boxAccountSet)}>
          <span
            className={classnames(styles.spanTag, "fontContent", "colorSignBlack")}>
            {this.props.i18nUIString.catalog['subtitle_Sign_name'][1]}
          </span>
          <span
            className={classnames(styles.inputSign, "fontNodesEqual", "colorBlack85")}>
            {this.props.userInfo.lastName}
          </span>
        </div>

        <div
          className={classnames(styles.rowSheet, styles.boxEmail)}>
          <span
            className={classnames(styles.spanTag, "fontContent", "colorSignBlack")}>
            {this.props.i18nUIString.catalog['subtitle_email']}
          </span>
          <span
            className={classnames(styles.inputSign, "fontNodesEqual", "colorBlack85")}>
            {this.props.accountSet.mail}</span>
        </div>

        <div
          className={classnames(styles.rowSheet, styles.boxPassword)}>
          <span
            className={classnames(styles.spanTag, "fontContent", "colorSignBlack")}>
            {this.props.i18nUIString.catalog['subtitle_Password']}
          </span>

          <Link
            to={{
              pathname: this.props.match.url ,
              search: '?status=password',
            }}
            className={classnames(
              styles.linkPassChange,
              {[styles.linkPassChangeMouse]: this.state.onEnterChangePwd}
            )}
            onMouseEnter={this._handleEnter_PassChange}
            onMouseLeave={this._handleLeave_PassChange}>
            <span
              className={classnames(
                'centerAlignChild',
                "fontContent",
                "colorWhite"
              )}>
              {this.props.i18nUIString.catalog["submit_change"]}
            </span>
          </Link>
        </div>

      </div>
    )
  }

  _handleEnter_PassChange(e){
    this.setState({
      onEnterChangePwd: true
    })
  }

  _handleLeave_PassChange(e){
    this.setState({
      onEnterChangePwd: false
    })
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

const reduxConnection = connect(
  mapStateToProps,
  mapDispatchToProps
);

export const SheetAccount = withRouter(reduxConnection(AccountatSheet));
export const SheetBasic = reduxConnection(Basic);
