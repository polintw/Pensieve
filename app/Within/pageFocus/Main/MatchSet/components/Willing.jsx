import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

import NodeWilling from './NodeWilling.jsx'
import {
  axios_get_desire_list,
  axios_get_nodesStatus,
  axios_delete_matchSetting,
  axios_patch_willing,
  axios_post_taking
} from '../../utilsMatchNodes.js';
import {
  updateNodesBasic
} from '../../../../../redux/actions/general.js'
import {
  setFlag
} from "../../../../../redux/actions/cosmic.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../../utils/errHandlers.js';

class Willing extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      willingList: [],
      demandStatus: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_List = this._fetch_List.bind(this);
    this._submit_taking = this._submit_taking.bind(this);
    this._submit_remove = this._submit_remove.bind(this);
    this._render_WillingList = this._render_WillingList.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this.style={

    }
  }

  _submit_taking(nodeId){
    if(!!this.props.indexLists.demandTake[0]) return; //forbidden click if there is already a taken node
    this.setState({axios: true});
    axios_post_taking(this.axiosSource.token, {takingList: [nodeId]})
    .then((resObj)=>{
      this.setState({axios: false});
      //and refresh the Taken by flag
      this.props._submit_FlagSwitch(['flagTakingRefresh']);
    })
    //this import f() was unique, would handle the error before return to here
  }

  _submit_remove(nodeId){
    if(this.state.axios) return; //for this component, allow only one processat a period
    //for rm, or delete, just go ahead
    const self = this;
    this.setState({axios: true});

    axios_delete_matchSetting(this.axiosSource.token, 'willing', {'willingList': [nodeId]})
    .then((resObj)=>{
      //if succeed, just refresh the list
      self._fetch_List();
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
    axios_patch_willing(self.axiosSource.token, {"willingList": [nodeBasic.id]})
    .then((resObj)=>{
      //if succeed, just refresh the list
      self._fetch_List();
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

  _fetch_List(){
    const self = this;
    this.setState({axios: true});

    axios_get_desire_list(this.axiosSource.token, 'willing')
    .then((resObj)=>{
      self.setState({
        willingList: resObj.main.nodesList
      })
      //we need to get the demand status of each return node
      return axios_get_nodesStatus(self.axiosSource.token, resObj.main.nodesList,'demand');
    })
    .then((resObj)=>{
      self.setState({
        axios: false,
        demandStatus: resObj.main.listObj
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

  _render_WillingList(){
    let itemsDOM = [];

    for(let i= 0; i< 5; i++){
      itemsDOM.push(
        <NodeWilling
          listIndex={i}
          displayingNode={this.state.willingList[i]}
          demandStatus={this.state.demandStatus[this.state.willingList[i]]}
          _set_choiceFromSearch={this._set_choiceFromSearch}
          _submit_taking={this._submit_taking}
          _submit_remove={this._submit_remove}/>
      )
    }
  }

  render(){
    return(
      <div
        className={classnames()}>
        <div>
          {this.props.i18nUIString.catalog["title_Main_matchWilling"]}
        </div>
        <div>
          {this._render_WillingList()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Willing));
