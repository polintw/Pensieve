import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  axios_Units,
  axios_feedList_customNew,
} from './utils.js';
import {
  nailChart,
} from '../MainIndex/utils.js';
import {
  setIndexLists
} from '../../../redux/actions/cosmic.js';
import {
  handleNounsList,
  handleUsersList
} from "../../../redux/actions/general.js";
import {
  initCosmicGeneral
} from '../../../redux/constants/typesCosmic.js';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class MainBanner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_UnitsData = this._set_UnitsData.bind(this);
    this._render_nailsByType = this._render_nailsByType.bind(this);
    this._render_titleGreet = this._render_titleGreet.bind(this);
    this._render_subtitleFirst = this._render_subtitleFirst.bind(this)
    this.style={

    }
  }

  _set_UnitsData(submitList){
    const self = this;
    this.setState({axios: true});

    axios_Units(this.axiosSource.token, submitList)
      .then((parsedObj)=>{

        self.props._submit_NounsList_new(parsedObj.main.nounsListMix);
        self.props._submit_UsersList_new(parsedObj.main.usersList);
        self.setState((prevState, props)=>{
          return ({
            axios: false,
            unitsBasic: {...prevState.unitsBasic, ...parsedObj.main.unitsBasic},
            marksBasic: {...prevState.marksBasic, ...parsedObj.main.marksBasic}
          });

        });
      }).catch(function (thrown) {
        self.setState({axios: false});
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if(message) alert(message);
        }
      });

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    const self = this;
    this.setState({axios: true});

    axios_feedList_customNew(this.axiosSource.token)
      .then((parsedObj)=>{
        self.setState({
          axios: false
        });
        let submitObj = {},
            concatList= [];
        if(parsedObj.main.listBelong.length>0) {
          //each item in listBelong is a obj
          //we need to create another list represent the ids it had
          let listBelongId = parsedObj.main.listBelong.map((item, index)=>{
            return item.unitId;
          });
          concatList = concatList.concat(listBelongId);
          submitObj['customNewBelong'] = parsedObj.main.listBelong;
        }else ;//if no item in: belong, GET people in belong or remind, or suggest belong input, or just silence
        if(parsedObj.main.listFirst.length>0) {
          //each item in listfirst is a obj
          //we need to create another list represent the ids it had
          let listFirstId = parsedObj.main.listFirst.map((item, index)=>{
            return item.unitId;
          });
          concatList = concatList.concat(listFirstId);
          submitObj['customNewFirst'] = parsedObj.main.listFirst;
        }; //no else condition for listFirst
        //notice, the list 'selected' should keep in 'false' before any return, as a 'red light' to rendering focus list
        //so update it to [] if item in other new, or just wait for update by selected
        submitObj['customNew'] = parsedObj.main.commonList;
        concatList = concatList.concat(parsedObj.main.commonList);
         //if item in: new less than 3, GET selected by preference
        if(parsedObj.main.commonList.length< 3) {
          let vacancy= (4- parsedObj.main.commonList.length);

        }else submitObj['customSelected'] = [];

        //then before req Unit data to server, remove duplicate in concatList(commonList may have same item as listFirst)
        concatList = concatList.filter((item,index)=>{return concatList.indexOf(item) == index}); //because indexOf() only return the first one
        if(concatList.length > 0) self._set_UnitsData(concatList); //req only if the list has something
        //update the list to Redux reducer,
        self.props._submit_IndexLists(submitObj);

      }).catch(function (thrown) {
        self.setState({axios: false});
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if(message) alert(message);
        }
      });
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //clear & reset to init when Unmount, make sure the list would not render anything when retrun to index
    self.props._submit_IndexLists(initCosmicGeneral.indexLists);
  }

  _render_nailsByType(list, choice, limit){
    let unitsList = this.props.indexLists[list],
        unitsDOM = [];

    //only rendering after the list & the units data ready
    if(unitsList.length > 0 && unitsList[0].unitId in this.state.unitsBasic){
      //we render only two, but the backend may pass more than 2, so don't forget setting the limit
      for(let i =0 ; i< (Boolean(limit)? limit : 2) && i< unitsList.length; i++){ //and don't forget the length limit to prevent error cause by unwanted cycle
        //the nailChart was co use with other component in MainIndex,
        let unitId = unitsList[i].unitId;
        let nail = nailChart(choice, unitId, this);

        unitsDOM.push(nail);
      }
    }

    return unitsDOM;
  }

  _render_titleGreet(){
    let indexLists = this.props.indexLists,
        titleText = "";
    // title for new belong > silence if no belong but first > niether belong nor first, then title for remind & status of belong node > statics ? plain greet?
    if(indexLists.customNewBelong.length> 0){
      if(indexLists.customNewBelong[0].star in this.props.nounsBasic){
        indexLists.customNewBelong.map((obj, index)=>{
          let nodeName = this.props.nounsBasic[obj.star] ;

          return (index==indexLists.customNewBelong.length)? ("and "+nodeName): (nodeName+ ", ");
        })
      }
      titleText = this.props.i18nUIString["titleBannerBelong"] + indexLists.customNewBelong
    }
    else ;// becuase remind is stil under constructing, we do nothing else

    return (
      <span
        className={classnames(styles.spanTitle, styles.fontTitle)}>
        {titleText}</span>
    )
  }

  _render_subtitleFirst(){
    let starArr = [],
        indexLists = this.props.indexLists;

    if(indexLists.customNewFirst.length >0){
      if(indexLists.customNewFirst[0].star in this.props.nounsBasic) //make sure the nounsBasic has data
        indexLists.customNewFirst.map((obj, index)=>{
          let nodeName = this.props.nounsBasic[obj.star] ;
          starArr.push(
            <span
              key={"key_Subtitle_firstNode_"+index}
              className={classnames(styles.spanSubtitleFirst)}>
              {nodeName}</span>
          );
        }); //end of 'if'
    };

    return (indexLists.customNewFirst.length> 0 ) ? (
      <div
        className={classnames(styles.boxSubtitleFirst)}>
        <div>
          <span>{"First to"}</span>
          {starArr}
        </div>
      </div>
    ): null;
  }

  render(){
    //the units list would update seperately from unitsBasic
    //so check state in render, block rendering if unitsBasic not ready
    return(
      <div
        className={classnames(styles.comMainBanner)}>
        <div
          className={classnames(styles.boxTitle)}>
          {this._render_titleGreet()}</div>
        <div
          className={classnames(styles.boxUnitsBelong)}>
          {this._render_nailsByType("customNewBelong", 3)}</div>
        <div
          className={classnames(styles.boxUnitsFirst)}>
          {this._render_subtitleFirst()}
          {this._render_nailsByType("customNewFirst", 2)}
        </div>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames(styles.spanTitle, styles.fontTitle)}>
            {
              (this.props.indexLists.customNew.length>0) && this.props.indexLists.customSelected &&
              this.props.i18nUIString['titleBannerRest']
            }</span>
        </div>
        <div
          className={classnames(styles.boxUnitsSuggest)}>
          {this._render_nailsByType("customNew", 2, 3)}
          {
            this.props.indexLists.customSelected &&
            this._render_nailsByType("customSelected", 2, 3)
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    mainTitle: state.mainTitle,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainBanner));
