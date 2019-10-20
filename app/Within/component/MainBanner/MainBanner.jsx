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
  axios_feedList_customSelected
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
} from '../../../redux/constants/states.js';
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
    this._set_SelectedList = this._set_SelectedList.bind(this);
    this._render_nailsByType = this._render_nailsByType.bind(this);
    this._render_titleGreet = this._render_titleGreet.bind(this);
    this._render_titleBelong = this._render_titleBelong.bind(this);
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

  _set_SelectedList(vacancy){
    const self = this;
    this.setState({axios: true});

    axios_feedList_customSelected(this.axiosSource.token, vacancy)
      .then((parsedObj)=>{
        self.setState({
          axios: false
        });
        const selectedList = parsedObj.main.unitsList;
        let varietyList = [];
        // _set_UnitsData()
        // self.props._submit_IndexLists()
        if(selectedList.length > 0) self._set_UnitsData(selectedList); //req only if the list has something
        //update the list to Redux reducer,
        //but for now, we check the amount of list here, and decide how many need to be passed randomly
        //to increase variety.
        varietyList = selectedList;
        if(selectedList.length == 2 && self.props.indexLists.customNew.length == 1){
          let remainder = Math.floor(Math.random()*10) % 3; // index 0, 1, or 2 for both
          //now, 2 means keep as selectedList
          //0 or 1 means we pick only one from the selectedList, regard the index
          if(!remainder==2) varietyList = [selectedList[remainder]];
        }

        self.props._submit_IndexLists({
          customSelected: (selectedList.length> 0) ? varietyList : [] //final check because we have to make sure the customSelected is not 'false' after this step
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
         //cauculate current shortage
         //then, from the client, we req for selected only when there is only '1' new Unit in commonList
         //but the res could has 1 or 2 selected Unit/Units.
        if((3- parsedObj.main.commonList.length) == 2) {
          let vacancy= (3- parsedObj.main.commonList.length); //actually it would only be '2' now
          self._set_SelectedList(vacancy);
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
    this.props._submit_IndexLists(initCosmicGeneral.indexLists);
  }

  _render_nailsByType(list, choice, limit){
    let unitsList = this.props.indexLists[list],
        unitsDOM = [];

    //only rendering after the list & the units data ready
    //there is a working method dealing the structure diff between list
    let listType =  (typeof(unitsList[0])== "object")? true : false; //true for [{star,unitId}], false for []

    if(unitsList.length > 0 && (listType ? unitsList[0].unitId : unitsList[0]) in this.state.unitsBasic){
      //we render only two, but the backend may pass more than 2, so don't forget setting the limit
      for(let i =0 ; i< (Boolean(limit)? limit : 2) && i< unitsList.length; i++){ //and don't forget the length limit to prevent error cause by unwanted cycle
        //the nailChart was co use with other component in MainIndex,
        let unitId = listType ? unitsList[i].unitId : unitsList[i];
        let nail = nailChart(choice, unitId, this);

        unitsDOM.push(nail);
      }
    }

    return unitsDOM;
  }

  _render_titleGreet(){
    let indexLists = this.props.indexLists,
        titleText = "";

    // greet title: first but no belong > lack all, title for remind & status of node > statics ? plain greet?

    return (
      <span
        className={classnames(styles.spanTitle, styles.fontTitle)}>
        {titleText}</span>
    )
  }

  _render_titleBelong(){
    let indexLists = this.props.indexLists,
        listNodes = [];

    if(indexLists.customNewBelong[0].star in this.props.nounsBasic){
      //here, although the Unit each item in customNewBelong represent did not repeat, but the node 'could' repeat!
      //so for the title, we need to process a list contain nodes not repeat
      let idList = [];
      indexLists.customNewBelong.forEach((obj, index)=>{
        if(idList.indexOf(obj.star)< 0) idList.push(obj.star);
      })
      idList.forEach((nodeId, index)=>{
        let nodeName = this.props.nounsBasic[nodeId].name ;
        //append the name behind the present text.
        let deco = ()=>{
          if((idList.length-1) == index) return ("") //without next one
          else { return (index==(idList.length-2))? (", and") : (",");}; //find the last interval
        };
        listNodes.push(
          <span
            key={"key_belongTitle_"+index}
            className={classnames(styles.spanTitle, styles.fontTitle)}
            style={{paddingLeft: '1rem'}}>
            {nodeName + deco()}</span>
        );
      })
    };

    return (
      <div>
        <span
          className={classnames(styles.spanTitle, styles.fontTitle)}>
          {this.props.i18nUIString.catalog["titleBannerBelong"]}</span>
        {listNodes}
      </div>
    )
  }

  _render_subtitleFirst(){
    let starArr = [],
        indexLists = this.props.indexLists;

    if(indexLists.customNewFirst[0].star in this.props.nounsBasic) //make sure the nounsBasic has data
      indexLists.customNewFirst.map((obj, index)=>{
        let nodeName = this.props.nounsBasic[obj.star].name ;
        starArr.push(
          <Link
            key={"key_Subtitle_firstNode_"+index}
            to={"/cosmic/nodes/"+obj.star}
            className={'plainLinkButton'}>
            <span
              className={classnames(styles.spanSubtitleFirst)}>
              {nodeName}</span>
          </Link>
        );
      }); //end of 'if'

    if(starArr.length > 2) starArr.splice(2); //limit the amount to 2

    return (
      <div
        className={classnames(styles.boxSubtitleFirst)}>
        <div>
          <span
            style={{display: 'block',fontSize: '1.4rem',fontWeight:'500'}}>{"First to"}</span>
          {starArr}
        </div>
      </div>
    );
  }

  render(){
    //the units list would update seperately from unitsBasic
    //so check state in render, block rendering if unitsBasic not ready
    return(
      <div
        className={classnames(styles.comMainBanner)}>

        <div
          className={classnames(styles.boxTitle)}
          style={{display: 'none'}}>
          {this._render_titleGreet()}</div>

        {
          (this.props.indexLists.customNewBelong.length> 0) &&
          <div>
            <div
              className={classnames(styles.boxTitle)}>
              {this._render_titleBelong()}</div>
            <div
              className={classnames(
                styles.boxUnitsBelong,
                {[styles.boxUnitsBelongSingle]: (this.props.indexLists.customNewBelong.length==1)}
              )}>
              {this._render_nailsByType("customNewBelong", 3)}</div>
          </div>
        }
        {
          (this.props.indexLists.customNewFirst.length >0) &&
          <div
            className={classnames(styles.boxRowFirst)}>
            {this._render_subtitleFirst()}
            {this._render_nailsByType(
              "customNewFirst",
              (this.props.indexLists.customNewFirst.length==1 ) ? 0 : 2
            )}
          </div>
        }
        {
          (this.props.indexLists.customNew.length>0) && this.props.indexLists.customSelected &&
          <div
            className={classnames(styles.boxTitle)}>
            <span
              className={classnames(styles.spanTitle, styles.fontTitle)}>
              this.props.i18nUIString.catalog['titleBannerRest']
            </span>
          </div>
        }
        {
          //customSelected either be 'false' or '[...]'
          //both type of nails have to be render 'after' we could check if there would be selected or not
          this.props.indexLists.customSelected &&
          <div
            className={classnames(styles.boxUnitsSuggest)}>
            {
              this._render_nailsByType("customNew", 2, 3) &&
              this._render_nailsByType("customSelected", 2, 3)
            }
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
