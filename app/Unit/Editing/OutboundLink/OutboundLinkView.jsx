import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import LinkFetch from '../../../Components/LinkFetch/LinkFetch.jsx';

class OutboundLinkView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      urlInput: '',
      lastInput: null,
      urlFetching: '',
      metaObj: {},
      inputfocused: false,
      onBtnDone: false,
      onBtnCancel: false
    };
    this.search = React.createRef();
    this._set_metaData= this._set_metaData.bind(this);
    this._handleClick_done = this._handleClick_done.bind(this);
    this._handleClick_cancel = this._handleClick_cancel.bind(this);
    this._handleEnter_spanDone = this._handleEnter_spanDone.bind(this);
    this._handleLeave_spanDone = this._handleLeave_spanDone.bind(this);
    this._handleEnter_spanCancel = this._handleEnter_spanCancel.bind(this);
    this._handleLeave_spanCancel = this._handleLeave_spanCancel.bind(this);
    this._handleChange_SearchInput = this._handleChange_SearchInput.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if( (prevState.lastInput != this.state.lastInput) && ( (this.state.lastInput - prevState.lastInput) > 1000)){
      this.setState({
        urlFetching: this.state.urlInput,
        metaObj: {
          urlString: this.state.urlInput
        }
      })
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comNodesView)}>
        <div
          className={classnames(styles.boxNodesEditTitle, "fontSubtitle", "colorEditBlack")}>
          {this.props.i18nUIString.catalog["guidingCreateShare_outboundLinkView"]}
        </div>
        <div
          className={classnames(styles.boxForm)}>
          <div
            className={classnames(
              styles.boxInput, 'fontContent', "colorEditBlack",
              {[styles.boxInputFocus]: this.state.inputfocused}
            )}>
            <input
              ref={this.search}
              value={this.state.urlInput}
              onFocus={()=> this.setState((prevState, props)=>{return {inputfocused: true};})}
              onBlur={()=> this.setState((prevState, props)=>{return {inputfocused: false};})}
              onChange={this._handleChange_SearchInput} />
          </div>
        </div>
        <div
          className={classnames(styles.seperationBottom, styles.boxAssignedNodes)}
          style={{maxWidth: '80%', padding: '0 1.4rem 0.4rem'}}>
          {
            this.state.urlFetching.length > 0 &&
            <LinkFetch
              tagA={false}
              dashify={false}
              quotationify={false}
              outboundLink={this.state.urlFetching}
              customStyle={{common: {maxWidth: '100%', fontWeight: 'bold', fontSize: '1.6rem'}}}
              _set_metaData={this._set_metaData}/>
          }
        </div>
        <div
          className={classnames(styles.rowBtn)}>
          <div
            className={classnames(
              styles.seperationBottom, styles.boxBtnCancel, styles.btnSideSeparation,
              {
                [styles.mouseonBtnCancel]: this.state.onBtnCancel
              }
            )}
            onClick={this._handleClick_cancel}
            onMouseEnter={this._handleEnter_spanCancel}
            onMouseLeave={this._handleLeave_spanCancel}>
            <span className={classnames(
                'fontSubtitle_h5',
                {
                  ['colorEditBlack']: !this.state.onBtnCancel,
                  ['colorWhite']: this.state.onBtnCancel
                }
              )}>
              {this.props.i18nUIString.catalog['submit_cancel']}
            </span>
          </div>
          <div
            className={classnames(
              styles.seperationBottom, styles.boxBtnDone, styles.btnSideSeparation,
              {
                [styles.mouseonBtnDone]: this.state.onBtnDone
              }
            )}
            onClick={this._handleClick_done}
            onMouseEnter={this._handleEnter_spanDone}
            onMouseLeave={this._handleLeave_spanDone}>
            <span className={classnames(
                'fontSubtitle_h5',
                {
                  ['colorStandard']: !this.state.onBtnDone,
                  ['colorWhite']: this.state.onBtnDone
                }
              )}>
              {this.props.i18nUIString.catalog['btn_Done']}
            </span>
          </div>
        </div>
      </div>
    )
  }

  _handleChange_SearchInput(){
    let d = new Date();
    let time = d.getTime();
    this.setState({
      urlInput: this.search.current.value,
      lastInput: time
    });
  }

  _set_metaData(fetchedMetaData){
    this.setState((prevState, props)=>{
      let newMetaObj = Object.assign({}, prevState.metaObj, fetchedMetaData);
      return {
        metaObj: newMetaObj
      };
    })
  }

  _handleEnter_spanDone(e) {
    this.setState({
      onBtnDone: true
    })
  }

  _handleLeave_spanDone(e) {
    this.setState({
      onBtnDone: false
    })
  }

    _handleEnter_spanCancel(e) {
      this.setState({
        onBtnCancel: true
      })
    }

    _handleLeave_spanCancel(e) {
      this.setState({
        onBtnCancel: false
      })
    }

  _handleClick_cancel(event){
    event.stopPropagation();
    event.preventDefault();

    this.props._set_nodesEditView('');
  }

  _handleClick_done(event){
    event.stopPropagation();
    event.preventDefault();

    this.props._submit_new_mainLink(this.state.metaObj);
    this.props._set_nodesEditView('');
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitView: state.unitView,
    nounsBasic: state.nounsBasic,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(OutboundLinkView));
