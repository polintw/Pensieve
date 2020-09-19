import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  setMessageSingle,
} from "../../../redux/actions/general.js";
import { messageDialogInit } from "../../../redux/states/constants.js";

class AssignNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNodeDelete: ''
    };
    this._render_assignNodes = this._render_assignNodes.bind(this);
    this._handleEnter_liItem = this._handleEnter_liItem.bind(this);
    this._handleLeave_liItem = this._handleLeave_liItem.bind(this);
    this._handleClick_deleteNode = this._handleClick_deleteNode.bind(this);
    this._handleClick_editNode = this._handleClick_editNode.bind(this);
    this._handleClick_NodeAssigned = this._handleClick_NodeAssigned.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_assignNodes(){
    const assignedNodes = this.props.nodesSet.map((assignedObj, index) => { return assignedObj.nodeId; });

    let nodesDOM = assignedNodes.map((nodeId, index) => { // would be '[]' if the props.nodesSet is empty
      return (
        <li
          key={'_key_assignNode_readonly_' + index}
          nodeid={nodeId}
          className={classnames(
            styles.boxListItem,
            styles.chosenListItem
          )}
          onClick={this._handleClick_NodeAssigned}>
          {(nodeId in this.props.nounsBasic) &&
            <div>
              <span
                className={classnames(
                  styles.spanListItem, "fontContent", "colorWhite",
                )}>
                {this.props.nounsBasic[nodeId].name}</span>
              {
                !!this.props.nounsBasic[nodeId].prefix &&
                <span
                  className={classnames(
                    styles.spanListItem, 'fontContent', "colorWhite",
                  )}
                  style={{ alignSelf: 'right', fontSize: '1.2rem' }}>
                  {", " + this.props.nounsBasic[nodeId].prefix}</span>
              }
            </div>
          }
          {
            (this.props.unitView != "editing") &&
            <div
              nodeid={nodeId}
              className={classnames(
                styles.boxListDelete,
                {[styles.mouseListDelete]: (this.state.onNodeDelete == nodeId)}
              )}
              onClick={this._handleClick_deleteNode}
              onMouseEnter={this._handleEnter_liItem}
              onMouseLeave={this._handleLeave_liItem}>
              <span
                className={classnames(
                  styles.spanListItem, "fontContent",
                  {
                    ["colorWhite"]: this.state.onNodeDelete != nodeId,
                    ["colorGrey"]: this.state.onNodeDelete == nodeId,
                  }
                )}>
                {" ╳ "}
              </span>
            </div>
          }
        </li>
      )
    })
    // then, add button to enter edit view
    // only add when 'creating'
    if(this.props.unitView != "editing"){
      nodesDOM.push(
        {
          (nodesDOM.length < 3) ? (
            <div
              key={'_key_assignNode_readonly_add' }
              className={classnames(
                styles.boxListItem,
                {

                }
              )}
              style={{ cursor: 'pointer' } /* overwrite the cursor setting in boxListItem */}
              onClick={this._handleClick_editNode}
              onMouseEnter={this.}
              onMouseLeave={this.}>
              "add"
            </div>
          ) : (
            <div
              key={'_key_assignNode_readonly_add' }
              className={classnames(

              )}
              style={{ cursor: 'pointer' } /* overwrite the cursor setting in boxListItem */}
              onClick={this._handleClick_editNode}
              onMouseEnter={this.}
              onMouseLeave={this.}>
              {this.props.i18nUIString.catalog['submit_edit']}
            </div>
          )
        }
      )
    }

    return nodesDOM;

  }

  render(){
    return(
      <div
        className={classnames(styles.comAssignNodes)}>
        <div
          className={classnames(styles.boxSubtitle, "fontSubtitle", "colorEditLightBlack")}>
          {this.props.i18nUIString.catalog["guidingCreateShare_AssignGroup"]}
        </div>
        <div
          className={classnames(styles.editorRow)}>
            {this._render_assignNodes()}
        </div>
      </div>
    )
  }

  _handleClick_NodeAssigned(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.unitView == "editing") {
      // AssignNodes was not allowed change after first release to public
      this.props._submit_SingleDialog({
        render: true,
        message: [{ text: this.props.i18nUIString.catalog['message_Unit_Editing_AssignNotAllowed'], style: {} }], //format follow Boolean, as [{text: '', style:{}}]
        handlerPositive: () => { this.props._submit_SingleDialog(messageDialogInit.single) },
        buttonValue: this.props.i18nUIString.catalog['submit_understand']
      });
    };
    // return after processed in 'editing', or straight in create
    return;
  }

  _handleClick_editNode(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props._set_nodesEditView();
  }

  _handleClick_deleteNode(event) {
    event.preventDefault();
    event.stopPropagation();

    let targetId = event.currentTarget.getAttribute('nodeid'); //type of attribute always be a 'string'
    // we'd better turn it into 'int', the type the DB saved, so did the tpye the props.belongTypes saved
    targetId = parseInt(targetId); //now the type of targetId is 'int'
    // and the type of nodeId saved in assigned from  props were int, too
    let assignedList = this.props.nodesSet.map((assignedObj, index) => { return assignedObj.nodeId; });
    let indexInList = assignedList.indexOf(targetId);

    //delete the targetNode from nodesSet
    this.props._submit_deleteNodes(indexInList);
  }

  _handleEnter_liItem(e) {
    this.setState({
      onNodeDelete: e.currentTarget.getAttribute('nodeid')
    })
  }

  _handleLeave_liItem(e) {
    this.setState({
      onNodeDelete: ''
    })
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitView: state.unitView,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_SingleDialog: (obj) => { dispatch(setMessageSingle(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignNodes));
