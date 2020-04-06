import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  setMessageBoolean,
  setMessageSingleClose
} from "../../../redux/actions/general.js";
import {messageDialogInit} from "../../../redux/states/constants.js";

class AssignNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode:'',
      nodesTypes: {},
      restTypes: ["homeland", "residence"] //depend on type users can assign
    };
    this._render_assignedNodes = this._render_assignedNodes.bind(this);
    this._handleEnter_liItem = this._handleEnter_liItem.bind(this);
    this._handleLeave_liItem = this._handleLeave_liItem.bind(this);
    this._handleClick_NodeAssigned = this._handleClick_NodeAssigned.bind(this);
  }

  _handleEnter_liItem(e){
    this.setState({
      onNode: e.currentTarget.getAttribute('nodeid')
    })
  }

  _handleLeave_liItem(e){
    this.setState({
      onNode: ''
    })
  }

  _handleClick_NodeAssigned(event){
    event.preventDefault();
    event.stopPropagation();
    if(this.props.unitView=="editing") {
      // AssignNodes was not allowed change after first release to public
      this.props._submit_SingleCloseDialog({
        render: true,
        message: [{text: this.props.i18nUIString.catalog['message_Unit_Editing_AssignNotAllowed'],style:{}}], //format follow Boolean, as [{text: '', style:{}}]
        handlerPositive: ()=>{this.props._submit_SingleCloseDialog(messageDialogInit.singleClose); return;}
      });
      return;
    }
    let targetId = event.currentTarget.getAttribute('nodeid'); //type of attribute always be a 'string'
    // we'd better turn it into 'int', the type the DB saved
    targetId = parseInt(targetId);
    //now the type of targetId is 'int'
    let assignedList = this.props.assigned.map((assignedObj, index)=>{return assignedObj.nodeId;});

    if(assignedList.indexOf(targetId) < 0 && assignedList.length < 0 ){ // submit a new one, and still has postion
      let choiceType = '';
      switch (this.state.nodesTypes[targetId]) {
        case 'homeland':
          let restify = this.state.restTypes.indexOf('homeland') < 0 ? false : true;
          if (restify) {
            choiceType = "homeland";
            this.props._submit_new_node({ nodeId: targetId, type: choiceType }, 'assign');
            this.setState((prevState, props) => {
              let indexInList = prevState.restTypes.indexOf(choiceType);
              prevState.restTypes.splice(indexInList, 1);
              return { restTypes: prevState.restTypes }
            })
          } else return;
          break;
        case 'residence':
          let restify = this.state.restTypes.indexOf('residence') < 0 ? false: true;
          if(restify){
            choiceType = "residence";
            this.props._submit_new_node({ nodeId: targetId, type: choiceType }, 'assign');
            this.setState((prevState, props) => {
              let indexInList = prevState.restTypes.indexOf(choiceType);
              prevState.restTypes.splice(indexInList, 1);
              return { restTypes: prevState.restTypes }
            })
          }else return;
          break;
        case 'both':
          let restify = this.state.restTypes.length > 0 ? true : false;
          if (restify) {
            choiceType = this.state.restTypes.indexOf("homeland") < 0 ? "residence" : "homeland";
            this.props._submit_new_node({ nodeId: targetId, type: choiceType }, 'assign');
            this.setState((prevState, props) => {
              let indexInList = prevState.restTypes.indexOf(choiceType);
              prevState.restTypes.splice(indexInList, 1);
              return { restTypes: prevState.restTypes }
            })
          } else return;
          break;      
        default:
          break;
      }
  
    }else if(assignedList.indexOf(targetId) > -1){
      let indexInList = assignedList.indexOf(targetId);
      let targetType = this.props.assigned[indexInList].type;
      //add the it represent back to local state
      this.setState((prevState, props) => {
        prevState.restTypes.push(targetType);
        return { restTypes: prevState.restTypes }
      }, ()=>{
        /*
        we submit the delete in a callback because we did need the type saved in props,
        to prevent the type missing before the set the local state
        */
        //delete the targetNode from nodesSet
        this.props._submit_deleteNodes( indexInList, 'assign');        
      })
    }

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_assignedNodes(){
    const typeKeys = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: [];
    let belongNodesList = typeKeys.map((type, index)=>{
      let typeList = this.props.belongsByType[(type == "homeland") ? "homelandup" : "residenceup"].listToTop.slice(); //shallow copy
      typeList = typeList.unshift(this.props.belongsByType[(type == "homeland") ? "homelandup" : "residenceup"].nodeId); // level of node of "nodeId" represnet must lower than every "parent"
      return typeList;
    });
    // belongNodesList : [[], []]
    let nodesDOM =[];
    // now as we only have 2 type, we compare them directly
    if(belongNodesList.length != 2) belongNodesList.push([]); //But remember to ensure the belongNodesList has 2 items for this method
    let cycleCount = 0; //used to record the cycle loop ran
    for(let i=1 ; i< belongNodesList[0].length && i< belongNodesList[1].length; i++){ //keep 'i' sstart from 1, also used for 'cycaleCount'
      //from the last one in the list, toplevel ancestor
      let node0 = belongNodesList[0][belongNodesList[0].length -i],
          node1 = belongNodesList[1][belongNodesList[1].length -i];
      //if 2 nodes are the same, render once; if not, then the children woulld not be the same either, break to next step
      if (node0 == node1){
        /*
        and the type of records in props.assigned was 'int' as well,
        it's important because the array.indexOf() would see diff. types as 'not the same'
        */
        let assigning = (this.props.assigned.indexOf(nodeId) < 0) ? false : true;

        nodesDOM.push(
          <div>
            <li
              key={'_key_assignNode_both_' + i}
              nodeid={node0}
              className={classnames(
                styles.boxListItem,
                {
                  [styles.chosenListItem]: assigning,
                  [styles.mouseListItem]: (this.state.onNode == node0)
                }
              )}
              onClick={this._handleClick_NodeAssigned}
              onMouseEnter={this._handleEnter_liItem}
              onMouseLeave={this._handleLeave_liItem}>
              {(node0 in this.props.nounsBasic) &&
                <div>
                <span>{this.props.nounsBasic[node0].name}</span>
                <span>{this.props.nounsBasic[node0].prefix ? (", " + this.props.nounsBasic[node0].prefix) : ("")}</span>
                </div>
              }
            </li>
          </div>
        );
        cycleCount = i;
      }else break;
    };
    if (cycleCount < belongNodesList[0].length || cycleCount < belongNodesList[1].length){
      let restList = [];
      for(let i=0; i<2; i++){
        let restItems = belongNodesList[i].splice(-1, cycleCount);
        restList.push(restItems);
      }
      restList.forEach((restItems, index)=>{
        let itemsDOM = restItems.map((nodeId, indexItems) => {
          retuen(
            <li
              key={'_key_assignNode_one_' + indexItems}
              nodeid={nodeId}
              className={classnames(
                styles.boxListItem,
                {
                  [styles.chosenListItem]: assigning,
                  [styles.mouseListItem]: (this.state.onNode == nodeId)
                }
              )}
              onClick={this._handleClick_NodeAssigned}
              onMouseEnter={this._handleEnter_liItem}
              onMouseLeave={this._handleLeave_liItem}>
              {(nodeId in this.props.nounsBasic) &&
                <div>
                  <span>{this.props.nounsBasic[nodeId].name}</span>
                  <span>{this.props.nounsBasic[nodeId].prefix ? (", " + this.props.nounsBasic[nodeId].prefix) : ("")}</span>
                </div>
              }
            </li>
          )
        });
        nodesDOM.unshift(
          <div>
            {itemsDOM}
          </div>
        );
      })

    }

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comAssignNodes)}>
        <div>{this.props.i18nUIString.catalog["guidingCreateShare_AssignGroup"]}</div>
        <div>
          {this._render_assignedNodes()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
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
    _submit_SingleCloseDialog: (obj)=>{dispatch(setMessageSingleClose(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignNodes));
