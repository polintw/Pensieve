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
  axios_feedList_customNew,
} from './utils.js';
import {
  setIndexLists
} from '../../../redux/actions/cosmic.js';
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
    this.style={

    }
  }

  _set_UnitsData(submitList){
    const self = this;
    this.setState({axios: true});

    axios_Units(this.axiosSource.token, submitList)
      .then((parsedObj)=>{
        self.setState({
          axios: false
        });
        //self.props._submit_NounsList_new(focusObj.main.nounsListMix);
        //self.props._submit_UsersList_new(focusObj.main.usersList);
        //setState

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
          submitObj['customNewBelong'] = parsedObj.main.listBelong;
          concatList.concat(parsedObj.main.listBelong);
        }else ;//if no item in: belong, GET people in belong or remind, or suggest belong input, or just silence
        if(parsedObj.main.listFirst.length>0) {
          //listFirst is different from the other two, each item is a obj
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

  render(){
    //the units list would update seperately from unitsBasic
    //so check state in render, block rendering if unitsBasic not ready
    return(
      <div
        className={classnames(styles.comMainBanner)}>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    mainTitle: state.mainTitle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainBanner));
