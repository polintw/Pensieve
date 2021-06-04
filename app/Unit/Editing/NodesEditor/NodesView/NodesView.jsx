import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AssignNodes from '../AssignNodes.jsx';
import NodesSearch from '../NodesSearch/NodesSearch.jsx';
import {
  setMessageSingleClose
} from "../../../../redux/actions/general.js";
import {messageDialogInit} from "../../../../redux/states/constants.js";

const typesState = {
  freeOne: 'locationsList',
  deweyOne: 'topicList'
};

class NodesView extends React.Component {
  constructor(props){
    super(props);
    // by props.nodesSet, est. state
    let propsState = {
      selectedList: [], // all id of selectd nodes
      locationsList: [],
      topicList: [],
      locationSearchify: true,
      topicSearchify: true,
    };
    this.props.nodesSet.forEach((obj, index) => {
      let objType = obj['type'];
      if(!(objType in typesState)) objType = 'freeOne'; // to rm previous type 'homeland' or 'residence'
      propsState[typesState[objType]].push(obj.nodeId);
      propsState.selectedList.push(obj.nodeId);
    });

    this.state = Object.assign({}, propsState, {
      onBtnDone: false
    });
    this._set_newNode = this._set_newNode.bind(this);
    this._set_deleteNodes = this._set_deleteNodes.bind(this);
    this._handleClick_done = this._handleClick_done.bind(this);
    this._render_assignedNodes = this._render_assignedNodes.bind(this);
    this._handleEnter_spanDone = this._handleEnter_spanDone.bind(this);
    this._handleLeave_spanDone = this._handleLeave_spanDone.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
  }


  componentWillUnmount() {

  }

  _render_assignedNodes(){
    let nodesDOM = [];
    let nodesSet = this.state.selectedList.map((nodeId, index)=>{
      return {nodeId: nodeId}; // basically, AssignNodes only need the nodeId in nodesSet
    });
    nodesDOM.push(
      <AssignNodes
        key={"key_NodesView_assignedNodes_"}
        nodesSet={nodesSet}
        nodeDelete={true}
        _submit_deleteNodes={(indexInList)=>{ // _submit_deleteNodes only return the index in selectedList
          let targetNode = this.state.selectedList[indexInList];
          this._set_deleteNodes(targetNode);
        }}/>
    );
    for(let i =0; i < 3 && i < (3-nodesSet.length) ; i++){
      nodesDOM.push(
        <li
          key={"key_NodesView_assignedNodes_" + i}
          className={classnames(styles.boxHintItem)}>
        </li>
      )
    }
    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comNodesView)}>
        <div
          className={classnames(styles.boxSearch)}>
          <div
            className={classnames(styles.boxSearchSet)}>
            <div
              className={classnames(styles.boxNodesEditTitle, "fontSubtitle", "colorEditBlack")}>
              {this.props.i18nUIString.catalog["guidingCreateShare_NodesView"][0]}
              <span
                className={classnames("weightBold")}>
                {"("}
              </span>
              <span
                className={classnames("weightBold", "colorWarnRed")}>
                {this.props.i18nUIString.catalog['message_CreateShare_NodesView_required'][0]}
              </span>
              <span
                className={classnames("weightBold")}>
                {this.props.i18nUIString.catalog['message_CreateShare_NodesView_required'][1]}
              </span>
            </div>
            <div
              className={classnames(styles.boxForm)}>
              <div className={classnames(styles.boxSearchRow)}>
                <div
                  className={classnames(
                    {[styles.boxNodeSearch]: this.state.locationSearchify})}>
                    {
                      this.state.locationSearchify ? (
                        <NodesSearch
                          category={'location_admin'}
                          _set_nodeByNodeBasic={(nodeBasic)=>{
                            if(this.state.selectedList.indexOf(nodeBasic.id) > (-1)){return;} // block adding if used by other types
                            this._set_newNode({nodeId: nodeBasic.id, list: 'locationsList'});}}
                            _reset_searchSelection={(deletedNode)=>{this._set_deleteNodes(deletedNode)}}/>
                      ): (
                        <div
                          className={classnames("fontContent", "colorGrey")}>
                          {this.props.i18nUIString.catalog["message_CreateShare_NodesView_noSearch"]}
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
          </div>
          <div
            className={classnames(styles.boxSearchSet)}>
            <div
              className={classnames(styles.boxNodesEditTitle, "fontSubtitle", "colorEditBlack")}>
              {this.props.i18nUIString.catalog["guidingCreateShare_NodesView"][1]}
            </div>
            <div
              className={classnames(styles.boxForm)}>
              <div className={classnames(styles.boxSearchRow)}>
                <div
                  className={classnames(
                    {[styles.boxNodeSearch]: this.state.topicSearchify})}>
                    {
                      this.state.topicSearchify ? (
                        <NodesSearch
                          category={'topic_dewey'}
                          _set_nodeByNodeBasic={(nodeBasic)=>{
                            if(this.state.selectedList.indexOf(nodeBasic.id) > (-1)){return;} // block adding if used by other types
                            this._set_newNode({nodeId: nodeBasic.id, list: 'topicList'});}}
                            _reset_searchSelection={(deletedNode)=>{this._set_deleteNodes(deletedNode)}}/>
                        ) : (
                          <div
                            className={classnames("fontContent", "colorGrey")}>
                            {this.props.i18nUIString.catalog["message_CreateShare_NodesView_noSearch"]}
                          </div>
                        )
                    }
                    </div>
                  </div>
                </div>
          </div>
        </div>
        <div className={classnames(styles.seperationBottom, styles.boxAssignedNodes)}>
          {this._render_assignedNodes()}
        </div>
        <div
          className={classnames(
            styles.seperationBottom, styles.boxBtnDone,
            {
              [styles.mouseonBtnDone]: this.state.onBtnDone
            }
          )}
          onClick={this._handleClick_done}
          onMouseEnter={this._handleEnter_spanDone}
          onMouseLeave={this._handleLeave_spanDone}>
          <span className={classnames(
              'fontSubtitle_h5',
              {
                ['colorStandard']: !this.state.onBtnDone,
                ['colorWhite']: this.state.onBtnDone
              }
            )}>
            {this.props.i18nUIString.catalog['btn_Done']}
          </span>
        </div>
      </div>
    )
  }

  _handleEnter_spanDone(e) {
    this.setState({
      onBtnDone: true
    })
  }

  _handleLeave_spanDone(e) {
    this.setState({
      onBtnDone: false
    })
  }

  _set_newNode(nodeObj){
    let nodeId = nodeObj.nodeId, assignList= nodeObj.list;
    if( // alidation
      this.state.selectedList.indexOf(nodeId) >= 0 || // has set, not going to add again
      this.state.selectedList.length == 3 ||
      (this.state.selectedList.length == 2 && this.state.locationsList.length == 0 && assignList != locationsList)
    ) return;

    this.setState((prevState, props)=>{
      let copiedSelectedList = prevState.selectedList.slice();
      copiedSelectedList.push(nodeId);

      let copiedTypeList = prevState[assignList].slice();
      copiedTypeList.push(nodeId);

      let updateState = Object.assign({}, prevState);
      updateState["selectedList"] = copiedSelectedList;
      updateState[assignList] = copiedTypeList;
      // and check if the search could go on
      if(updateState.selectedList.length > 1 && updateState.locationsList.length == 0){
        updateState['topicSearchify'] = false;
      }
      else if(updateState.selectedList.length == 3){
        updateState['topicSearchify'] = false;
        updateState['locationSearchify'] = false;
      };
      return updateState;
    });
  }

  _set_deleteNodes(targetNode){
    let indexInSelected = this.state.selectedList.indexOf(targetNode);

    this.setState((prevState, props)=>{
      //'target' is an index mark the unwanted node
      let copiedList = prevState.selectedList.slice(); // copy to prevent modified state
      let copiedLocationsList = prevState.locationsList.slice();
      let copiedTopicList = prevState.topicList.slice();
      copiedList.splice(indexInSelected, 1);
      if(copiedLocationsList.indexOf(targetNode) >= 0){
        let index = copiedLocationsList.indexOf(targetNode);
        copiedLocationsList.splice(index, 1);
      }
      else if(copiedTopicList.indexOf(targetNode) >= 0){
        let index = copiedTopicList.indexOf(targetNode);
        copiedTopicList.splice(index, 1);
      };
      let updatedObj = {
        selectedList: copiedList,
        locationsList: copiedLocationsList,
        topicList: copiedTopicList
      };
      return updatedObj;
    });
  }

  _handleClick_done(event){
    event.stopPropagation();
    event.preventDefault();
     // validate 'type: freeOne(location)' first
    if(this.state.selectedList.length != 0 && this.state.locationsList.length == 0){
      this.props._submit_SingleCloseDialog({
        render: true,
        message: [{text: this.props.i18nUIString.catalog['message_CreateShare_NodesView_DialogLocationAtleast'],style:{}}], //format follow Boolean, as [{text: '', style:{}}]
        handlerPositive: ()=>{this.props._submit_SingleCloseDialog(messageDialogInit.singleClose); return;}
      });
    }
    else{
      let orderedList = [];
      for(let i =0; i < 3 && i < this.state.selectedList.length ; i++){
        let nodeId = this.state.selectedList[i];
        let nodeSet = {nodeId: nodeId, type:''};
        nodeSet["type"] = this.state.locationsList.indexOf(nodeId) < 0 ? 'deweyOne' : 'freeOne'
        orderedList.push(nodeSet);
      };

      this.props._submit_new_node(orderedList);
      this.props._set_nodesEditView('');
    };
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitView: state.unitView,
    nounsBasic: state.nounsBasic,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_SingleCloseDialog: (arr)=>{dispatch(setMessageSingleClose(arr));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesView));
