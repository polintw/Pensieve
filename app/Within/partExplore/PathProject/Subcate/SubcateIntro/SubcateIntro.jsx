import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavBtnRow from '../../NavFilter/NavBtnRow.jsx';
import SvgCopy from '../../../../../Components/Svg/SvgIcon_Copy.jsx';
import ModalEmit from '../../../../../Components/ModalEmit/ModalEmit.jsx';
import ImgPreview from '../../../../../Components/ImgPreview.jsx';
import NodesFilter from '../../../../../Components/NodesFilter/NodesFilter.jsx';
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
      onBtnSubcate: false,
      onLinkCopy: false,
      onUnitImg: false,
      onBtnOpen: false
    };
    this.refHiddenText = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._set_usedNodes = this._set_usedNodes.bind(this);
    this._render_rowSNS = this._render_rowSNS.bind(this);
    this._render_imgUnits = this._render_imgUnits.bind(this);
    this._handleClick_pathCopy = this._handleClick_pathCopy.bind(this);
    this._handleEnter_CopyBtn = this._handleEnter_CopyBtn.bind(this);
    this._handleLeave_CopyBtn = this._handleLeave_CopyBtn.bind(this);
    this._handleEnter_link = this._handleEnter_link.bind(this);
    this._handleLeave_link = this._handleLeave_link.bind(this);
    this._handleEnter_UnitImg = this._handleEnter_UnitImg.bind(this);
    this._handleLeave_UnitImg = this._handleLeave_UnitImg.bind(this);
    this._handleEnter_btnOpen = this._handleEnter_btnOpen.bind(this);
    this._handleLeave_btnOpen = this._handleLeave_btnOpen.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_usedNodes();
  }

  componentWillUnmount(){

  }

  _render_imgUnits(){
    let toSearch = new URLSearchParams(this.props.location.search);
    toSearch.set('unitView', "theater");
    let imgUnitsDOM = this.props.subCatesObj[this.currentSubCate].unitsListBySerial.map((unitId, index)=>{
      toSearch.set('unitId', unitId);
      let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'+this.props.unitsBasic[unitId].pic_layer0+'?type=thumb';
      return (
        <Link
          key={"key_subcate_imgUnits_" + index}
          unitid={unitId}
          to={{
            pathname: this.props.location.pathname + '/unit',
            search: toSearch.toString(),
            state: {from: this.props.location}
          }}
          className={classnames(
            'plainLinkButton',styles.boxImg)}
          onMouseEnter={this._handleEnter_UnitImg}
          onMouseLeave={this._handleLeave_UnitImg}>
          <div
            className={classnames(styles.boxImgMouseOff)}>
            <ImgPreview
              blockName={''}
              previewSrc={imgSrcCover}
              _handleClick_ImgPreview_preview={() => {  }} />
          </div>
          {
            (this.state.onUnitImg == unitId) &&
            <div
              className={classnames(styles.boxImgMouseOn)}>
              <ImgPreview
                blockName={''}
                previewSrc={ imgSrcCover }
                _handleClick_ImgPreview_preview={()=>{}}/>
            </div>
          }
        </Link>
      )
    });
    return imgUnitsDOM;
  }

  _render_rowSNS(){
    return (
      <div
        key={"key_SubcateIntro_rowSNS"}
        className={classnames(styles.rowSocialIcons)}>
        <div
          className={classnames(styles.boxSocialIconMargin)}>
          <LineShareButton
            url={this.sharedLink}
            className="Demo__some-network__share-button">
            <LineIcon
              size={32} round
              bgStyle={{fill: "transparent"}}
              iconFillColor={"#a3a3a3"}/>
          </LineShareButton>
        </div>
        <div
          className={classnames(styles.boxSocialIconMargin)}>
          <FacebookShareButton
            url={this.sharedLink}
            className="Demo__some-network__share-button">
            <FacebookIcon
              size={32} round
              bgStyle={{fill: "transparent"}}
              iconFillColor={"#a3a3a3"}/>
          </FacebookShareButton>
        </div>
        <div
          title={this.props.i18nUIString.catalog["tagTitle_PathProject_ShareLink"]}
          className={classnames(styles.boxBtnCopy)}
          onMouseEnter={this._handleEnter_CopyBtn}
          onMouseLeave={this._handleLeave_CopyBtn}
          onClick={this._handleClick_pathCopy}>
          <div
            className={classnames(styles.boxIconCopy)}>
            <SvgCopy
              customStyles={"{fill: " + (this.state.onLinkCopy? "#545454" : "#a3a3a3") + "}"}/>
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
              value={this.sharedLink}
              readOnly/>
          </div>
        </div>
      </div>
    )
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('_filter_map')){
      this.viewFilter = true;
    } else this.viewFilter = false;
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;
    let sharedPath = domain.protocol+ '://'+domain.name + this.props.location.pathname + '/unit';
    let sharedSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
    sharedSearch.set('unitId', this.props.subCatesObj[this.currentSubCate].unitsListBySerial[0]);
    sharedSearch.set('unitView', "pathsubcate");
    let searchString = sharedSearch.toString();
    this.sharedLink = sharedPath + "?" + searchString;

    return (
      <div
        className={classnames(styles.comSubcateIntro)}>
        {
          this.viewFilter ? (
            <div
              className={classnames(styles.boxNodesFilter)}>
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
                      filterSubCate: this.currentSubCate
                    })
                  }}/>
              }
            </div>
          ):(
            <div
              className={classnames(
                styles.boxIntro,
                {
                  [styles.widthSubcateIntroWide]: this.viewFilter,
                  [styles.widthSubcateIntro]: !this.viewFilter,
                })}>
              <div
                className={classnames(styles.boxOverview)}>
                <div
                  className={classnames(styles.boxOverviewTop)}>
                  <div
                    className={classnames(styles.boxOverviewLeft)}>
                    <div
                      className={classnames(styles.boxSubcateTitle)}>
                      <Link
                        subcateid={this.currentSubCate}
                        to={this.props.location}
                        className={classnames('plainLinkButton')}
                        style={{ display: 'inline-block' }}
                        onMouseEnter={this._handleEnter_link}
                        onMouseLeave={this._handleLeave_link}>
                        <span
                          className={classnames(
                            "fontNodesEqual", "weightBold", "lineHeight15", "colorEditBlack")}>
                            {"@"}
                          </span>
                          <span
                            className={classnames(
                              "fontNodesEqual", "weightBold", "lineHeight15", "colorEditBlack")}>
                              {this.props.subCatesObj[this.currentSubCate].name}
                            </span>
                          </Link>
                    </div>
                  </div>
                  <div
                    className={classnames(styles.boxOverviewRight)}>
                    <div
                      className={classnames("smallDisplayNone")}>
                      {this._render_rowSNS()}
                    </div>
                  </div>
                </div>
                <div
                  className={classnames(styles.boxOverviewSecond)}>
                  <div
                    className={classnames(styles.boxOverviewLeft)}>
                    <div
                      className={classnames(styles.boxDescription)}>
                      <span
                        className={classnames("fontContentPlain", "colorEditBlack")}>
                        {this.props.subCatesObj[this.currentSubCate].description}
                      </span>
                    </div>
                  </div>
                  <div
                    className={classnames(styles.boxOverviewRight)}>
                    <div
                      className={classnames(styles.rowOpen)}>
                      <Link
                        to={{
                          pathname: this.props.location.pathname + '/unit',
                          search: searchString,
                          state: {from: this.props.location}
                        }}
                        className={classnames(
                          'plainLinkButton', styles.boxOpenBtn,
                          {[styles.boxOpenBtnActiv]: this.state.onBtnOpen}
                        )}
                        onTouchStart={this._handleEnter_btnOpen}
                        onTouchEnd={this._handleLeave_btnOpen}
                        onMouseOver={this._handleEnter_btnOpen}
                        onMouseOut={this._handleLeave_btnOpen}>
                        <span
                          className={classnames(
                            "fontSubtitle_h5", "colorWhite",
                          )}>
                          {this.props.i18nUIString.catalog['submit_Open']}
                        </span>
                      </Link>
                    </div>
                    <div
                      className={classnames(styles.rowBtnMap)}>
                      <div style={{marginRight: '1.5rem'}}>
                        <span
                          className={classnames("fontContent", "colorEditBlack")}>
                          {this.props.i18nUIString.catalog['guiding_PathProject_SubcateMap']}
                        </span>
                      </div>
                      <div>
                        <NavBtnRow
                          {...this.props}/>
                      </div>
                    </div>
                  </div>
                  <div
                    className={classnames("smallDisplayBox")}
                    style={{marginTop: '16px'}}>
                    {this._render_rowSNS()}
                  </div>
                </div>
              </div>
              <div
                className={classnames(styles.boxImgUnits)}>
                {this._render_imgUnits()}
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

  _handleEnter_UnitImg(e) {
    let unitId = e.currentTarget.getAttribute('unitid');
    this.setState({ onUnitImg: unitId });
  }

  _handleLeave_UnitImg(e) {
    this.setState({ onUnitImg: false })
  }

  _handleEnter_btnOpen(e){
    this.setState((prevState, props)=>{
      return {
        onBtnOpen: true
      }
    })
  }

  _handleLeave_btnOpen(e){
    this.setState((prevState, props)=>{
      return {
        onBtnOpen: false
      }
    })
  }

  _handleEnter_CopyBtn(e){
    this.setState((prevState, props)=>{
      return {
        onLinkCopy: true
      }
    })
  }

  _handleLeave_CopyBtn(e){
    this.setState((prevState, props)=>{
      return {
        onLinkCopy: false
      }
    })
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
