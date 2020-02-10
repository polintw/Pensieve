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
  axios_Units,
  nailChart,
} from '../utils.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

/*
static data deisgned for prototype
*/
const temp_unitList = ["38"]

class SelfShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
//      unitsList: [],
      unitsList: temp_unitList, //during the prototype period
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_Units = this._fetch_Units.bind(this);
    this._render_nails = this._render_nails.bind(this);
    this.style={

    }
  }

  /*
  This is a new comp. est. during the test stage.
  It actually need a data fetch, fetching the latest Shared/new feedback of/to the user.
  */
  _fetch_Units(unitsList){
    const self = this;
    this.setState({axios: true});

    axios_Units(this.axiosSource.token, unitsList)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and update the data of units to state
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

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
/*
should has it's own api to get the customized Shared list for Index first,
fetch units directly only during the test period
*/
    this._fetch_Units(temp_unitList);
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
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SelfShared));
