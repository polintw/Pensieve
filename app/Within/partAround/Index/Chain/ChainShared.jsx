import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import ImgPreview from '../../../../Components/ImgPreview.jsx';
import {SvgArrowToRight} from '../../../../Components/Svg/SvgArrow.jsx';
import CreateShare from '../../../../Unit/Editing/CreateShare.jsx';
import {
  submitSharedsList,
  setWithinFlag
} from "../../../../redux/actions/within.js";
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  domain
} from '../../../../../config/services.js';

class ChainShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onNail: false,
      onbtnLink: false,
      onbtnLinkPublic: false,
      unitsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_shareds = this._axios_get_shareds.bind(this);
    this._set_nails_shareds = this._set_nails_shareds.bind(this);
    this._render_sharenails = this._render_sharenails.bind(this);
    this._handleEnter_sharedNail = this._handleEnter_sharedNail.bind(this);
    this._handleLeave_sharedNail = this._handleLeave_sharedNail.bind(this);
    this._handleEnter_PublicExpand = this._handleEnter_PublicExpand.bind(this);
    this._handleLeave_PublicExpand = this._handleLeave_PublicExpand.bind(this);
    this._handleEnter_Expand = this._handleEnter_Expand.bind(this);
    this._handleLeave_Expand = this._handleLeave_Expand.bind(this);
}

  _handleEnter_sharedNail(e){
    this.setState({onNail: e.currentTarget.getAttribute('unitid')})
  }

  _handleLeave_sharedNail(e){
    this.setState({onNail: false})
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //monitor flag for this comp.
    if(this.props.flagChainFetRespond && this.props.flagChainFetRespond != prevProps.flagChainFetRespond) this._set_nails_shareds();
  }

  componentDidMount() {
    this._set_nails_shareds();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.boxSharedTitle)}>
          <span
            className={classnames("fontContentPlain", "weightBold", "colorAssistGold")}>
            {this.props.i18nUIString.catalog["title_Chain_Shareds_"]}</span>
          <div
            className={classnames('smallDisplayBox')}>
            <span
              className={classnames('colorWhiteGrey', 'fontContentPlain')}
              style={{ padding: '0 5px' }}>
              {"．"}
            </span>
            <Link
              to={"/cosmic/explore/user?userId=" + this.props.userInfo.id}
              className={classnames(
                'plainLinkButton')}
              onTouchStart={this._handleEnter_PublicExpand}
              onTouchEnd={this._handleLeave_PublicExpand}
              onMouseEnter={this._handleEnter_PublicExpand}
              onMouseLeave={this._handleLeave_PublicExpand}>
              <span
                className={classnames(
                  "fontContentPlain", "weightBold", styles.spanBaseNode,
                  {
                    [styles.spanBaseNodeMouse]: this.state.onbtnLinkPublic,
                    ["colorWhiteGrey"]: !this.state.onbtnLinkPublic,
                    ["colorEditBlack"]: this.state.onbtnLinkPublic
                  }
                )}>
                {this.props.i18nUIString.catalog['link_PublicExpand']}</span>
            </Link>
          </div>
        </div>
        <div
          className={classnames(styles.boxSharedsDisplay)}>
          <div
            className={classnames(styles.boxModuleShareds)}>
            {this._render_sharenails()}
            <div className={styles.boxPanelGradient}></div>
          </div>
          <div
            className={classnames(styles.boxExpand)}>
            <Link
              to={"/self/shareds"}
              className={classnames(
                'plainLinkButton',
                styles.boxExpandLink,
                {[styles.boxExpandLinkMouseon]: this.state.onbtnLink}
              )}
              onTouchStart={this._handleEnter_Expand}
              onTouchEnd={this._handleLeave_Expand}
              onMouseEnter={this._handleEnter_Expand}
              onMouseLeave={this._handleLeave_Expand}>
              <span
                className={classnames(
                  styles.spanExpandLink,
                  "fontContentPlain",
                  {["colorGrey"]: !this.state.onbtnLink},
                  {["colorAssistOcean"]: this.state.onbtnLink}
                )}>
                {this.props.i18nUIString.catalog["title_Expand"]}
              </span>
              <div
                className={classnames(styles.boxSvgArrow)}>
                <div
                  style={{width: "10px", height: "12px"}}>
                  <SvgArrowToRight
                    mouseOn={this.state.onbtnLink}
                    customStyles={{ fillColorMouseOn: 'rgb(69, 135, 160)', fillColor: '#a3a3a3'}}/>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  _render_sharenails(){
    const self = this;
    let listDOM = this.props.sharedsList.list.map((unitId, index)=>{
      if( !(unitId in self.state.unitsBasic)) return null; //check if unitsBasic was prepared.

      let imgSrcCover = domain.protocol+ '://'+domain.name +'/router/img/'+self.state.unitsBasic[unitId].pic_layer0+'?type=thumb';
      let linkSearch = ((self.props.location.search.length > 0) ? self.props.location.search+'&' : '?') +'unitId='+unitId+'&unitView=theater';
      return (
        <Link
          key={"key_SharedNails_"+index}
          unitid={unitId}
          to={{
            pathname: this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit'),
            search: linkSearch,
            state: {from: this.props.location}
          }}
          className={classnames(
            'plainLinkButton',
            styles.boxImg,
            {[styles.boxImgMouseOn]: (this.state.onNail == unitId)}
          )}
          onMouseEnter={this._handleEnter_sharedNail}
          onMouseLeave={this._handleLeave_sharedNail}>
          <ImgPreview
            blockName={''}
            previewSrc={ imgSrcCover }
            _handleClick_ImgPreview_preview={()=>{}}/>
          {
            (this.state.onNail == unitId) &&
            <div
              className={classnames(styles.mouseOnImg)}>
              <ImgPreview
                blockName={''}
                previewSrc={ imgSrcCover }
                _handleClick_ImgPreview_preview={()=>{}}/>
            </div>
          }
        </Link>
      )
    });

    if(this.props.sharedsList.list.length == 0){
      listDOM.push( // one display only when small screen
        <div
          key={"key_SharedNails_emptyHint_mobile"}
          className={classnames("smallDisplayBox")}
          style={{width: "100%"}}>
          <div
            className={classnames(styles.boxEmptyShared)}>
            <div>
              <span
                className={classnames(stylesFont.fontTitleSmall, stylesFont.colorGrey)}>
                {this.props.i18nUIString.catalog["message_Chain_noSharedsCourage"]}
              </span>
            </div>
          </div>
        </div>
      );
      listDOM.push( // one display in PC
        <div
          key={"key_SharedNails_emptyHint"}
          className={classnames("smallDisplayNone")}
          style={{width: "100%"}}>
          <div
            className={classnames(styles.boxEmptyShared)}
            style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
            <div
              className={classnames(
                styles.boxSharedBtnFrame,
                {
                  [styles.boxSharedBtnFrameTranspa]: this.state.onNail != 'emptyHint',
                  [styles.boxSharedBtnFrameDashed]: this.state.onNail == 'emptyHint',
                })}>
              <div
                unitid={'emptyHint' /* to match the required condition in above */ }
                className={classnames(
                  styles.boxSharedEmptyBtn,
                  {[styles.boxSharedEmptyBtnActiv]: this.state.onNail == 'emptyHint'}
                )}
                onMouseEnter={this._handleEnter_sharedNail}
                onMouseLeave={this._handleLeave_sharedNail}>
                <span
                  className={classnames(
                    styles.spanSharedEmptyBtn,
                    {
                      ['colorGrey']: this.state.onNail != 'emptyHint',
                      ['colorStandard']: this.state.onNail == 'emptyHint',
                    }, 'fontSubtitle_h5')}>
                    {this.props.i18nUIString.catalog["title_share"]}</span>
                  <span
                    className={classnames(
                      styles.spanSharedEmptyBtn, "colorStandard", 'fontSubtitle_h5')}>
                      { "\xa0 |" }</span>
                    <CreateShare
                      {...this.props}
                      _submit_Share_New={()=>{
                        this.props._set_WithinFlag(true, "chainFetRespond");
                        // and remember the editing modal was opened by URL change
                        let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
                        urlParams.delete('creating');
                        this.props.history.replace({
                          pathname: this.props.match.path,
                          search: urlParams.toString(),
                          state: {from: this.props.location}
                        });
                      }}/>
                    </div>
            </div>
            <div>
              <span
                className={classnames(stylesFont.fontTitleSmall, stylesFont.colorGrey)}>
                {this.props.i18nUIString.catalog["message_Chain_noShareds"]}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return listDOM;
  }

  _set_nails_shareds(){
    const self = this;
    this.setState({axios: true});

    this._axios_get_shareds()
    .then((resObj)=>{
      // shareds list was saved in redux state
      self.props._submit_list_Shareds({
        list: resObj.main.unitsList
      });

      return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList) //and use the list to get the data of eahc unit
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          //marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}: we don't really need this part in this comp.
        });
      });

    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        self.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  _axios_get_shareds(){
    return axios({
      method: 'get',
      url: '/router/share/accumulated',
      params: {
        mixIdentity: "all",
        pathProject: !!this.props.userInfo.pathName ? this.props.userInfo.pathName : false,
        limit: 15
      },
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      return resObj;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

  _handleEnter_Expand(e) {
    this.setState({ onbtnLink: true })
  }

  _handleLeave_Expand(e) {
    this.setState({ onbtnLink: false })
  }

  _handleEnter_PublicExpand(e) {
    this.setState({ onbtnLinkPublic: true })
  }

  _handleLeave_PublicExpand(e) {
      this.setState({ onbtnLinkPublic: false })
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    sharedsList: state.sharedsList,
    flagChainFetRespond: state.flagChainFetRespond
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_Shareds: (obj) => { dispatch(submitSharedsList(obj)); },
    _set_WithinFlag: (bool, flag) => {dispatch(setWithinFlag(bool, flag)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChainShared));
