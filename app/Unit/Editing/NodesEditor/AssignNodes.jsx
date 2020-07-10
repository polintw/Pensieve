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
      // check if the type the target still empty
      if (this.state.restTypes.indexOf(this.nodesTypes[targetId]) > -1 || this.nodesTypes[targetId]== 'both') {
        let choiceType = this.nodesTypes[targetId];
        //but the type 'both' was not a practical type, need transmit to either homeland or residence
        // if(choiceType == 'both' ) choiceType = this.state.restTypes.indexOf("homeland") < 0 ? "residence" : "homeland";
        // on Jul. 8 2020, checked, no need to replace 'both', pass it to parent's state, but modified it beofre axios

        this.props._submit_new_node({ nodeId: targetId, type: choiceType }, 'assign');
        //and rm the type from the 'rest'Types
        this.setState((prevState, props) => {
          let indexInList = prevState.restTypes.indexOf(choiceType); // in case 'both', the indexInList would be '-1'
          if(indexInList > -1 ) prevState.restTypes.splice(indexInList, 1);
          return { restTypes: prevState.restTypes }
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
      };

    }
    else if(assignedList.indexOf(targetId) > -1){ // going to rm this node from assignedList
      let indexInList = assignedList.indexOf(targetId);
      let targetType = this.props.assigned[indexInList].type;
      //add the it represent back to local state
      this.setState((prevState, props) => {
        if( targetType != 'both') prevState.restTypes.push(targetType); // only 'residence' || 'homeland' need to be push
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
    const assignedNodes = this.props.assigned.map((assignedObj, index)=>{return assignedObj.nodeId;});
    /* there is a period the typeKeys would be 'empty' at all: belongsByType not yet res.
    or ther parent list haven't res yet, also empty render */
    if( !this.props.belongsByType.fetched || !this.props.belongsByType.fetchedSeries) return [];
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
                    styles.spanListItem, stylesFont.fontContent, "colorWhite",
                    styles.chosenSpanItem
                  )}>
                  {this.props.nounsBasic[nodeId].name}</span>
                {
                  !!this.props.nounsBasic[nodeId].prefix &&
                  <span
                    className={classnames(
                      styles.spanListItem, stylesFont.fontContent, "colorWhite",
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

    // compare series list to render the same node only once & create node-type table(obj)
    let seriesList = []; // to save both serires as nest arr: [[ 'list homeland'], [ 'list residence']]
    let nodesList= [],
        nodesToType= {};
    // first, create seriesList by setTypesList, so the type order and the 'group' order would follow it.
    this.props.belongsByType.setTypesList.forEach((type, index) => {
      let series = (type == "homeland") ? "homelandup" : "residenceup";
      let typeList = this.props.belongsByType[series].listToTop.slice(); //shallow copy
      // then unshift the belong itself
      typeList.unshift(this.props.belongsByType[series].nodeId);
      typeList.reverse(); // reverse the typeList, the 'largest' administration would be the first
      seriesList.push(typeList);
    });
    /*
    then, loop the seriesList, and by each item in each sereis,
    compare to nodesList. If the item hasn't been in nodesList, unshift it.
    */
    seriesList.forEach((series, index) => {
      series.forEach((nodeId, i) => {
        if(nodesList.indexOf(nodeId) < 0){
          nodesList.unshift(nodeId);
          nodesToType[nodeId] = this.props.belongsByType.setTypesList[index]; // nodeId: "homeland" || "residence"
        }
        else{
          nodesToType[nodeId] = "both";
          return;
        };
      });
    });

    // simply loop the nodes list to render
    let nodesDOM =[];
    nodesList.forEach((nodeId, index)=>{
      let assigning = (assignedNodes.indexOf(nodeId) < 0) ? false : true;
      // push a seperation '．' if the type change
      if(nodesToType[nodeId] != nodesToType[nodesList[(index-1)]] && index != 0) nodesDOM.push(
        <span
          key={'_key_assignNode_sepration_' + index }
          className={classnames(stylesFont.colorEditBlack, stylesFont.fontContent)}
          style={{display: 'flex',alignItems:'center',marginRight: '1rem'}}>{"．"}</span>
      );

      nodesDOM.push(
        <li
          key={'_key_assignNode_' + index }
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
                  styles.spanListItem, stylesFont.fontContent,
                  {
                    ["colorGrey"]: !assigning && this.state.onNode != nodeId,
                    ["colorWhite"]: assigning || this.state.onNode == nodeId,
                    [styles.chosenSpanItem]: assigning,
                    [styles.mouseSpanItem]: (this.state.onNode== nodeId)
                  }
                )}>
                {this.props.nounsBasic[nodeId].name}</span>
              {
                !!this.props.nounsBasic[nodeId].prefix &&
                <span
                  className={classnames(
                    styles.spanListItem, stylesFont.fontContent,
                    {
                      ["colorGrey"]: !assigning && this.state.onNode != nodeId,
                      ["colorWhite"]: assigning || this.state.onNode == nodeId,
                      [styles.chosenSpanItem]: assigning,
                      [styles.mouseSpanItem]: (this.state.onNode== nodeId)
                    }
                  )}
                  style={{ alignSelf:'right', fontSize: '1.2rem'}}>
                  {", "+this.props.nounsBasic[nodeId].prefix}</span>
              }
            </div>
          }
        </li>
      );
    });
    // finally, remembering set nodesToType to this.nodesTypes, used to an old method to set assigning to props
    this.nodesTypes = nodesToType;

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
