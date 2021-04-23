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
      onbtnCopy: false
    };
    this.refHiddenText = React.createRef();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleClick_pathCopy = this._handleClick_pathCopy.bind(this);
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
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let sharedLink = domain.protocol+ '://'+domain.name + this.props.location.pathname
    if(!!this.props.unitSubCate.first_unit) urlParams.set('unitId', this.props.unitSubCate.first_unit); // no unitSubCate.first_unit is possible
    urlParams.set('unitView', "theater");
    let searchString = urlParams.toString();
    sharedLink = sharedLink + "?" + searchString;

    return(
      <div
        className={classnames(styles.comPathSubcateEnd)}>
        <div
          className={classnames(styles.boxEnd)}
          onClick={(event) => { event.stopPropagation(); }}>
          <div>
            <span>
              {"title"}
            </span>
          </div>
          <div>
            <span>
              {"Share if you think the author did a good job!"}
            </span>
          </div>
          <div
            style={{display: "flex"}}>
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
            <div
              className={classnames(styles.boxIconLeft)}>
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
            className={classnames(styles.comEntitySubcate)}>
            <div
              className={classnames(styles.boxVisitRegister)}>
              <div
                title={this.props.i18nUIString.catalog["tagTitle_PathProject_ShareLink"]}
                className={classnames(
                  styles.boxGuidingText,
                  {[styles.boxGuidingTextActiv]: this.state.onbtnCopy}
                )}
                onClick={this._handleClick_pathCopy}
                onTouchStart={this._handleEnter_btnCopy}
                onTouchEnd={this._handleLeave_btnCopy}
                onMouseEnter={this._handleEnter_btnCopy}
                onMouseLeave={this._handleLeave_btnCopy}>
                <div
                  className={classnames(styles.boxIconCopy)}>
                  <SvgCopy
                    customStyles={"{fill: " + (this.state.onbtnCopy? "#545454" : "#a3a3a3") + "}"}/>
                </div>
                <span
                  className={classnames(
                    "fontSubtitle_h5", "colorWhite", styles.spanGuidingText,
                  )}>
                  {this.props.i18nUIString.catalog['btn_UnitEntity_Subcate_ModalBtn']}
                </span>
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
                    value={sharedLink}
                    readOnly/>
                </div>
              </div>
            </div>
            <div>
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

  _handleClick_pathCopy(event){
    event.preventDefault();
    event.stopPropagation();

    this.refHiddenText.current.select();
    document.execCommand('copy'); // had completed copy to clipboard
    this._set_emitModal(); // than inform the user by emitModal
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

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PathSubcateEnd));
