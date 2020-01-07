import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css"; //Notice, we use shared css file here for easier control
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

class TodayUnit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodeId: null,
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_nails = this._render_nails.bind(this);
    this._axios_GET_TodayUnits = this._axios_GET_TodayUnits.bind(this);
    this._axios_GET_todayNode = this._axios_GET_todayNode.bind(this);
    this.style={

    }
  }

  _axios_GET_TodayUnits(){
    //GET limited units list and data of this node
    const self = this;
    this.setState({axios: true});

    axios({ //use config because we want to set 'params'
      url: `/router/nouns/${this.state.nodeId}`,
      method: 'get',
      params: {limit: 3},
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);

      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.props._submit_IndexLists({todayNode: resObj.main.unitsList}); //submit the list to the props.indexLists.

      self.setState((prevState, props)=>{
        return({
          axios: false,
          unitsBasic: resObj.main.unitsBasic,
          marksBasic: resObj.main.marksBasic
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

  _axios_GET_todayNode(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/feed/custom/todayNode', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);

      self.props._submit_NodesBasic(resObj.main.nounsBasic);

      self.setState((prevState, props)=>{
        return ({
          axios: false,
          nodeId: resObj.main.nodesList[0]
        });
        //the TodayNode component would update after this step
        //then we fetch the data & info of this new node in 'componentDidUpdate'
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
    if(prevState.nodeId != this.state.nodeId && !!this.state.nodeId){ //req only if the new node came and truely a real node
      this._axios_GET_TodayUnits();
    }
  }

  componentDidMount() {
    this._axios_GET_todayNode();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_nails(){
    //our list was saved to reducer after fetch
    let unitsList = this.props.indexLists['todayNode'],
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
        className={classnames(styles.comTodayNode)}>
        <div
          className={classnames(styles.boxWikiTitle)}>
          {
            (this.state.nodeId in this.props.nounsBasic) &&
            <span
              className={classnames(styles.fontTitle)}
              style={{cursor: 'pointer'}}
              onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic(this.state.nodeId, 'noun')}}>
              {this.props.nounsBasic[this.state.nodeId].name}</span>
          }
          <span
            className={classnames(styles.spanTodayDescript, styles.fontDescript)}>
            {"Today Intro"}</span>
        </div>
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
)(TodayUnit));
