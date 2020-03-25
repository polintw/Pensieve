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
import stylesFont from '../../stylesFont.module.css';
import stylesNail from "../../../stylesNail.module.css";

import NailBasic from '../../../../Components/Nails/NailBasic/NailBasic.jsx';
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
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._axios_get_assignedList = this._axios_get_assignedList.bind(this);
  }

  _set_feedUnits(lastVisit){
    const self = this;
    this.setState({axios: true});

    this._axios_get_assignedList({
      onlyNew: false,
      residLimit: null,
      timeBase: lastVisit
    })
    .then((resObj)=>{
      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      let idlistUnreadNew = resObj.main.listUnreadNew.map((unitsObj, index)=>{ return unitsObj.unitId;});
      let idlistUnread = resObj.main.listUnread.map((unitsObj, index)=>{ return unitsObj.unitId;});
      this.props._submit_list_FeedAssigned({
          listUnreadNew: idlistUnreadNew,
          listUnread: idlistUnread
      })
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

      nailsDOM.push(
        <div
          key={"key_FeedAssigned_new_"+index}
          className={classnames(stylesNail.boxNail, stylesNail.heightBasic, stylesNail.wideBasic)}>
          <NailBasic
            {...this.props}
            unitId={unitId}
            linkPath={'/unit'}
            unitBasic={this.state.unitsBasic[unitId]}
            marksBasic={this.state.marksBasic}/>
        </div>
      )

    });

    return nailsDOM;
  }

  render(){
    this.recKeys = Object.keys(this.props.belongsByType); //because there are more than one process need to use this var, but this var would change bu props., we claim it to this.
    let concatList = this.props.indexLists.listUnreadNew.concat(this.props.indexLists.listUnread); //just for checking if there are any units are going to render
    return (
      <div
        className={classnames(styles.comFeedAssigned)}>
        {
          (concatList.length > 0) &&
          <div>
            <div
              className={classnames(styles.boxModule)}>
              {this._render_FeedNails('unreadNew')}
            </div>
            <div>{this.props.i18nUIString.catalog['title_FeedAssigned_AllRead']}</div>
            <div
              className={classnames(styles.boxModule)}>
              {this._render_FeedNails('unread')}
            </div>
          </div>
        }
        {
          (concatList.length< 1)  &&
          ( !(this.recKeys.length > 0) ? (
            <div>
              {this.props.i18nUIString.catalog['guiding_FeedAssigned_noBelongHint']}
            </div>
          ):(
            <div>
              {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned']}
            </div>
          ))
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
    indexLists: state.indexLists
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
