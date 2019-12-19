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
  axios_get_wish_list,
  axios_patch_wish_make,
  axios_delete_wish
} from '../../utilsMatchNodes.js';
import {updateNodesBasic} from '../../../../../redux/actions/general.js'
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
      wishedList: []
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

    axios_delete_wish(this.axiosSource.token, nodeId)
    .then((resObj)=>{
      //if succeed, just refresh the list
      this._fetch_WishList();
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
      this._fetch_WishList();
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

    axios_get_wish_list(this.axiosSource.token)
    .then((resObj)=>{
      this.setState({
        axios: false,
        wishedList: resObj.main.nodesList
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
    //the neighbor 'Supply' may also 'order' a new wish
    //it would set a flag 'wishListRefresh'
    if(this.props.flagWishRefresh && this.props.flagWishRefresh != prevProps.flagWishRefresh){
      this._fetch_WishList();
      this.props._submit_FlagSwitch('flagWishRefresh');
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
      itemsDOM.push(
        <NodeWished
          listIndex={i}
          wishedNode={this.state.wishedList[i]}
          _set_choiceFromSearch={this._set_choiceFromSearch}
          _submit_wish_remove={this._submit_wish_remove}/>
      )
    }
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
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wish));
