import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AccountPalette from '../../../../Components/AccountPalette.jsx';
import ModalEmit from '../../../../Components/ModalEmit/ModalEmit.jsx';
import SvgCopy from '../../../../Components/Svg/SvgIcon_Copy.jsx';
import {
  domain
} from '../../../../../config/services.js';

class TitleUser extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emit: false,
      onShareLink: false,
      onLinkExpand: false
    };
    this.refHiddenText = React.createRef();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
    this._handleEnter_LinkExpand = this._handleEnter_LinkExpand.bind(this);
    this._handleLeave_LinkExpand = this._handleLeave_LinkExpand.bind(this);
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
      <div className={styles.comTitleUser}>
        <div
          className={classnames(styles.boxTitle)}
          style={{width: '100%',position: 'relative', textAlign: 'center'}}>
          {
            (this.props.userId == this.props.userInfo.id) &&
            <div
              className={classnames(styles.boxTitlePersonal)}>
              <div style={{fontSize: '2.4rem', lineHeight: '1.5'}}>{"\xa0"}</div>
              <div>
                <span
                  className={classnames(
                    "fontContent", 'colorEditBlack',
                    "smallDisplayNone"
                  )}>
                  {"|"}
                </span>
                <Link
                  to={"/self/shareds"}
                  className={classnames(
                    'plainLinkButton', styles.boxLinkExpand)}
                  onTouchStart={this._handleEnter_LinkExpand}
                  onTouchEnd={this._handleLeave_LinkExpand}
                  onMouseEnter={this._handleEnter_LinkExpand}
                  onMouseLeave={this._handleLeave_LinkExpand}>
                  <span
                    className={classnames(
                      "fontContent", styles.spanBaseNode,
                      {
                        ["colorWhiteGrey"]: !this.state.onLinkExpand,
                        ['colorEditBlack']: this.state.onLinkExpand,
                        [styles.spanBaseNodeMouse]: this.state.onLinkExpand
                      }
                    )}>
                    {this.props.i18nUIString.catalog["link_ExpandPersonal"]}
                  </span>
                </Link>
              </div>
            </div>
          }
          <Link
            to={'/cosmic/explore/user?userId=' + this.props.userId }
            className={classnames('plainLinkButton', styles.linkTitleText)}>
            <AccountPalette
              size={"regularBold"}
              referLink={ false }
              styleFirst={{fontSize: '2.4rem'}}
              styleLast={{fontSize: '2.4rem'}}
              userId={this.props.userId}
              authorIdentity={"user"} />
          </Link>
          {
            (this.props.userId == this.props.userInfo.id) &&
            <div
              className={classnames(styles.smallLineExpand)}>{"\xa0"}</div>
          }
        </div>
        <div
          className={classnames(styles.boxTitle, styles.boxSubtitle)}>
          <div
            className={classnames(styles.boxSubtitleRow)}>
            <div
              className={classnames(styles.boxSubtitleLeft)}>
              <span
                className={classnames(
                  'fontContent', 'colorGrey',
                  styles.spanKey
                )}>
                {this.props.i18nUIString.catalog["title_shared"]}
              </span>
              <span
                className={classnames("fontContent", "colorEditBlack", "weightBold")}>
                {this.props.userBasicInfo.countShareds}
              </span>
            </div>
            <div
              className={classnames(styles.boxSubtitleCenter)}>
              {"·"}
            </div>
            <div
              className={classnames(styles.boxSubtitleRight)}>
              <span
                className={classnames(
                  'fontContent', 'colorGrey',
                  styles.spanKey
                )}>
                {this.props.i18nUIString.catalog["text_since"]}
              </span>
              <span
                className={classnames("fontContent", "colorEditBlack", "weightBold")}>
                {this.props.userBasicInfo.timeCreate}
              </span>
            </div>
          </div>
          <div
            className={classnames(styles.boxSubtitleRow)}>
            <div
              className={classnames(styles.boxSubtitleLeft)}>
              <span
                className={classnames(
                  'fontContent', 'colorGrey',
                  styles.spanKey
                )}>
                {this.props.i18nUIString.catalog["text_peopleInspired"]}
              </span>
              <span
                className={classnames(
                  'fontContent', 'colorEditBlack', "weightBold",
                  styles.spanKey
                )}>
                {
                  this.props.userBasicInfo.inspiredCount == 0 ?
                  "--" :
                  this.props.userBasicInfo.inspiredCount
                }
              </span>
              {
                this.props.userBasicInfo.inspiredYou &&
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
            <div
              className={classnames(styles.boxSubtitleCenter)}>
              {"·"}
            </div>
            <div
              title={this.props.i18nUIString.catalog["tagTitle_PathProject_ShareLink"]}
              className={classnames(
                styles.boxBtnShare, styles.boxSubtitleRight)}
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
                    value={ domain.protocol+ '://'+domain.name+'/cosmic/explore/user?userId='+ this.props.userId}
                    readOnly/>
                </div>
              </div>
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

  _handleEnter_LinkExpand(event) {
    this.setState({ onLinkExpand: true });
  }

  _handleLeave_LinkExpand(event){
    this.setState({onLinkExpand: false});
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
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
)(TitleUser));
