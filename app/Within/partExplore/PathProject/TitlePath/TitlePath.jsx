import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ModalEmit from '../../../../Components/ModalEmit/ModalEmit.jsx';
import SvgCopy from '../../../../Components/Svg/SvgIcon_Copy.jsx';
import {
  domain
} from '../../../../../config/services.js';

class TitlePath extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emit: false,
      onShareLink: false
    };
    this.refHiddenText = React.createRef();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
    this._handleClick_CopyLink = this._handleClick_CopyLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comTitlePath}>
        <div className={classnames(styles.boxTitleText)}>
          <span
            className={classnames( "fontTitle", "lineHeight15", "colorEditBlack", "weightBold")}>
            {this.props.title}
          </span>
        </div>
        <div
          title={this.props.i18nUIString.catalog["tagTitle_PathProject_ShareLink"]}
          className={classnames(styles.boxBtnShare)}
          onMouseEnter={this._handleEnter_Btn}
          onMouseLeave={this._handleLeave_Btn}
          onClick={this._handleClick_CopyLink}>
          <div
            className={classnames(styles.boxIconCopy)}>
            <SvgCopy
              customStyles={"{fill: " + (this.state.onShareLink? "#545454" : "#a3a3a3") + "}"}/>
          </div>
          <div
            className={classnames(
              "fontSubtitle_h5",
              {["colorEditBlack"]: this.state.onShareLink},
              {["colorGrey"]: !this.state.onShareLink},
            )}>
            {this.props.i18nUIString.catalog['btn_PathProject_ShareLink']}
          </div>
          {
            this.state.emit &&
            <div
              className={classnames(styles.boxModalEmit)}>
              <ModalEmit
                text={this.state.emit.text} />
            </div>
          }
          <div style={{width:"100%",position: 'absolute', overflow:'hidden'}}>
            <input
              ref={this.refHiddenText}
              className={classnames(styles.boxHiddenText)}
              value={ domain.protocol+ '://'+domain.name+'/cosmic/explore/path/'+ this.props.projectPath}
              readOnly/>
          </div>
        </div>
      </div>
    )
  }

  _handleClick_CopyLink(e){
    e.stopPropagation();
    e.preventDefault();

    this.refHiddenText.current.select();
    document.execCommand('copy'); // had completed copy to clipboard
    this._set_emitModal(); // than inform the user by emitModal
  }

  _set_emitModal(){
    this.setState({
      emit: { text: this.props.i18nUIString.catalog["message_PathProject_ShareLink"]}
    });
    setTimeout(()=>{
      this.setState((prevState, props)=>{
        return {
          emit:false
        }
      })
    }, 2200)
  }

  _handleEnter_Btn(e){
    this.setState((prevState, props)=>{
      return {
        onShareLink: true
      }
    })
  }

  _handleLeave_Btn(e){
    this.setState((prevState, props)=>{
      return {
        onShareLink: false
      }
    })
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TitlePath));
