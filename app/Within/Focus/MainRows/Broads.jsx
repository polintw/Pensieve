import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "../MainBanner/styles.module.css"; //Notice, we use shared css file here for easier control
import {
  nailChart,
} from '../Main/utils.js';
import {
  setIndexLists
} from '../../../redux/actions/cosmic.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Broads extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_nails = this._render_nails.bind(this);
    this._set_BroadsUnits = this._set_BroadsUnits.bind(this);
    this._axios_GET_broadsList = this._axios_GET_broadsList.bind(this);
    this.style={

    }
  }

  _axios_GET_broadsList(){
    let url = '/router/feed/broad';

    return axios.get(url, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: cancelToken
    }).then(function (res) {
      let resObj = JSON.parse(res.data);

      return resObj;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

  _set_BroadsUnits(){

    //get list by lastvisit: new or rand
    this._axios_GET_broadsList()

    .then({

      //res: update to indexLists, call axios_Units of /MainBanner/utils, call _set_mountToDo from props

      self.props._submit_IndexLists({broads: resObj.main.unitsList}); //submit the list to the props.indexLists.

      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);

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
    this._set_BroadsUnits()
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_nails(){
    //our list was saved to reducer after fetch
    let unitsList = this.props.indexLists['broads'],
        unitsDOM = [];

    if(unitsList.length > 0 ){ // check necessity first, skip if no item.
      //we render only two, but the backend may pass more than 2, so don't forget setting the limit
      for(let i =0 ; i< 3 && i< unitsList.length; i++){ //again, don't forget the length limit to prevent error cause by unwanted cycle
        let unitId = unitsList[i];
        //then important question: do we have the data of this Unit ? if not, we skip to next one
        if(unitId in this.state.unitsBasic) {
          //the nailChart was co use with other component in Main,

          // should has a special type for broads --- to display broaded users
          let nail = nailChart(2, unitId, this);
          unitsDOM.push(nail);
        }
      }
    }

    return unitsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.rowBroads)}>
        <div
          className={classnames(styles.boxRowTitle)}>
          <span
            className={classnames(styles.spanTitle, styles.fontTitle)}>
            {this.props.i18nUIString.catalog["title_Main_Broads"]}</span>
        </div>
        <div
          className={classnames(styles.boxUnits)}>
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
)(Broads));
