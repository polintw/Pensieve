import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import stylesFont from '../../stylesFont.module.css';
import NailFeed from '../../../../Components/Nails/NailFeed/NailFeed.jsx';
import NailFeedWide from '../../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
  handlePathProjectsList
} from "../../../../redux/actions/general.js";
import {
  submitFeedAssigned
} from "../../../../redux/actions/within.js";
import {
  initAround
} from "../../../../redux/states/statesWithin.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class FeedAssigned extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._filter_repeatedChin = this._filter_repeatedChin.bind(this);
    this._axios_get_assignedList = this._axios_get_assignedList.bind(this);
  }

  _filter_repeatedChin(unitslist){
    unitslist = unitslist.filter((unitId, index)=>{
      return this.props.chainList.listOrderedChain.indexOf(unitId) < 0
    })
    return unitslist;
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
      this.props.indexLists.scrolled // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_feedUnits();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    /*
    2 situations we have to fetch list again
    */
    //1st one, props.lastVisit updated
    //it's very slow to compare 2 obj directly, so just compare by key pair we already set up
    let lastvisitchangeify = (this.props.lastVisit != prevProps.lastVisit) ? true : false;
    if(this.recKeys.length > 0 && lastvisitchangeify){ // usually at the landing render cycle, not yet fetched and finally got the lastVisit data
      this._set_feedUnits(this.props.lastVisit);
    };
    //2nd, the belongsByType had been changed
    let residenceify = (this.props.belongsByType['residence'] == prevProps.belongsByType['residence']) ? true:false;
    let homelandify = (this.props.belongsByType['homeland'] == prevProps.belongsByType['homeland']) ? true:false;
    if(this.recKeys.length > 0 && this.props.lastVisit&& (!residenceify || !homelandify)){ //this one is for situation setting new belong
      this.props._submit_list_FeedAssigned(initAround.indexLists, true); //reset to initial state before fetch
      let nowDate = new Date();
      this._set_feedUnits(this.props.lastVisit, nowDate);
    };
  }

  componentDidMount(){
    if(this.props.lastVisit) this._set_feedUnits(this.props.lastVisit);
    window.addEventListener("scroll", this._check_Position);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    this.props._submit_list_FeedAssigned(initAround.indexLists, true); //reset to initial state before fetch
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_FeedNails(listChoice){
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
              className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
              <NailFeedMobile
                {...this.props}
                leftimg={false}
                unitId={unitId}
                linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic} />
            </div>
          );
          return;
        };
        // for laptop / desktop, change nail by cycles
        let remainder3 = index % 3,
        remainder2 = index % 2; // cycle, but every 3 units has a wide, left, right in turn.

        nailsDOM.push (remainder3 ? ( // 0 would be false, which means index % 3 =0
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(stylesNail.boxNail)}>
            <NailFeed
              {...this.props}
              unitId={unitId}
              linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        ): (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
            <NailFeedWide
              {...this.props}
              leftimg={ remainder2 ? true : false}
              unitId={unitId}
              linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        ));
      });
      if(listChoice=="unread" && (groupIndex+1)==this.props.indexLists.listUnread.length){ //sepcial handler for last round of listUnread
        if(this.props.indexLists.listBrowsed.length ==0){ // should add hint at a special condition: no browsed item, means no followed units after the last round
          nailsDOM.push(
            <div
              className={classnames(styles.boxDescript, stylesFont.fontTitleSmall, stylesFont.colorLightGrey)}>
              {this.props.i18nUIString.catalog['title_FeedAssigned_AllRead']}</div>
          );
        }
        else if( ((nailsDOM.length % 3) == 2) && this.props.indexLists.listBrowsed.length !=0){ // only happend if the last one was a 'lonely' one, not good looking
          nailsDOM.splice(-1, 1);
        };
      };
      if(listChoice=="browsed" && groupIndex==0 && nailsDOM.length > 0) nailsDOM.splice(1, 0, ( // 'You've all browsed' at the second place of listbrowsed
        <div
          className={classnames(styles.boxDescript, stylesFont.fontTitleSmall, stylesFont.colorLightGrey)}>
          {this.props.i18nUIString.catalog['title_FeedAssigned_AllRead']}</div>
      ));

      return nailsDOM;
    };
    let renderList = (listChoice=="unread") ? this.props.indexLists.listUnread : this.props.indexLists.listBrowsed;
    renderList.forEach((unitGroup, index)=>{
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

  render(){
    this.recKeys = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: []; //because there are more than one process need to use this var, but this var would change bu props., we claim it to this.
    let concatList = this.props.indexLists.listUnread.concat(this.props.indexLists.listBrowsed);

    return (
      <div>

        {
          // notice, a condition if the user didn't set any belong, not going to render at all
          ((concatList.length > 0) &&
          (this.recKeys.length != 0) ) &&
          <div>
            {this._render_FeedNails('unread')}
            {this._render_FeedNails('browsed')}
          </div>
        }
        {
          ((concatList.length == 0) &&
            !this.props.indexLists.scrolled &&
            !this.state.axios &&
            this.recKeys.length != 0
          ) &&
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
            )}>
            {
              (!!this.props.chainList.listInfo[this.props.chainList.listOrderedChain[0]] && this.props.chainList.listInfo[this.props.chainList.listOrderedChain[0]] == "latestShared") ?(
                <div
                  className={classnames(
                    styles.boxEmptyDescript,
                    "fontTitleSmall", "colorGrey")}
                    style={{marginTop: '22px'}}>
                    {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned_justSubmit'] /*which means, the user just share something*/}
                </div>
              ):(
                <div
                  className={classnames(
                    styles.boxEmptyDescript, stylesNail.boxNail, stylesNail.custNailWideEmpty,
                    "fontTitleSmall", "colorGrey")}>
                  <div
                    className={styles.boxEmptyColumn}>
                    <span className={classnames("fontSubtitle")}>
                      {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned'][0]}
                    </span>
                    <br/>
                    {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned'][1]}
                  </div>
                </div>
              )
            }
          </div>
        }
        <div ref={this.refScroll}/>
      </div>
    )
  }

  _set_feedUnits(lastVisit, lastUnitTime){
    // feeds was selected by the last unit get last round
    let listUnitBase = !!lastUnitTime? lastUnitTime: false, list = false;
    if(this.props.indexLists.listBrowsed.length > 0){
      list = this.props.indexLists.listBrowsed;
    }else if(this.props.indexLists.listUnread.length > 0){
      list = this.props.indexLists.listUnread;
    };
    if(list && !lastUnitTime){ // 'list' would be 'false' if both listBrowsed & listUnread was empty
      let group, groupLength;
      group = list[list.length-1];
      groupLength = list[list.length-1].length;
      listUnitBase = this.state.unitsBasic[group[groupLength-1]].createdAt;
    };
    const self = this;
    this.setState({axios: true});

    this._axios_get_assignedList({
      visitBase: lastVisit,
      listUnitBase: listUnitBase
    })
    .then((resObj)=>{
      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      let idlistUnread = resObj.main.listUnread.map((unitsObj, index)=>{ return unitsObj.unitId;});
      let idlistBrowsed = resObj.main.listBrowsed.map((unitsObj, index)=>{ return unitsObj.unitId;});
      //it is possible the Unread list conatin unit respond to user Shared, we have to rm them
      idlistBrowsed = this._filter_repeatedChin(idlistBrowsed);
      idlistUnread = this._filter_repeatedChin(idlistUnread);

      this.props._submit_list_FeedAssigned({
          listBrowsed: idlistBrowsed,
          listUnread: idlistUnread,
          scrolled: resObj.main.scrolled // basically would be 'true' in most of time
      });

      let unitslist = idlistUnread.concat(idlistBrowsed);
      return unitslist.length > 0 ?(
        axios_get_UnitsBasic(self.axiosSource.token, unitslist) //and use the list to get the data of eahc unit
      ): ({ main: {
        nounsListMix: [],
        usersList: [],
        pathsList: [],
        unitsBasic: {},
        marksBasic: {}
      }});
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.props._submit_PathsList_new(resObj.main.pathsList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
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

  _axios_get_assignedList(obj){
    return axios({
      method: 'get',
      url: '/router/feed/unitslist/assigned',
      params: obj,
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
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    indexLists: state.indexLists,
    sharedsList: state.sharedsList,
    chainList: state.chainList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_PathsList_new: (arr) => { dispatch(handlePathProjectsList(arr)); },
    _submit_list_FeedAssigned: (obj, reset) => { dispatch(submitFeedAssigned(obj, reset)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedAssigned));
