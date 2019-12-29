import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import SupplyNode from './SupplyNode.jsx'
import {
  axios_get_options,
  axios_get_nodesStatus,
  axios_patch_wish_make,
  axios_patch_submitList,
  axios_delete_matchSetting
} from '../utilsMatchNodes.js';
import {
  handleNounsList,
  setMessageSingleClose
} from "../../../../redux/actions/general.js";
import {
  setFlag
} from "../../../../redux/actions/cosmic.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class Supply extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      supplyList: [],
      supplyStatus: {},
      userWaitingList: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_List = this._fetch_List.bind(this);
    this._submit_order = this._submit_order.bind(this);
    this._submit_waiting = this._submit_waiting.bind(this);
    this._submit_waiting_remove = this._submit_waiting_remove.bind(this);
    this._render_SupplyOptions = this._render_SupplyOptions.bind(this);
    this.style={

    }
  }

  _submit_waiting(nodeId){
    if(this.state.axios) return; //cease new click if there is a connection on the way
    //additional chekc if the node has already on the waiting list
    if(this.state.userWaitingList.indexOf(nodeId) > (-1)) return;
    const self = this;
    this.setState({axios: true});
    axios_patch_submitList(this.axiosSource.token, 'waiting', {'waitingList': [nodeId]})
    .then((resObj)=>{
      //no refresh needed, just put the new one into the user's list
      let nodeIndex= self.state.userWaitingList.indexOf(nodeId);
      if(nodeIndex < 0){
        this.setState((prevState, props)=>{
          prevState.userWaitingList.push(nodeId);
          return {userWaitingList: prevState.userWaitingList};
        })
      }
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

  _submit_waiting_remove(nodeId){
    //for rm, or delete, just go ahead
    if(this.state.axios) return; //cease new click if there is a connection on the way
    const self = this;
    this.setState({axios: true});

    axios_delete_matchSetting(this.axiosSource.token, 'waiting', {'waitingList': [nodeId]})
    .then((resObj)=>{
      //no refresh needed, just make sure the node was no longer on the user's list
      let nodeIndex= self.state.userWaitingList.indexOf(nodeId);
      if(nodeIndex> (-1)){
        this.setState((prevState, props)=>{
          prevState.userWaitingList.splice(nodeIndex, 1);
          return {userWaitingList: prevState.userWaitingList};
        })
      }
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

  _submit_order(nodeId){
    if(this.state.axios) return; //cease new click if there is a connection on the way

    const self = this;
    this.setState({axios: true});
    axios_patch_wish_make(self.axiosSource.token, nodeId, 'order') //use same as the Wish, except the 'order' as a params
    .then((resObj)=>{
      //if succeed, refresh the wishlist by flag
      self.props._submit_FlagSwitch(['flagWishRefresh']);
      self.setState({axios: false});
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

  _fetch_List(){
    const self = this;
    this.setState({axios: true});

    axios_get_options(this.axiosSource.token, 'supply')
    .then((resObj)=>{
      let nodesList = resObj.main.nodesList;

      self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action
      self.setState({
        supplyList: nodesList
      })
      //we need to get the supply status of each return node, and waiting list to check user's record
      let getStatusSupply = axios_get_nodesStatus(self.axiosSource.token, nodesList,'supply').catch(function (err) {throw err;}),
          getWaigingList = axios_get_desire_list(self.axiosSource.token, 'waiting').catch(function (err) {throw err;});

      return Promise.all([getStatusSupply, getWaigingList]);
    })
    .then(([resSupplyStatus, resWaitingList])=>{

      self.setState({
        axios: false,
        supplyStatus: resSupplyStatus.main.listObj,
        userWaitingList: resWaitingList.main.nodesList
      })
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
    this._fetch_List();
  }

  componentWillUnmount() {

  }

  _render_SupplyOptions(){
    //render by the list saved in local state
    let itemsDOM = this.state.supplyList.map((nodeId, index)=>{
      //2 things: if the node was taken('list me'), and if the user has already on the list of the node
      let supplyStatus = !this.state.supplyStatus[nodeId] ? {}:this.state.supplyStatus[nodeId];
      let waitingStatus = !(this.state.userWaitingList.indexOf(nodeId)< 0 ) ? true : false;
      return (
        <SupplyNode
          key={"key_SupplyList_"+index}
          displayingNode={nodeId}
          supplyStatus={supplyStatus}
          waitingStatus={waitingStatus}
          _submit_order={this._submit_order}
          _submit_waiting={this._submit_waiting}
          _submit_waiting_remove={this._submit_waiting_remove}/>
      )
    })

    return itemsDOM;
  }

  render(){
    return(
      <div
        className={classnames()}>
        <div>
          {this._render_SupplyOptions()}
        </div>
        <div>
          {
            //this sentence, considering overlap one row of the options, similar to Demand
            this.props.i18nUIString.catalog["title_Main_matchSupply"]}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
    _set_MessageSinClose: (obj) => { dispatch(setMessageSingleClose(str));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Supply));
