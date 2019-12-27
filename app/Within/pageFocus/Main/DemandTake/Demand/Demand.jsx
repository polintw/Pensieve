import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import DemandNode from './DemandNode.jsx'

import {

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

class Demand extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      demandList: [],
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_List = this._fetch_List.bind(this);
    this._submit_taking = this._submit_taking.bind(this);
    this._render_DemandOptions = this._render_DemandOptions.bind(this);
    this.style={

    }
  }

  _submit_taking(nodeId){
    if(!!this.props.indexLists.demandTake[0]){ //forbidden click if there is already a taken node
      _set_Message_SingleClose(this.props.i18nUIString.catalog["message_Main_duplicateTaking"]);return;}

    this.setState({axios: true});
    axios_post_taking(this.axiosSource.token, {takingList: [nodeId]})
    .then((resObj)=>{
      //no matter error or not, the axios_post_taking always return to here,
      //and we always need to reset the axios otherwise the action afterward would always been blocked
      this.setState({axios: false});
      //and refresh the Taken by flag, but if the res(req) was successful
      if(resObj) this.props._submit_FlagSwitch(['flagTakingRefresh']);
    })
    //this import f() was unique, would handle the error before return to here
  }


  _fetch_List(){
    const self = this;
    this.setState({axios: true});

    //consider build f() could be used by both matchNodes/demand & supply
    axios_get_options (this.axiosSource.token, '')

    .then((resObj)=>{
      self.setState({
        axios: false,
        demandList: resObj.main.nodesList
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

  _render_DemandOptions(){
    //render by the list saved in local state
    let itemsDOM = this.state.demandList.map((nodeId, index)=>{
      return (
        <DemandNode
          key={"key_DemandList_"+index}
          displayingNode={currentNode}
          _submit_taking={this._submit_taking}/>
      )
    })

    return itemsDOM;
  }

  render(){
    return(
      <div
        className={classnames()}>
        <div>
          {this._render_DemandOptions()}
        </div>
        <div>
          {
            //this sentence, considering overlap one row of the options
            this.props.i18nUIString.catalog["title_Main_matchDemand"]}
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
    _set_Message_SingleClose : (message) =>{ dispatch(setMessageSingleClose(message)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Demand));
