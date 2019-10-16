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
    this._render_unitsBelong = this._render_unitsBelong.bind(this);
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
        self.setState({
          axios: false,
          unitsBasic: parsedObj.main.unitsBasic,
          marksBasic: parsedObj.main.marksBasic
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
          concatList.concat(listBelongId);
          submitObj['customNewBelong'] = parsedObj.main.listBelong;
        }else ;//if no item in: belong, GET people in belong or remind, or suggest belong input, or just silence
        if(parsedObj.main.listFirst.length>0) {
          //each item in listfirst is a obj
          //we need to create another list represent the ids it had
          let listFirstId = parsedObj.main.listFirst.map((item, index)=>{
            return item.unitId;
          });
          concatList.concat(listFirstId);
          submitObj['customNewFirst'] = parsedObj.main.listFirst;
        }; //no else condition for listFirst
        //notice, the list 'selected' should keep in 'false' before any return, as a 'red light' to rendering focus list
        //so update it to [] if item in other new, or just wait for update by selected
        if(parsedObj.main.commonList.length>0) {
          submitObj['customNew'] = parsedObj.main.commonList;
          concatList.concat(parsedObj.main.commonList);
          submitObj['customSelected'] = [];
        }else ; //if no item in: other new, GET selected by preference(allow empty selected by this api)(remember update into [] even with empty return)

        //then before req Unit data to server, remove duplicate in concatList(commonList may have same item as listFirst)
        concatList = concatList.filter((item,index)=>{return concatList.indexOf(item) == index}); //because indexOf() only return the first one
        self._set_UnitsData(concatList);
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

  _render_unitsBelong(){
    let unitsList = this.props.indexLists.customNewBelong,
        unitsDOM = [];

    //only rendering after the list & the units data ready
    if(unitsList.length > 0 && unitsList[0] in this.state.unitsBasic){
      //we render only two, but the backend may pass more than 2, so don't forget setting the limit
      for(let i =0 ; i< 2 ; i++){
        //the nailChart was co use with other component in MainIndex,
        let nail = nailChart(3, unitsList[i], this);

        unitsDOM.push(nail);
      }
    }

  }

  render(){
    //the units list would update seperately from unitsBasic
    //so check state in render, block rendering if unitsBasic not ready
    return(
      <div
        className={classnames(styles.comMainBanner)}>
        <div>{"一排字: new belong宣告 > silence for no belong but first > niether belong nor first, remind & info of belong > "}</div>
        <div
          className={classnames(styles.boxUnitsBelong)}>
          {this._render_unitsBelong()}</div>
        <div>{'first, include title > or none'}</div>
        <div>{'common new > selection . combined by "other new or selected"'}</div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
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
