import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../stylesNail.module.css";
import stylesFont from '../../stylesFont.module.css';
import NailFeed from '../../../../Components/Nails/NailFeed/NailFeed.jsx';
import NailFeedWide from '../../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  submitFeedAssigned
} from "../../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class FeedAssigned extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      statusAllread: false,
      statusNoneAssigned: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
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

  _set_feedUnits(lastVisit){
    const self = this;
    this.setState({axios: true});

    this._axios_get_assignedList({
      visitBase: lastVisit,
      listUnitBase:　

    })
    .then((resObj)=>{
      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      let idlistUnreadNew = resObj.main.listUnreadNew.map((unitsObj, index)=>{ return unitsObj.unitId;});
      let idlistUnread = resObj.main.listUnread.map((unitsObj, index)=>{ return unitsObj.unitId;});
      //it is possible the Unread list conatin unit respond to user Shared, we have to rm them
      idlistUnreadNew = this._filter_repeatedChin(idlistUnreadNew);
      idlistUnread = this._filter_repeatedChin(idlistUnread);

      this.props._submit_list_FeedAssigned({
          listUnreadNew: idlistUnreadNew,
          listUnread: idlistUnread,
      });
      this.setState({
        statusAllread: resObj.main.allread,
        statusNoneAssigned: resObj.main.noneassigned
      });

      let unitslist = idlistUnread.concat(idlistUnreadNew);
      return unitslist.length > 0 ?(
        axios_get_UnitsBasic(self.axiosSource.token, unitslist) //and use the list to get the data of eahc unit
      ): ({ main: {
        nounsListMix: [],
        usersList: [],
        unitsBasic: {},
        marksBasic: {}
      }});
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

  componentDidUpdate(prevProps, prevState, snapshot){
    /*
    GET list if! the belongsByType has changed
    */
    //it's very slow to compare 2 obj directly, so just compare by key pair we already set up
    let lastvisitchangeify = (this.props.lastVisit != prevProps.lastVisit) ? true : false;
    if(this.recKeys.length > 0 && lastvisitchangeify){ // usually at the landing render cycle, not yet fetched and finally got the lastVisit data
      this._set_feedUnits(this.props.lastVisit);
    };

    let residenceify = (this.props.belongsByType['residence'] == prevProps.belongsByType['residence']) ? true:false;
    let homelandify = (this.props.belongsByType['homeland'] == prevProps.belongsByType['homeland']) ? true:false;
    if(this.recKeys.length > 0 && this.props.lastVisit&& (!residenceify || !homelandify)){ //this one is for situation setting new belong
      this._set_feedUnits(this.props.lastVisit);
    };
    //another situation need to update was, when the Chain was updated, we have to rm repeated if there was any
    if( //it's 'array' we have to compare to, but actually, we only care the very beginning, the 'first fetch' after mount
      prevProps.chainList.listOrderedChain.length != this.props.chainList.listOrderedChain.length ){
        let checkedUnreadNew = this._filter_repeatedChin(this.props.indexLists.listUnreadNew);
        let checkedUnread = this._filter_repeatedChin(this.props.indexLists.listUnread);
        this.props._submit_list_FeedAssigned({
            listUnreadNew: checkedUnreadNew,
            listUnread: checkedUnread,
        });
    };
  }

  componentDidMount(){
    if(this.props.lastVisit) this._set_feedUnits(this.props.lastVisit);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_FeedNails(listChoice){
    let nailsDOM = [];

    let renderList = (listChoice=="unreadNew") ? this.props.indexLists.listUnreadNew : this.props.indexLists.listUnread;
    renderList.forEach((unitId, index) => {
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
              linkPath={'/unit'}
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
            linkPath={'/unit'}
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
            linkPath={'/unit'}
            unitBasic={this.state.unitsBasic[unitId]}
            marksBasic={this.state.marksBasic}/>
        </div>
      ));

    });

    if(listChoice=="unread" && nailsDOM.length > 0) nailsDOM.splice(1, 0, (
      this.state.statusNoneAssigned ?(
        <div
          className={classnames(styles.boxTitle, styles.boxDescript, stylesFont.fontTitleSmall, stylesFont.colorLightGrey)}>
          {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned']}</div>
      ):(
        <div
          className={classnames(styles.boxTitle, styles.boxDescript, stylesFont.fontTitleSmall, stylesFont.colorLightGrey)}>
          {this.props.i18nUIString.catalog['title_FeedAssigned_AllRead']}</div>
      )
    ));

    return nailsDOM;
  }

  render(){
    this.recKeys = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: []; //because there are more than one process need to use this var, but this var would change bu props., we claim it to this.
    let concatList = this.props.indexLists.listUnreadNew.concat(this.props.indexLists.listUnread); //just for checking if there are any units are going to render

    return (
      <div>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
            {this.props.i18nUIString.catalog["title_FeedAssigned_"]}</span>
        </div>

        {
          (concatList.length > 0) &&
          <div>
            <div
              className={classnames(
                styles.boxModule,
                styles.boxModuleSmall,
              )}>
              {this._render_FeedNails('unreadNew')}
            </div>
            <div
              className={classnames(
                styles.boxModule,
                styles.boxModuleSmall,
              )}>
              {this._render_FeedNails('unread')}
            </div>
          </div>
        }

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    indexLists: state.indexLists,
    chainList: state.chainList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_FeedAssigned: (obj) => { dispatch(submitFeedAssigned(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedAssigned));
