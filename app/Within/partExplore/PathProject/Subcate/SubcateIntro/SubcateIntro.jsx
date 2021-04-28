import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import TitleSubcate from '../TitleSubcate.jsx';
import NavBtnRow from '../../NavFilter/NavBtnRow.jsx';
import SvgCopy from '../../../../../Components/Svg/SvgIcon_Copy.jsx';
import ModalEmit from '../../../../../Components/ModalEmit/ModalEmit.jsx';
import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon
} from "react-share";
import {
  _axios_get_projectNodes,
  _axios_get_nodesUnits
} from '../../axios.js';
import {
  handleNounsList,
} from "../../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../../utils/errHandlers.js';
import {
  domain
} from '../../../../../../config/services.js';

class SubcateIntro extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      emit: false,
      usedNodes: [],
      fetchedUsedNodes: false,
      onBtnSubcate: false
    };
    this.refHiddenText = React.createRef();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleLeave_link = this._handleLeave_link.bind(this);
    this._handleEnter_link = this._handleEnter_link.bind(this);
    this._handleClick_pathCopy = this._handleClick_pathCopy.bind(this);
    this._render_subcates = this._render_subcates.bind(this);
    this._set_usedNodes = this._set_usedNodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_usedNodes();
  }

  componentWillUnmount(){

  }


  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('_filter_map')){
      this.viewFilter = true;
    } else this.viewFilter = false;
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;
    let sharedLink = domain.protocol+ '://'+domain.name + this.props.location.pathname
    if(!!this.props.unitSubCate.first_unit) urlParams.set('unitId', this.props.unitSubCate.first_unit); // no unitSubCate.first_unit is possible
    urlParams.set('unitView', "theater");
    let searchString = urlParams.toString();
    sharedLink = sharedLink + "?" + searchString;

    return (
      <div
        className={classnames(styles.comSubcateIntro)}>
        {
          this.viewFilter ? (
            <div
              className={classnames(styles.boxNodesFilter)}>
              <div
                className={classnames(styles.boxTitleSubcate)}>
                <TitleSubcate
                  {...this.props}/>
              </div>
              {
                this.state.fetchedUsedNodes &&
                <NodesFilter
                  {...this.props}
                  startNode = {null}
                  startList={this.state.usedNodes}
                  _handle_nodeClick={()=>{ /* Do nothing. */ }}
                  _get_nodesUnitsList={(nodesList)=>{
                    // return a promise() to NodesFilter
                    return _axios_get_nodesUnits(this.axiosSource.token, {
                      nodesList: nodesList,
                      pathName: this.props.match.params['pathName'],
                      filterSubCate: this.currentSubCate ? this.currentSubCate : null
                    })
                  }}/>
              }
              <div className={classnames(styles.boxFooter)}/>
            </div>
          ):(
            <div>
              <div
                className={classnames(styles.boxTitleSubcate)}>
                <TitleSubcate
                  {...this.props}/>
              </div>
              <div
                className={classnames(styles.boxEnd)}>
                <div
                  className={classnames(styles.boxEndTtitle)}>
                  <span
                    className={classnames("fontNodesEqual", "lineHeight15", "colorWhite")}>
                    {this.props.i18nUIString.catalog['title_UnitSubcate_End_']}
                  </span>
                  <Link
                    subcateid={this.currentSubCate}
                    to={this.props.location}
                    className={classnames('plainLinkButton')}
                    style={{ display: 'inline-block' }}
                    onMouseEnter={this._handleEnter_link}
                    onMouseLeave={this._handleLeave_link}>
                    {
                      (this.currentSubCate in this.props.subCatesInfo.subCatesObj) &&
                      <span
                        className={classnames(
                          "fontNodesEqual", "weightBold", "colorEditBlack",
                          styles.spanLinkNode,
                          { [styles.spanLinkNodeMouse]: this.state.onBtnSubcate == this.currentSubCate }
                        )}>
                        {"@" + this.props.subCatesInfo.subCatesObj[this.currentSubCate].name}
                      </span>
                    }
                  </Link>
                </div>
                <div
                  className={classnames(styles.boxEndGuiding)}>
                  <span
                    className={classnames("fontContentPlain", "colorWhite")}>
                    {"description about the subcate"}
                  </span>
                </div>
                <div>
                  <div>
                    <span>
                      {"route on map. "}
                    </span>
                  </div>
                  <div>
                    <NavBtnRow
                      {...this.props}/>
                  </div>
                </div>
                <div
                  className={classnames(styles.rowShareNext)}>
                  <div>
                    <span>
                      {"Open"}
                    </span>
                  </div>
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
                        styles.boxCopyBtn
                      )}
                      onClick={this._handleClick_pathCopy}>
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
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  _set_usedNodes(){
    const self = this;
    this.setState({axios: true});

    _axios_get_projectNodes(this.axiosSource.token, {
      pathProject: this.props.match.params['pathName'],
      filterSubCate: this.currentSubCate ? this.currentSubCate: null
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          usedNodes: resObj.main.nodesList,
          fetchedUsedNodes: true
        });
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
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

  _handleEnter_link(event) {
    let subCateId = event.currentTarget.getAttribute('subcateid');
    this.setState({ onBtnSubcate: subCateId })
  }

  _handleLeave_link(event) {
    this.setState({ onBtnSubcate: false })
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SubcateIntro));
