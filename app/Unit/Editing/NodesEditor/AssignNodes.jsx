import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import {
  setMessageBoolean,
  setMessageSingle,
  setMessageSingleClose
} from "../../../redux/actions/general.js";
import {messageDialogInit} from "../../../redux/states/constants.js";

class AssignNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode:'',
      restTypes: ["homeland", "residence"] //depend on type users can assign
    };
    this._render_assignedNodes = this._render_assignedNodes.bind(this);
    this._handleEnter_liItem = this._handleEnter_liItem.bind(this);
    this._handleLeave_liItem = this._handleLeave_liItem.bind(this);
    this._handleClick_NodeAssigned = this._handleClick_NodeAssigned.bind(this);
    this.nodesTypes = {}; //it's a general var used across f()
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
      this.props._submit_SingleDialog({
        render: true,
        message: [{text: this.props.i18nUIString.catalog['message_Unit_Editing_AssignNotAllowed'],style:{}}], //format follow Boolean, as [{text: '', style:{}}]
        handlerPositive: ()=>{this.props._submit_SingleDialog(messageDialogInit.single)},
        buttonValue: this.props.i18nUIString.catalog['submit_understand']
      });
      return;
    };

    let targetId = event.currentTarget.getAttribute('nodeid'); //type of attribute always be a 'string'
    // we'd better turn it into 'int', the type the DB saved, so did the tpye the props.belongTypes saved
    targetId = parseInt(targetId); //now the type of targetId is 'int'
    // and the type of nodeId saved in assigned from  props were int, too
    let assignedList = this.props.assigned.map((assignedObj, index)=>{return assignedObj.nodeId;});

    if(assignedList.indexOf(targetId) < 0 && assignedList.length < 2 ){ // submit a new one, and still has postion
      if (this.state.restTypes.indexOf(this.nodesTypes[targetId]) > -1 || this.nodesTypes[targetId]== 'both') {
        let choiceType = this.nodesTypes[targetId];
        //but the type 'both' was not a practical type, need transmit to either homeland or residence
        if(choiceType == 'both' ) choiceType = this.state.restTypes.indexOf("homeland") < 0 ? "residence" : "homeland";

        this.props._submit_new_node({ nodeId: targetId, type: choiceType }, 'assign');
        //and rm the type from the 'rest'Types
        this.setState((prevState, props) => {
          let indexInList = prevState.restTypes.indexOf(choiceType);
          prevState.restTypes.splice(indexInList, 1);
          return { restTypes: prevState.restTypes }
        })
      } else{
        this.props._submit_SingleDialog({
          render: true,
          message: [{text:this.props.i18nUIString.catalog['message_UnitEdit_ruleAssignedNodes'][0],style:{}}],
          handlerPositive: ()=>{this.props._submit_SingleDialog(messageDialogInit.single)},
          buttonValue: this.props.i18nUIString.catalog['submit_understand']
        });
        return;
      };

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
    else{
      this.props._submit_SingleDialog({
        render: true,
        message: [{text:this.props.i18nUIString.catalog['message_UnitEdit_ruleAssignedNodes'][0],style:{}}],
        handlerPositive: ()=>{this.props._submit_SingleDialog(messageDialogInit.single)},
        buttonValue: this.props.i18nUIString.catalog['submit_understand']
      });
      return;
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
    const assignedNodes = this.props.assigned.map((assignedObj, index)=>{return assignedObj.nodeId;});
    /*
    there is a period the typeKeys would be 'empty' at all: belongsByType not yet res.
    And we just give up render these 'empty'
    */
    if(typeKeys.length < 1) {
      return <span className={classnames(stylesFont.colorGrey, stylesFont.fontContent)}>
        {this.props.i18nUIString.catalog['guidingCreateShare_AssignNull']}</span>
    };
    // or ther parent list haven't res yet, also empty render
    if( !((typeKeys[0] == "homeland") ? "homelandup" : "residenceup" in this.props.belongsByType)) return [];
    /*
    simple first. If we are now editing a published shared, not allowing editing assigned
    */
    if(this.props.unitView=="editing") {
      let nodesDOM = assignedNodes.map((nodeId,index)=>{
        return (
          <li
            key={'_key_assignNode_readonly_' + index}
            nodeid={nodeId}
            className={classnames(
              styles.boxListItem,
              styles.chosenListItem
            )}
            style={{cursor: 'default'}}
            onClick={this._handleClick_NodeAssigned}>
            {(nodeId in this.props.nounsBasic) &&
              <div>
                <span
                  className={classnames(
                    styles.spanListItem, stylesFont.fontContent, stylesFont.colorGrey,
                    styles.chosenSpanItem
                  )}>
                  {this.props.nounsBasic[nodeId].name}</span>
                {
                  !!this.props.nounsBasic[nodeId].prefix &&
                  <span
                    className={classnames(
                      styles.spanListItem, stylesFont.fontContent, stylesFont.colorGrey,
                      styles.chosenSpanItem
                    )}
                    style={{ alignSelf:'right', fontSize: '1.2rem', fontStyle: 'italic'}}>
                    {", "+this.props.nounsBasic[nodeId].prefix}</span>
                }
              </div>
            }
          </li>
        )
      })
      return nodesDOM;
    }; //process would stop if return from this if()
    /*
    and if we are creating a new one compare to editing a shared one:
    we build up the nodesList first, save by types
    and compare 2 list from the last one(top parent),
    if both the item were the same, we only render once
    if the items were different, we render the 2 lists seperately.
    */
    //actually now we only have 2 types: 'homeland' or 'residence', must be either one or both
    let belongNodesList = typeKeys.map((type, index)=>{ //recruite the ancestors list from Belong tree
      let typeList = this.props.belongsByType[(type == "homeland") ? "homelandup" : "residenceup"].listToTop.slice(); //shallow copy
      // then inshift the belong itself, and level of node of "nodeId" represnet must lower than every "parent"
      typeList.unshift(this.props.belongsByType[(type == "homeland") ? "homelandup" : "residenceup"].nodeId);
      typeList.forEach((item, i) => {
        this.nodesTypes[item] = type; //set type to each node, Notice! some time both types have the same node, a 'shared' parent, and that would be mark 'both' later during the compare process
      });

      return typeList;
    });
    // belongNodesList : [[], []]
    let nodesDOM =[];
    // now as we only have 2 type, we compare them directly
    if(belongNodesList.length != 2) belongNodesList.push([]); //But remember to ensure the belongNodesList has 2 items for this method
    let cycleCount = 0; //used to record the cycle loop ran
    for(let i=1 ; i <= belongNodesList[0].length && i <= belongNodesList[1].length; i++){ //keep 'i' sstart from 1, also used for 'cycaleCount'
      //from the last one in the list, toplevel ancestor
      let node0 = belongNodesList[0][belongNodesList[0].length -i],
          node1 = belongNodesList[1][belongNodesList[1].length -i];
      //if 2 nodes are the same, render once; if not, then the children woulld not be the same either, break to next step
      if (node0 == node1){
        /*
        and the type of records in props.assigned was 'int' as well,
        it's important because the array.indexOf() would see diff. types as 'not the same'
        */
        let assigning = (assignedNodes.indexOf(node0) < 0) ? false : true;

        nodesDOM.push(
          <li
            key={'_key_assignNode_both_' + i}
            nodeid={node0}
            className={classnames(
              styles.boxListItem,
              {
                [styles.chosenListItem]: assigning,
                [styles.mouseListItem]: (this.state.onNode == node0 && !assigning)
              }
            )}
            onClick={this._handleClick_NodeAssigned}
            onMouseEnter={this._handleEnter_liItem}
            onMouseLeave={this._handleLeave_liItem}>
            {(node0 in this.props.nounsBasic) &&
              <div>
                <span
                  className={classnames(
                    styles.spanListItem, stylesFont.fontContent, stylesFont.colorGrey,
                    {
                      [styles.chosenSpanItem]: assigning,
                      [styles.mouseSpanItem]: (this.state.onNode== node0)
                    }
                  )}>
                  {this.props.nounsBasic[node0].name}</span>
                {
                  !!this.props.nounsBasic[node0].prefix &&
                  <span
                    className={classnames(
                      styles.spanListItem, stylesFont.fontContent, stylesFont.colorGrey,
                      {
                        [styles.chosenSpanItem]: assigning,
                        [styles.mouseSpanItem]: (this.state.onNode== node0)
                      }
                    )}
                    style={{ alignSelf:'right', fontSize: '1.2rem', fontStyle: 'italic'}}>
                    {", "+this.props.nounsBasic[node0].prefix}</span>
                }
              </div>
            }
          </li>
        );
        this.nodesTypes[node0] = 'both'; //modifying the type of node in nodesTypes(no matter what's the original)
        cycleCount = i;
      }else break;
    };
    //so, cycleCount shorter than list.length means the belongs nodes are not the same (actually this is should be normal condition)
    if (cycleCount < belongNodesList[0].length || cycleCount < belongNodesList[1].length){
      let restList = [];
      for(let i=0; i< 2; i++){
        let restItems = belongNodesList[i].slice();
        restItems.splice(-1, cycleCount);
        restList.push(restItems);
      };
      restList.forEach((restItems, index)=>{
        //at first, insert "/" if right after the shared nodes as a separation
        if(index == 0 && nodesDOM.length > 0) nodesDOM.push(
          <span
            className={classnames(stylesFont.colorEditBlack, stylesFont.fontContent)}
            style={{display: 'flex',alignItems:'center',marginRight: '1rem'}}>{" / "}</span>
        );
        //if this is not the first round, add a '．' as separation
        if(index > 0) nodesDOM.unshift(
          <span
            className={classnames(stylesFont.colorEditBlack, stylesFont.fontContent)}
            style={{display: 'flex',alignItems:'center',marginRight: '1rem'}}>{"．"}</span>
        );
        restItems.forEach((nodeId, indexItems) => {
          let assigning = (assignedNodes.indexOf(nodeId) < 0) ? false : true;
          nodesDOM.unshift (
            <li
              key={'_key_assignNode_' + index +"_"+ indexItems}
              nodeid={nodeId}
              className={classnames(
                styles.boxListItem,
                {
                  [styles.chosenListItem]: assigning,
                  [styles.mouseListItem]: (this.state.onNode == nodeId && !assigning)
                }
              )}
              onClick={this._handleClick_NodeAssigned}
              onMouseEnter={this._handleEnter_liItem}
              onMouseLeave={this._handleLeave_liItem}>
              {(nodeId in this.props.nounsBasic) &&
                <div>
                  <span
                    className={classnames(
                      styles.spanListItem, stylesFont.fontContent, stylesFont.colorGrey,
                      {
                        [styles.chosenSpanItem]: assigning,
                        [styles.mouseSpanItem]: (this.state.onNode== nodeId)
                      }
                    )}>
                    {this.props.nounsBasic[nodeId].name}</span>
                  {
                    !!this.props.nounsBasic[nodeId].prefix &&
                    <span
                      className={classnames(
                        styles.spanListItem, stylesFont.fontContent, stylesFont.colorGrey,
                        {
                          [styles.chosenSpanItem]: assigning,
                          [styles.mouseSpanItem]: (this.state.onNode== nodeId)
                        }
                      )}
                      style={{ alignSelf:'right', fontSize: '1.2rem', fontStyle: 'italic'}}>
                      {", "+this.props.nounsBasic[nodeId].prefix}</span>
                  }
                </div>
              }
            </li>
          )
        });
      })
    }

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comAssignNodes)}>
        {this._render_assignedNodes()}

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
    _submit_SingleDialog: (obj)=>{dispatch(setMessageSingle(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignNodes));
