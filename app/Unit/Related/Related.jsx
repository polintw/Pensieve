import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  _axios_get_responds
} from '../utils.js';
import NailFeedWide from '../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import NailRelatedOrigin from '../../Components/Nails/NailRelatedOrigin/NailRelatedOrigin.jsx';
import {
  setUnitView,
  submitUnitRespondsList
} from "../../redux/actions/unit.js";
import {
  handleNounsList,
  handleUsersList,
} from "../../redux/actions/general.js";
import {axios_get_UnitsBasic} from '../../utils/fetchHandlers.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class Related extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onEnterSubmit: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._check_Position = this._check_Position.bind(this);
    this._set_respoondsUnits = this._set_respoondsUnits.bind(this);
    this._render_RespondsNails = this._render_RespondsNails.bind(this);
    this._render_relatedOrigin = this._render_relatedOrigin.bind(this);
    this._handleClick_hrefNail = this._handleClick_hrefNail.bind(this);
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleClick_UnitSwitch = this._handleClick_UnitSwitch.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //due to update to unitId only still Redirect to a new URL
    //check again to re-define the URL
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=related');
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentDidMount(){
    this._set_respoondsUnits();
    window.addEventListener("scroll", this._check_Position);

    //replace the URL display in the browser bar if not from independt page
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=related');
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    this.props._submit_list_UnitResponds({ list: [], scrolled: true }, true); // reset the responds state to initial
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_RespondsNails(){
    let groupsDOM = [];
    const _nailsGroup = (unitGroup, groupIndex)=>{
      let nailsDOM = [];
      unitGroup.forEach((unitId, index) => {
        //render if there are something in the data
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
        // for mobile device, use one special Nail
        let cssVW = window.innerWidth;
        if(cssVW < 860) {
          nailsDOM.push(
            <div
              key={"key_FeedAssigned_new_" + index}
              className={classnames(styles.boxNail, styles.custNailWide)}
              unitid={unitId}
              onClick={this._handleClick_hrefNail}>
              <NailFeedMobile
                {...this.props}
                leftimg={false}
                unitId={unitId}
                linkPath={false}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic} />
            </div>
          );
          return;
        };
        // for laptop / desktop, change nail by cycles
        nailsDOM.push (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(styles.boxNail, styles.custNailWide)}
            unitid={unitId}
            onClick={this._handleClick_hrefNail}>
            <NailFeedWide
              {...this.props}
              leftimg={ false}
              unitId={unitId}
              linkPath={false}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        );
      });

      return nailsDOM;
    };

    this.props.unitCurrentResponds.list.forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
          className={classnames(
            styles.boxModule,
            styles.boxModuleSmall,
          )}>
          {_nailsGroup(unitGroup, index)}
        </div>
      );
    });

    return groupsDOM;
  }

  _render_relatedOrigin(){
    let unitBasic = {
      unitId: this.props.unitCurrent.unitId,
      authorId: this.props.unitCurrent.authorBasic.authorId,
      pic_layer0: this.props.unitCurrent.coverSrc,
      createdAt: this.props.unitCurrent.createdAt,
      marksList: this.props.unitCurrent.coverMarksList, // only the marks of cover
      nounsList: this.props.unitCurrent.nouns.list
    };
    let marksBasic = this.props.unitCurrent.coverMarksData; //only the marks of cover

    return (
      <div
        className={classnames(styles.boxNail)}
        style={{width: '100%', margin:'0', backgroundColor: 'transparent', overflow: 'visible'}}
        unitid={this.props.unitCurrent.unitId}
        onClick={this._handleClick_hrefNail}>
        <NailRelatedOrigin
          {...this.props}
          leftimg={ false}
          unitId={this.props.unitCurrent.unitId}
          linkPath={false}
          imgSrc={unitBasic.pic_layer0 /*unitCurrent has diff route patern compare to the regular thumb for Nail*/}
          unitBasic={unitBasic}
          marksBasic={marksBasic}/>
      </div>

    )
  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');

    return(
      <div
        className={classnames(styles.comRelated)}>
        <div
          className={classnames( styles.boxModule)}
          style={{width: '90%', padding: '12px 0'}}>
          {this._render_relatedOrigin()}
        </div>
        <div>
          <div
            className={classnames(styles.boxTitle)}>
            <span
              className={classnames('fontContentPlain', "weightBold", "colorAssistGold")}>
              {this.props.i18nUIString.catalog["title_Unit_ListResponds"]}</span>
          </div>
          {
            (this.props.unitCurrentResponds.list.length > 0) &&
            <div>
              {this._render_RespondsNails()}
            </div>
          }

          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
            )}
            style={{justifyContent: 'center'}}>

            <div style={{margin: '12px 0', width: '90%', borderBottom: 'solid 0.75px #b8b8b8'}}></div>

            <div
              style={{textAlign: 'center'}}>
              <span
                className={classnames(styles.spanBottomDescript, "fontTitleSmall", "colorWhiteGrey")}>
                {
                  (this.props.unitCurrent.identity=="viewer") &&
                  this.props.i18nUIString.catalog['guiding_Unit_Responds_none']
                }
                {
                  ((this.props.unitCurrent.identity=="author") &&
                   (this.props.unitCurrentResponds.list.length > 0) ) &&
                  this.props.i18nUIString.catalog['guiding_Unit_Responds_author']
                }
                {
                  ((this.props.unitCurrent.identity=="author") &&
                   (this.props.unitCurrentResponds.list.length == 0) ) &&
                  this.props.i18nUIString.catalog['guiding_Unit_Responds_authorEmpty']
                }
              </span>
              {
                (this.props.unitCurrent.identity=="viewer") &&
                <div
                  className={classnames(styles.boxTitle, styles.btnSubmit)}
                  style={Object.assign({},
                    (this.state.onEnterSubmit)? {border:'solid 1px #FFFFFF', cursor: 'pointer'}:
                    {border:'solid 1px #d8d8d8', backgroundColor: 'transparent'}
                  )}
                  onClick={this._handleClick_UnitSwitch}
                  onMouseEnter={this._handleEnter_Submit}
                  onMouseLeave={this._handleLeave_Submit}>
                  <span
                    className={classnames(
                      'centerAlignChild',
                      "fontSubtitle_h5",
                      {["colorWhiteGrey"]: (!this.state.onEnterSubmit)},
                      {["colorWhite"]: (this.state.onEnterSubmit)}
                    )}>
                    {this.props.i18nUIString.catalog["submit_respond"]}
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
        <div ref={this.refScroll}/>
        <div
          className={styles.boxFooter}>
        </div>
      </div>
    )
  }

  _check_Position(){
    let boxScrollBottom = this.refScroll.current.getBoundingClientRect().bottom, //bottom related top of viewport of box Scroll
        windowHeightInner = window.innerHeight; //height of viewport
    //now, the bottom would change base on scroll, and calculate from the top of viewport
    //we set the threshould of fetch to the 2.5 times of height of viewport.
    //But! we only fetch if we are 'not' fetching--- check the axios status.
    if(!this.state.axios &&
      boxScrollBottom < (2.5*windowHeightInner) &&
      boxScrollBottom > windowHeightInner && // safety check, especially for the very beginning, or nothing in the list
      this.props.unitCurrentResponds.scrolled // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_respoondsUnits();
    }
  }

  _set_respoondsUnits(){
    // feeds was selected by the last unit get last round
    let listUnitBase = false,
        list = (this.props.unitCurrentResponds.list.length > 0)? this.props.unitCurrentResponds.list : false;

    if(list){ //that's, if the list was empty---like at the beginning--- the listUnitBase would be 'false' as claim
      let group, groupLength;
      group = list[list.length-1];
      groupLength = list[list.length-1].length;
      // but, it may happened the unit in list was not ready in local state
      // like the unitCurrentResponds.list was fetched by 'previous' comp
      if (group[groupLength - 1] in this.state.unitsBasic){
        listUnitBase = this.state.unitsBasic[group[groupLength-1]].createdAt;
      }
    };
    const self = this;
    this.setState({axios: true});

    _axios_get_responds(this.axiosSource.token, {
      exposedId: this.unitId,
      listUnitBase: listUnitBase
    })
    .then((resObj)=>{
      // list was saved in redux state
      self.props._submit_list_UnitResponds({
        list: resObj.main.unitsList,
        scrolled: resObj.main.scrolled
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
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
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

  _handleClick_hrefNail(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    //and Notice! history should be pushed after the replaceState has been done
    let urlParams = new URLSearchParams(this.props.location.search);
    urlParams.set('unitId', event.currentTarget.getAttribute('unitid'));
    urlParams.set('unitView', "theater");
    this.props.history.push({
      pathname: this.props.match.path, //should always be ".../unit" because primer only used in a Unit
      search: urlParams.toString(),
      state: {from: this.props.location}
    });
  }

  _handleClick_UnitSwitch(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props._set_state_UnitView("respond");
    // now the unitView was switch by the param in URL
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    let nextSearch = this.props.location.search.replace("unitView=related","unitView=respond");
    this.props.history.push({
      pathname: this.props.match.path,
      search: nextSearch,
      state: {from: this.props.location}
    });
  }

  _handleEnter_Submit(e){
    this.setState({
      onEnterSubmit: true
    })
  }

  _handleLeave_Submit(e){
    this.setState({
      onEnterSubmit: false
    })
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    unitCurrentResponds: state.unitCurrentResponds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_UnitResponds: (obj, reset) => { dispatch(submitUnitRespondsList(obj, reset)); },
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Related));
