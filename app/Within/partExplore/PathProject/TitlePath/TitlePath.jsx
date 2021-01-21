import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ModalEmit from '../../../../Components/ModalEmit/ModalEmit.jsx';
import SvgCopy from '../../../../Components/Svg/SvgIcon_Copy.jsx';
import SvgNetGlobe from '../../../../Components/Svg/SvgIcon_NetGlobe.jsx';
import {
  domain
} from '../../../../../config/services.js';

class TitlePath extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emit: false,
      onShareLink: false,
      onSetlink: false
    };
    this.refHiddenText = React.createRef();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
    this._handleEnter_Setlink = this._handleEnter_Setlink.bind(this);
    this._handleLeave_Setlink = this._handleLeave_Setlink.bind(this);
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
        <div
          className={classnames( styles.boxUpper)}>
          <Link
            to={'/cosmic/explore/path/'+ this.props.projectPath}
            className={classnames('plainLinkButton', styles.linkTitleText)}>
            <span
              className={classnames( "fontTitle", "lineHeight15", "colorEditBlack", "weightBold")}>
              {this.props.title}
            </span>
          </Link>
          <div
            style={{display: 'flex'}}>
            <div
              title={this.props.i18nUIString.catalog["tagTitle_PathProject_ShareLink"]}
              className={classnames(styles.boxBtnShare, styles.boxSubtitleLeft)}
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
                  "fontContent",
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
            <div
              className={classnames(styles.boxSubtitleCenter, 'colorGrey')}>
              {"·"}
            </div>
            <div
              className={classnames(styles.boxSubtitleRight)}>
              <span
                className={classnames(
                  'fontContent', 'colorGrey',
                  styles.spanKey
                )}>
                {this.props.i18nUIString.catalog["text_peopleInspired"]}
              </span>
              <span
                className={classnames(
                  'fontContent', 'colorGrey', "weightBold",
                  styles.spanKey
                )}>
                {
                  this.props.projectInfo.inspiredCount == 0 ?
                  "--" :
                  this.props.projectInfo.inspiredCount
                }
              </span>
              {
                this.props.projectInfo.inspiredYou &&
                <div
                  className="plainBoxDisplay">
                  <span
                    className={classnames("fontContent", "colorGrey")}>
                    {this.props.i18nUIString.catalog["text_youInspired"][0]}
                  </span>
                  <span
                    className={classnames("fontContent", "colorAssistGold")}>
                    {this.props.i18nUIString.catalog["text_youInspired"][1]}
                  </span>
                  <span
                    className={classnames("fontContent", "colorGrey")}>
                    {this.props.i18nUIString.catalog["text_youInspired"][2]}
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
        <div
          className={classnames( styles.boxDescription)}>
          <div
            className={classnames(styles.boxProjectInfo)}>
            {
              ("description" in this.props.projectInfo) &&
              <span
                className={classnames("fontContent", "colorEditLightBlack")}>
                {this.props.projectInfo.description}
              </span>
            }
            {
              ("webLink" in this.props.projectInfo && !!this.props.projectInfo.webLink) &&
              <div
                className={classnames(styles.boxProjectInfoAlias)}>
                <a
                  href={domain.protocol + "://" + this.props.projectInfo.webLink}
                  target={"_blank"}
                  className={classnames(
                    "plainLinkButton", styles.linkSetlink)}
                  onMouseEnter={this._handleEnter_Setlink}
                  onMouseLeave={this._handleLeave_Setlink}>
                  <div
                    className={classnames(styles.boxSvgNetGlobe)}>
                    <SvgNetGlobe/>
                  </div>
                  <span
                    className={classnames(
                      "fontContentPlain", "weightBold", "colorDescripBlack",
                      styles.spanLinkSetlink,
                      { [styles.spanLinkSetlinkMouse]: this.state.onSetlink }
                    )}>
                    {this.props.projectInfo.webLink}
                  </span>
                </a>
              </div>
            }
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

  _handleEnter_Setlink(e){
    this.setState((prevState, props)=>{
      return {
        onSetlink: true
      }
    })
  }

  _handleLeave_Setlink(e){
    this.setState((prevState, props)=>{
      return {
        onSetlink: false
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
