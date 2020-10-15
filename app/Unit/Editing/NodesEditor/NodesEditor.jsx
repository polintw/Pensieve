import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AssignNodes from './AssignNodes.jsx';
import AssignOptions from './AssignOptions/AssignOptions.jsx';
import NodesSearch from './NodesSearch/NodesSearch.jsx';

const typesState = {
  homeland: 'homeSelection',
  residence: 'residSelection',
  freeOne: 'freeSelection'
};
const stateTypes = {
  homeSelection:'homeland',
  residSelection: 'residence',
  freeSelection: 'freeOne'
};

class NodesEditor extends React.Component {
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

    this.state = propsState;
    this._set_newNode = this._set_newNode.bind(this);
    this._set_deleteNodes = this._set_deleteNodes.bind(this);
    this._render_assignedNodes = this._render_assignedNodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_assignedNodes(){
    let nodesSet = this.state.selectedList.map((nodeId, index)=>{
      return {nodeId: nodeId}; // basically, AssignNodes only need the nodeId in nodesSet
    });
    return (
      <AssignNodes
        nodesSet={nodesSet}
        _submit_deleteNodes={(indexInList)=>{ // _submit_deleteNodes only return the index in selectedList
          let targetNode = this.state.selectedList[indexInList], targetType = '';
          let checkList = ['homeSelection', 'residSelection', 'freeSelection'] // follow typesState
          for(let i=0; i < checkList.length; i++) {
            if(this.state[checkList[i]] == targetNode){
              targetType == stateTypes[checkList[i]]; // use item( name in 'state') to type
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
        className={classnames(styles.comNodesEditor)}>
        <div
          className={classnames(styles.boxNodesEditTitle, styles.seperationBottom, styles.seperationTopEdge, "fontSubtitle", "colorEditLightBlack")}>
          {this.props.i18nUIString.catalog["guidingCreateShare_NodesEditor"]}
        </div>
        <div
          className={classnames(styles.seperationBottom)}>
          <div>
            <div>
              {this.props.i18nUIString.catalog["subTitle_CreateShare_AssignTypes"][0]}
            </div>
            <div>
              <AssignOptions
                assignType={'homeland'}
                selected={this.state.homeSelection}
                allSelection={this.state.selectedList}
                _submit_new_node={this._set_newNode}/>
            </div>
          </div>
          <div>
            <div>
              {this.props.i18nUIString.catalog["subTitle_CreateShare_AssignTypes"][1]}
            </div>
            <div>
              <AssignOptions
                assignType={'residence'}
                selected={this.state.residSelection}
                allSelection={this.state.selectedList}
                _submit_new_node={this._set_newNode}/>
            </div>
          </div>
          <div>
            <div>
              {this.props.i18nUIString.catalog["subTitle_CreateShare_AssignTypes"][2]}
            </div>
            <div>
              <NodesSearch
                currentSet={this.state.freeSelection}
                _set_nodeByNodeBasic={(nodeBasic)=>{
                  if(this.state.selectedList.indexOf(nodeBasic.id) > (-1)){return;} // block adding if used by other types
                  this._set_newNode({nodeId: nodeBasic.id, type: 'freeOne'});}}
                _reset_searchSelection={(deletedNode)=>{this._set_deleteNodes(deletedNode, 'freeOne')}}/>
            </div>
          </div>
        </div>
        <div>
          {this._render_assignedNodes()}
        </div>
        <div>
          {"Done"}
        </div>
      </div>
    )
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
)(NodesEditor));
