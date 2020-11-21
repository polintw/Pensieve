import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AssignNodes from '../AssignNodes.jsx';
import AssignOptions from '../AssignOptions/AssignOptions.jsx';
import NodesSearch from '../NodesSearch/NodesSearch.jsx';

const typesState = {
  homeland: 'homeSelection',
  residence: 'residSelection',
  freeOne: 'freeSelection'
};
const checkList = ['homeSelection', 'residSelection', 'freeSelection'] // follow typesState

const stateTypes = {
  homeSelection:'homeland',
  residSelection: 'residence',
  freeSelection: 'freeOne'
};

class NodesView extends React.Component {
  constructor(props){
    super(props);
    // by props.nodesSet, est. state
    let propsState = {
      selectedList: [], // all id of selectd nodes
      homeSelection: null, //node id as selection of homeland
      residSelection: null, //node id as selection of residence
      freeSelection: null //node id as selection of free search
    };
    this.props.nodesSet.forEach((obj, index) => {
      propsState[typesState[obj['type']]] = obj.nodeId;
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
    if(this.state.selectedList.length == 0){ // condition the list was empty, render a hint
      return (
        <li className={classnames(styles.boxHintItem)}>
          <span
            className={classnames('colorGrey', 'fontContent')}>
            {this.props.i18nUIString.catalog['guidingCreateShare_NodesView_selectHint']}
          </span>
        </li>
      )
    };

    let nodesSet = this.state.selectedList.map((nodeId, index)=>{
      return {nodeId: nodeId}; // basically, AssignNodes only need the nodeId in nodesSet
    });
    return (
      <AssignNodes
        nodesSet={nodesSet}
        nodeDelete={true}
        _submit_deleteNodes={(indexInList)=>{ // _submit_deleteNodes only return the index in selectedList
          let targetNode = this.state.selectedList[indexInList], targetType = '';
          for(let i=0; i < checkList.length; i++) {
            if(this.state[checkList[i]] == targetNode){
              targetType = stateTypes[checkList[i]]; // use item( name in 'state') to type
              break;
            }
          };
          this._set_deleteNodes(targetNode, targetType);
        }}/>
    )
  }

  render(){
    return(
      <div
        className={classnames(styles.comNodesView)}>
        <div
          className={classnames(styles.boxNodesEditTitle, "fontSubtitle", "colorEditBlack")}>
          {this.props.i18nUIString.catalog["guidingCreateShare_NodesView"]}
        </div>
        <div
          className={classnames(styles.boxForm)}>
          <div className={classnames(styles.boxRow)}>
            <div className={classnames(styles.boxRowTitle)}>
              <span className={classnames('fontSubtitle_h5', 'colorEditBlack')}>
                {this.props.i18nUIString.catalog["subTitle_CreateShare_AssignTypes"][0]}
              </span>
            </div>
            <div className={classnames(styles.seperationRowVertiLine)}/>
            <div>
              <AssignOptions
                assignType={'homeland'}
                selected={this.state.homeSelection}
                allSelection={this.state.selectedList}
                _submit_new_node={this._set_newNode}
                _submit_deleteNodes={this._set_deleteNodes}/>
            </div>
          </div>
          <div className={classnames(styles.boxRow)}>
            <div className={classnames(styles.boxRowTitle)}>
              <span className={classnames('fontSubtitle_h5', 'colorEditBlack')}>
                {this.props.i18nUIString.catalog["subTitle_CreateShare_AssignTypes"][1]}
              </span>
            </div>
            <div className={classnames(styles.seperationRowVertiLine)}/>
            <div>
              <AssignOptions
                assignType={'residence'}
                selected={this.state.residSelection}
                allSelection={this.state.selectedList}
                _submit_new_node={this._set_newNode}
                _submit_deleteNodes={this._set_deleteNodes}/>
            </div>
          </div>
          <div className={classnames(styles.boxRow)}>
            <div className={classnames(styles.boxRowTitle)}>
              <span className={classnames('fontSubtitle_h5', 'colorEditBlack')}>
                {this.props.i18nUIString.catalog["subTitle_CreateShare_AssignTypes"][2]}
              </span>
            </div>
            <div className={classnames(styles.seperationRowVertiLine)}/>
            <div
              className={classnames(
                {[styles.boxNodeSearch]: !this.state.freeSelection})}>
              <NodesSearch
                currentSet={this.state.freeSelection}
                _set_nodeByNodeBasic={(nodeBasic)=>{
                  if(this.state.selectedList.indexOf(nodeBasic.id) > (-1)){return;} // block adding if used by other types
                  this._set_newNode({nodeId: nodeBasic.id, type: 'freeOne'});}}
                _reset_searchSelection={(deletedNode)=>{this._set_deleteNodes(deletedNode, 'freeOne')}}/>
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
    let nodeId = nodeObj.nodeId, assignType= nodeObj.type;
    // 'replace' in selectedList & nodesSet
    this.setState((prevState, props)=>{
      let replacedState = {};
      replacedState[typesState[assignType]] = nodeId;
      let copiedSelectedList = prevState.selectedList.slice(); // shallow copy
      // then check if this type had beed occupied
      if(!(this.state[typesState[assignType]])){ // null at this moment
        // then only push into selectedList
        copiedSelectedList.push(nodeId);
      }
      else{
        // replace the one in copied state
        let indexInSelected = prevState.selectedList.indexOf(prevState[typesState[assignType]]);
        copiedSelectedList.splice(indexInSelected, 1, nodeId);
      }
      replacedState["selectedList"] = copiedSelectedList;
      // return the final obj
      return replacedState;
    });
  }

  _set_deleteNodes(targetNode, targetType){
    let indexInSelected = this.state.selectedList.indexOf(targetNode);

    this.setState((prevState, props)=>{
      //'target' is an index mark the unwanted node
      let copiedList = prevState.selectedList.slice(); // copy to prevent modified state
      copiedList.splice(indexInSelected, 1);
      let updatedObj = {
        selectedList: copiedList,
      };
      updatedObj[typesState[targetType]] = null;

      return updatedObj;
    })
  }

  _handleClick_done(event){
    event.stopPropagation();
    event.preventDefault();
    let orderedList = this.state.selectedList.slice();
    checkList.forEach((key, index) => {
      if(this.state[key] != null){
        // to order as the user 'think', follow the order in state.selectedList
        let indexInList = this.state.selectedList.indexOf(this.state[key]);
        orderedList.splice(indexInList, 1, {type: stateTypes[key], nodeId: this.state[key]});
      };
    });

    this.props._submit_new_node(orderedList);
    this.props._set_nodesEditView('');
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

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesView));
