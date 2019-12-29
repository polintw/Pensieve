import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

import NodeWished from './NodeWished.jsx'
import {
  axios_get_desire_list,
  axios_get_nodesStatus,
  axios_patch_wish_make,
  axios_delete_matchSetting
} from '../../utilsMatchNodes.js';
import {
  updateNodesBasic,
  handleNounsList,
  setMessageSingleClose
} from '../../../../../redux/actions/general.js'
import {
  setFlag
} from "../../../../../redux/actions/cosmic.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../../utils/errHandlers.js';

class Wish extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      wishedList: [],
      nodesStatus: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Wished = this._render_Wished.bind(this);
    this._fetch_WishList = this._fetch_WishList.bind(this);
    this._submit_wish_remove = this._submit_wish_remove.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this.style={

    }
  }

  _submit_wish_remove(nodeId){
    //for rm, or delete, just go ahead
    const self = this;
    this.setState({axios: true});

    axios_delete_matchSetting(this.axiosSource.token, 'wish', {'wishList': [nodeId]})
    .then((resObj)=>{
      //if succeed, just refresh the list
      self._fetch_WishList();
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

  _set_choiceFromSearch(nodeBasic){
    //first, prserve the fetch data, node basic, in the redux
    //so the handler would not need to fetch node data from db again
    let insertObj = {}; //create obj to fit the format of state in redux
    insertObj[nodeBasic.id] = nodeBasic;
    this.props._submit_Nodes_insert(insertObj);
    //no need to fetch node data from db again for any condition gave the choice a non-false value
    //has already save the data of node in reducer.

    //then start sumitting the wish, and renew list after successful res
    const self = this;
    this.setState((prevState,props)=>{
      return {axios: true};
    });
    //
    axios_patch_wish_make(self.axiosSource.token, nodeBasic.id)
    .then((resObj)=>{
      //if succeed, just refresh the list
      self._fetch_WishList();
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

  _fetch_WishList(){
    const self = this;
    this.setState({axios: true});

    axios_get_desire_list(this.axiosSource.token, 'wished')
    .then((resObj)=>{
      let nodesList = resObj.main.nodesList;

      self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action
      self.setState({
        wishedList: nodesList
      })
      //we need to get the taken/finished status of each return node
      let getStatusTaken = axios_get_nodesStatus(self.axiosSource.token, nodesList,'taken').catch(function (err) {throw err;}),
          getStatusFinished = axios_get_nodesStatus(self.axiosSource.token, nodesList,'finished').catch(function (err) {throw err;});

      return Promise.all([getStatusTaken, getStatusFinished]);
    })
    .then(([resTakenStatus, resFinishedStatus])=>{
      let statusObj = {},
          nodesList = Object.keys(resTakenStatus.main.listObj); //hard to trust list in state at this moment, so just make a certain one

      nodesList.forEach((nodeId, index)=>{
        statusObj[nodeId] = {taken: resTakenStatus.main.listObj[nodeId], finished: resFinishedStatus.main.listObj[nodeId]};
      })
      self.setState({
        axios: false,
        nodesStatus: statusObj
      })
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message== "message_Main_forbbidenWish" )
          self.props._set_MessageSinClose(self.props.i18nUIString.catalog["message_Main_forbbidenWish"])
        else if(message.length > 0) alert(message); //end of 'if'
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //the neighbor 'Supply' may also 'order' a new wish
    //it would set a flag 'wishListRefresh'
    if(this.props.flagWishRefresh && this.props.flagWishRefresh != prevProps.flagWishRefresh){
      this._fetch_WishList();
      this.props._submit_FlagSwitch(['flagWishRefresh']);
      //the fetchFlags could become empty(length=0) after the rm.
    }
  }

  componentDidMount() {
    this._fetch_WishList();
  }

  componentWillUnmount() {

  }

  _render_Wished(){
    let itemsDOM = [];

    for(let i= 0; i< 3; i++){
      let currentNode = this.state.wishedList[i];
      //deal with status separately because it is depend on different api and set into state not at the same time as the list
      let nodeStatus = !this.state.nodesStatus[currentNode] ? {}:this.state.nodesStatus[currentNode];
      itemsDOM.push(
        <NodeWished
          key={"key_Wished_"+i}
          listIndex={i}
          wishedNode={currentNode}
          nodeStatus={nodeStatus}
          _set_choiceFromSearch={this._set_choiceFromSearch}
          _submit_wish_remove={this._submit_wish_remove}/>
      )
    }
    return itemsDOM;
  }

  render(){
    return(
      <div
        className={classnames()}>
        {this._render_Wished()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    flagWishRefresh: state.flagWishRefresh
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
    _set_MessageSinClose: (obj) => { dispatch(setMessageSingleClose(str));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wish));
