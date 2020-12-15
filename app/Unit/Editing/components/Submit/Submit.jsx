import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../../stylesFont.module.css';
import AccountPalette from '../../../../Components/AccountPalette.jsx';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
}

class Submit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterSubmit: false,
      onEnterCancel: false,
      onPrimerLine: false,
      anchorEl: null
    };
    this._render_AuthorMenu = this._render_AuthorMenu.bind(this);
    this._render_IdentityBtn = this._render_IdentityBtn.bind(this);
    this._handleClick_optionIdentity = this._handleClick_optionIdentity.bind(this);
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleEnter_Cancel = this._handleEnter_Cancel.bind(this);
    this._handleLeave_Cancel = this._handleLeave_Cancel.bind(this);
    this._handleEnter_primerLine = this._handleEnter_primerLine.bind(this);
    this._handleLeave_primerLine = this._handleLeave_primerLine.bind(this);
    this._handleClick_Editing_Submit = this._handleClick_Editing_Submit.bind(this);
    this._handleClick_Editing_Cancell = this._handleClick_Editing_Cancell.bind(this);
    this._handleClick_btnMaterialMenu = this._handleClick_btnMaterialMenu.bind(this);
    this._handleClose_btnMaterialMenu = this._handleClose_btnMaterialMenu.bind(this);
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

  _render_IdentityBtn(){
    if(this.props.authorIdentity != 'userAccount'){
      return this.props.userInfo.pathProject
    }
    else
    return this.props.userInfo.account;
  }

  _render_AuthorMenu(){
    return (!!this.props.userInfo.pathName && this.props.unitView != "editing") ? (
      <div>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this._handleClick_btnMaterialMenu}>
          {this._render_IdentityBtn()}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this._handleClose_btnMaterialMenu}>
          <MenuItem
            identity={"userAccount"}
            selected={this.props.authorIdentity=="userAccount"}
            onClick={this._handleClick_optionIdentity}>
            {this.props.userInfo.account}
          </MenuItem>
          <MenuItem
            identity={this.props.userInfo.pathName}
            selected={this.props.authorIdentity==this.props.userInfo.pathName}
            onClick={this._handleClick_optionIdentity}>
            {this.props.userInfo.pathProject}
          </MenuItem>
        </Menu>
      </div>
    ): (
      <div>
        <AccountPalette
          styleFirst={{
            fontSize: '1.4rem',
          }}
          styleLast={{
            fontSize: '1.4rem',
          }}
          accountFirstName={ (this.props.authorIdentity=="userAccount") ? this.props.userInfo.firstName : null}
          accountLastName={ (this.props.authorIdentity=="userAccount") ? this.props.userInfo.lastName : this.props.userInfo.pathProject}/>
      </div>
    )
  }

  render(){
    let editDate = new Date();
    let submitPermit = (!this.props.editing && this.props.contentPermit) ? true : false;
    return(
      <div
        className={classnames(styles.comSubmit)}>
        <div
          className={classnames(styles.boxDate)}>
          {this._render_AuthorMenu()}
          {
            this.props.unitView == 'respond' &&
            <div
              className={classnames("fontContent", "colorGrey")}>
              <span style={{cursor: 'default'}}>{this.props.i18nUIString.catalog["descript_Unit_Primer"][0]}</span>
              <div
                className={classnames("colorStandard")}
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
              {this.props.i18nUIString.catalog["submit_unitPublish"]}
            </span>
          </div>

        </div>
      </div>
    )
  }

  _handleClick_optionIdentity(event){
    let chosenIdentity = event.currentTarget.getAttribute('identity');
    this.props._set_authorIdentity(chosenIdentity);
    this.setState({
      anchorEl: null
    });
  }

  _handleClick_btnMaterialMenu(event){
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  _handleClose_btnMaterialMenu(event){
    this.setState({
      anchorEl: null
    })
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

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Submit);
