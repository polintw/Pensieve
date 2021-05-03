import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SubcateBtnNext from '../Entity/SubcateBtnNext.jsx';
import ModalEmit from '../../Components/ModalEmit/ModalEmit.jsx';
import SvgCopy from '../../Components/Svg/SvgIcon_Copy.jsx';
import {
  setUnitSubcate
} from '../../redux/actions/unit.js';
import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon
} from "react-share";
import {
  domain
} from '../../../config/services.js';

class PathSubcateEnd extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      emit: false,
      hiddenUrl: '',
      onbtnCopy: false,
      onLinkSubcate: false
    };
    this.refHiddenText = React.createRef();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleClick_linkSubcate = this._handleClick_linkSubcate.bind(this);
    this._handleClick_pathCopy = this._handleClick_pathCopy.bind(this);
    this._handleEnter_linkSubcate = this._handleEnter_linkSubcate.bind(this);
    this._handleLeave_linkSubcate = this._handleLeave_linkSubcate.bind(this);
    this._handleEnter_btnCopy = this._handleEnter_btnCopy.bind(this);
    this._handleLeave_btnCopy = this._handleLeave_btnCopy.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
    this.props._set_state_UnitSubcate({ // at the End of th Subcate, reset the next_confirm in case we cycle back to the Cover-which need a re-fetch
      next_confirm: false,
    });
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let sharedLink = domain.protocol+ '://'+domain.name + this.props.location.pathname
    if(!!this.props.unitSubCate.first_unit) urlParams.set('unitId', this.props.unitSubCate.first_unit); // no unitSubCate.first_unit is possible
    urlParams.set('unitView', "pathsubcate");
    let searchString = urlParams.toString();
    sharedLink = sharedLink + "?" + searchString;

    return(
      <div
        className={classnames(
          styles.comPathSubcateEnd, styles.boxPathSubcateCenter)}>
        <div
          className={classnames(
            styles.boxPathSubcateBackBoard, styles.boxEnd)}
          onClick={(event) => { event.stopPropagation(); }}>
          <div
            className={classnames(styles.boxEndTitle)}>
            <span
              className={classnames("fontNodesEqual", "lineHeight15", "colorWhite")}>
              {this.props.i18nUIString.catalog['title_UnitSubcate_End_']}
            </span>
            <Link
              to={''}
              onClick={this._handleClick_linkSubcate}
              className={classnames('plainLinkButton')}
              style={{ display: 'inline-block' }}
              onTouchStart={this._handleEnter_linkSubcate}
              onTouchEnd={this._handleLeave_linkSubcate}
              onMouseEnter={this._handleEnter_linkSubcate}
              onMouseLeave={this._handleLeave_linkSubcate}>
              <span
                className={classnames(
                  "fontNodesEqual",
                  styles.spanLinkSubcate,
                  { [styles.spanLinkSubcateMouse]: this.state.onLinkSubcate }
                )}>
                {"@" + this.props.unitEntity.pathSubCate.currentSubcateObj["name"] + "!"}
              </span>
            </Link>
          </div>
          <div
            className={classnames(styles.boxEndGuiding)}>
            <span
              className={classnames("fontContentPlain", "colorWhite")}>
              {this.props.i18nUIString.catalog['guiding_UnitSubcate_End_']}
            </span>
          </div>
          <div
            className={classnames(styles.rowSocialIcons)}>
            <div
              className={classnames(styles.boxIconLeft)}>
              <LineShareButton
                url={sharedLink}
                className="Demo__some-network__share-button">
                <LineIcon
                  size={32} round
                  bgStyle={{fill: "transparent"}}
                  iconFillColor={"#a3a3a3"}/>
              </LineShareButton>
            </div>
            <div>
              <FacebookShareButton
                url={sharedLink}
                className="Demo__some-network__share-button">
                <FacebookIcon
                  size={32} round
                  bgStyle={{fill: "transparent"}}
                  iconFillColor={"#a3a3a3"}/>
              </FacebookShareButton>
            </div>
          </div>
          <div
            className={classnames(styles.rowShareNext)}>
            <div
              className={classnames(styles.frameCopyBtn)}>
              <div style={{width: '100%', position: 'absolute',overflow:'hidden'}}>
                <input
                  ref={this.refHiddenText}
                  className={classnames(styles.boxHiddenText)}
                  value={sharedLink}
                  readOnly/>
              </div>
              <div
                title={this.props.i18nUIString.catalog["tagTitle_UnitSubcate_End_CopyBtn"]}
                className={classnames(
                  styles.boxCopyBtn,
                  {[styles.boxCopyBtnActiv]: this.state.onbtnCopy}
                )}
                onClick={this._handleClick_pathCopy}
                onTouchStart={this._handleEnter_btnCopy}
                onTouchEnd={this._handleLeave_btnCopy}
                onMouseEnter={this._handleEnter_btnCopy}
                onMouseLeave={this._handleLeave_btnCopy}>
                <div
                  className={classnames(styles.boxIconCopy)}>
                  <SvgCopy
                    customStyles={"{fill: #FFFFFF}"}/>
                </div>
                <span
                  className={classnames(
                    "fontSubtitle_h5", "colorWhite",
                  )}>
                  {this.props.i18nUIString.catalog['btn_UnitSubcate_End_CopyBtn']}
                </span>
                {
                  this.state.emit &&
                  <div
                    className={classnames(styles.boxModalEmit)}>
                    <ModalEmit
                      text={this.state.emit.text} />
                  </div>
                }
              </div>
            </div>
            <div
              className={classnames(styles.frameNextBtn)}>
              <SubcateBtnNext
                {...this.props}/>
            </div>
          </div>
        </div>
      </div>
    )
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

  _handleClick_linkSubcate(event){
    event.preventDefault();
    event.stopPropagation();
    // and Notice! after the replaceState has been done
    // we re-assign to make sure to scroll, the unit would all reset
    window.location.assign("/cosmic/explore/path/" + this.props.unitEntity.pathSubCate.currentPathProject + "?tab=routes&subCate=" + this.props.unitEntity.pathSubCate.currentSubCateId)
  }

  _handleClick_pathCopy(event){
    event.preventDefault();
    event.stopPropagation();

    this.refHiddenText.current.select();
    document.execCommand('copy'); // had completed copy to clipboard
    this._set_emitModal(); // than inform the user by emitModal
  }

  _handleEnter_linkSubcate(e){
    this.setState({onLinkSubcate: true})
  }

  _handleLeave_linkSubcate(e){
    this.setState({onLinkSubcate: false})
  }

  _handleEnter_btnCopy(e){
    this.setState({onbtnCopy: true})
  }

  _handleLeave_btnCopy(e){
    this.setState({onbtnCopy: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    unitSubCate: state.unitSubCate
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_state_UnitSubcate: (expression)=>{dispatch(setUnitSubcate(expression));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PathSubcateEnd));
