import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css"; //Notice, we use shared css file here for easier control
import stylesMain from "../styles.module.css"; //Notice, we use shared css file here for easier control
import {
  nailChart,
} from '../utils.js';
import {
  setIndexLists
} from '../../../../redux/actions/cosmic.js';
import {
  handleNounsList,
  handleUsersList,
  updateNodesBasic
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class SelfShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_nails = this._render_nails.bind(this);
    this.style={

    }
  }

  /*
  This is a new comp. est. during the test stage.
  It actually need a data fetch, fetching the latest Shared/new feedback of/to the user.
  */

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_nails(){
    //our list was saved to reducer after fetch
    let unitsList = this.state.unitsList,
        unitsDOM = [];

    if(unitsList.length > 0 ){ // check necessity first, skip if no item.
      //we render only two, but the backend may pass more than 2, so don't forget setting the limit
      for(let i =0 ; i< 1 && i< unitsList.length; i++){ //again, don't forget the length limit to prevent error cause by unwanted cycle
        let unitId = unitsList[i];
        //then important question: do we have the data of this Unit ? if not, we skip to next one
        if(unitId in this.state.unitsBasic) {
          //the nailChart was co use with other component in Main,
          let nail = nailChart(4, unitId, this);
          unitsDOM.push(nail);
        }
      }
    }

    return unitsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comSelfShared)}>
        <div
          className={classnames(styles.boxTodayNails)}>
          {this._render_nails()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_NodesBasic: (obj) => { dispatch(updateNodesBasic(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SelfShared));
