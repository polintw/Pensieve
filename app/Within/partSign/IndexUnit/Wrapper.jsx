import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SetBtnSign from '../components/SetBtnSign/SetBtnSign.jsx';
import stylesNail from "../../stylesNail.module.css";
import NailFeedWide from '../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import {
  handleNounsList,
  handleUsersList,
  handlePathProjectsList
} from "../../../redux/actions/general.js";
import {axios_get_UnitsBasic} from '../../../utils/fetchHandlers.js';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";
import _set_HeadInfo from '../../../utils/_headSetting.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      savedPosition: null,
      onLink: false,
      headSetify: false
    };
    this.axiosSource = axios.CancelToken.source();
    this.wrapperAround = React.createRef();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._handleEnter_onLink = this._handleEnter_onLink.bind(this);
    this._handleLeave_onLink = this._handleLeave_onLink.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // and the way to 'hide' Feed when the Unit was opened
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let prevUrlParmas = new URLSearchParams(prevProps.location.search);
    let prevUnitView = null;
    let prevUnitId = prevUrlParmas.get('unitId');
    if(prevUrlParmas.has('unitView')){
      prevUnitView = prevUrlParmas.get('unitView');
    };
    if( !!this.unitView && (!this.state.savedPosition && this.state.savedPosition != 0)){ // when load directlly, position would be '0' which would be recognize as 'false'
      let savedPosition = window.scrollY;
      this.setState((prevState, props)=>{
        return {
          savedPosition: savedPosition
        };
      }, ()=>{
        this.wrapperAround.current.style.display='none';
      });
    }
    else if( !this.unitView && prevUnitView){
      this.wrapperAround.current.style={};
      window.scroll(0, prevState.savedPosition);
      this.setState({
        savedPosition: null
      });
    };
    // update head setting by URL
    if(
      !this.state.headSetify ||
      (this.unitId !== prevUnitId)
    ){
      if( !(this.unitId in this.state.unitsBasic) ) return;
      let obj = {
        title: '',
        description: '',
        img: ''
      };
      // Cornerth．Polin Chou | 臺北市/Food/Restaurant
      // (this.state.unitBasic[this.unitId].nounsList)

      _set_HeadInfo(window.location.href, obj);
      this.setState({
        headSetify: true
      });
    };
  }

  componentDidMount(){
    this._set_feedUnits();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_FooterHint(){
    return (
      <span
        className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
        {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
    );
  }

  _render_FeedNails(){
    if( !this.unitId) return; // no render if no unitId
    //render if there are something in the data
    if( !(this.unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
    let nailsDOM = this.state.unitsList.map((unitId, index)=>{
      // for mobile device, use one special Nail
      let cssVW = window.innerWidth;
      if(cssVW < 860) {
        return (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(styles.boxModuleItem)}>
            <div
              className={classnames(stylesNail.boxNail)}>
              <NailFeedMobile
                {...this.props}
                leftimg={false}
                unitId={unitId}
                frameType={'wide'}
                linkPath={this.props.location.pathname}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic} />
            </div>
          </div>
        );
      };
      // or cssVW > 860
      return (
        <div
          key={"key_FeedAssigned_new_"+index}
          className={classnames(styles.boxModuleItem, stylesNail.custNailWide)}>
          <div
            className={classnames(stylesNail.boxNail)}>
            <NailFeedWide
              {...this.props}
              leftimg={false}
              unitId={unitId}
              linkPath={this.props.location.pathname}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        </div>
      );
    });

    return nailsDOM;
  }

  render(){
    /*
    this comp. mimic the Around/Wrapper, and its entire children.
    so did the styles we used here.
    */
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('unitView')){
      this.unitView = urlParams.get('unitView');
    } else this.unitView = null;
    if(urlParams.has('unitId')){
      this.unitId = urlParams.get('unitId');
    } else this.unitId = false;

    return(
      <div>
        <div
          ref={this.wrapperAround}
          className={classnames(styles.comAroundWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxUnit)}>
            <div
              className={classnames(styles.boxTitle)}
              style={{width: '100%', textAlign: 'right', padding: '5.07vh 0 0'}}>
              <span
                className={classnames("fontContentPlain", "weightBold", "colorAssistGold")}>
                {this.props.i18nUIString.catalog["title_Notes"]}</span>
            </div>
            <div>
              <div
                className={classnames(
                  styles.boxModule,
                  styles.boxModuleSmall)}>
                  {this._render_FeedNails()}
                </div>
            </div>
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            <div
              className={classnames(styles.boxFooterBtn)}>
              <span
                className={classnames(styles.boxTitle, "colorSignBlack", "fontTitle")}>
                {this.props.i18nUIString.catalog["guiding_IndexUnsign_FooterInvite"]}
              </span>
              <div
                className={classnames(styles.boxSetBtnSign)}>
                <SetBtnSign
                  {...this.props}/>
              </div>
            </div>
            <div>
              <span
                className={classnames(
                  "fontContentPlain", "colorEditBlack")}>
                {this.props.i18nUIString.catalog['guiding_IndexUnit_backToHome']}
              </span>
              <Link
                to={'/'}
                className={classnames(
                  'plainLinkButton')}
                onTouchStart={this._handleEnter_onLink}
                onTouchEnd={this._handleLeave_onLink}
                onMouseEnter={this._handleEnter_onLink}
                onMouseLeave={this._handleLeave_onLink}>
                <span
                  className={classnames(
                    "fontContentPlain", styles.spanLink,
                    {
                      ["colorEditBlack"]: this.state.onLink,
                      ["colorStandard"]: !this.state.onLink,
                      [styles.spanLinkMouse]: this.state.onLink,
                    }
                  )}>
                    {this.props.i18nUIString.catalog['submit_nav_backToHome']}
                  </span>
              </Link>
            </div>
          </div>
        </div>
        {
          (this.unitId && !!this.unitView) &&
          <UnitUnsign
            {...this.props}
            anchorUnit = {this.unitId}
            _refer_von_unit={this.props._refer_to}/>
        }
      </div>
    )
  }

  _set_feedUnits(){
    const self = this;
    this.setState({axios: true});
    let unitsList = this.unitId ? [this.unitId] : [];

    axios_get_UnitsBasic(this.axiosSource.token, unitsList) //and use the list to get the data of eahc unit
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.props._submit_PathsList_new(resObj.main.pathsList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsList: unitsList,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
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

  _handleEnter_onLink(e){
    this.setState({onLink: true})
  }

  _handleLeave_onLink(e){
    this.setState({
      onLink: false})
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_PathsList_new: (arr) => { dispatch(handlePathProjectsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
