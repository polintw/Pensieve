import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  setMessageSingle,
} from "../../../../redux/actions/general.js";
import { messageDialogInit } from "../../../../redux/states/constants.js";

class AssignOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false
    };
    this._render_nodesOptions = this._render_nodesOptions.bind(this);
    this._handleEnter_liItem = this._handleEnter_liItem.bind(this);
    this._handleLeave_liItem = this._handleLeave_liItem.bind(this);
    this._handleClick_option = this._handleClick_option.bind(this);
  }

  _handleClick_option(event){
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
    /*
    then the point is, we won't update anything if:
    - click the one used in another type, not for this type
    */
    if(this.props.allSelection.indexOf(targetId) > (-1) && targetId != this.props.selected) return;
    // then we were free to pass the e.nodeId to parent
    if(targetId != this.props.selected){ // going to replace current one or total new one
      this.props._submit_new_node({ nodeId: targetId, type: this.props.assignType });
    }
    else if(targetId == this.props.selected){ // click on the one currently selected
      this.props._submit_deleteNodes( targetId, this.props.assignType);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodesOptions(){
    /* there is a period the typeKeys would be 'empty' at all: belongsByType not yet res.
    or ther parent list haven't res yet, also empty render */
    if( !this.props.belongsByType.fetched || !this.props.belongsByType.fetchedSeries) return [];

    let nodesList= []; // the main list we are going to render
    let series = (this.props.assignType == "homeland") ? "homelandup" : "residenceup"; // pick the nodes series from redux state
    nodesList = this.props.belongsByType[series].listToTop.slice(); //shallow copy
    // then unshift the belong itself(which was not in the 'listToTop')
    nodesList.unshift(this.props.belongsByType[series].nodeId);

    // then simply loop the nodesList to render
    let nodesDOM =[];
    nodesList.forEach((nodeId, index)=>{
      let selected = (nodeId == this.props.selected) ? true: false; // if this node was the one chosen
      let assigning = (this.props.allSelection.indexOf(nodeId) > (-1) && !selected) ? true : false; // if this node used in other type

      nodesDOM.push(
        <li
          key={'_key_assignNode_' + index }
          nodeid={nodeId}
          className={classnames(
            styles.boxListItem,
            {
              [styles.chosenListItem]: selected, // the first, chosen one of this type
              [styles.assignedListItem]: (!selected && assigning), // no chosen, but assign in other type
              [styles.mouseListItem]: (this.state.onNode == nodeId && !selected && !assigning) //no chosen, no assigned in any type
            }
          )}
          onClick={this._handleClick_option}
          onMouseEnter={this._handleEnter_liItem}
          onMouseLeave={this._handleLeave_liItem}>
          {(nodeId in this.props.nounsBasic) &&
            <div>
              <span
                className={classnames(
                  styles.spanListItem, "fontContent",
                  {
                    ['colorEditBlack']: selected,
                    ['colorWhite']: (this.state.onNode == nodeId && !assigning), //mouse on but not assigned in other type
                    ['colorWhiteGrey']: !selected && assigning, // not the chosen one but assigned in other type
                    ["colorGrey"]: !selected && this.state.onNode != nodeId && !assigning, // the rest condition
                  }
                )}>
                {this.props.nounsBasic[nodeId].name}</span>
              {
                !!this.props.nounsBasic[nodeId].prefix &&
                <span
                  className={classnames(
                    styles.spanListItem, "fontContent",
                    {
                      ['colorEditBlack']: selected,
                      ['colorWhite']: (this.state.onNode == nodeId && !assigning), //mouse on but not assigned in other type
                      ['colorWhiteGrey']: !selected && assigning, // not the chosen one but assigned in other type
                      ["colorGrey"]: !selected && this.state.onNode != nodeId && !assigning, // the rest condition
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
    if(nodesDOM.length == 0){ // nodesList was empty, means the user hasn't register belong of this type
      nodesDOM.push(
        <div>
          <span
            className={classnames(
              styles.spanListItem, "fontContent", "colorGrey")}>
            {
              this.props.i18nUIString.catalog['guidingCreateShare_AssignNull'] +
              this.props.i18nUIString.catalog[(this.props.assignType=='homeland') ? "text_home":"text_resid"]
            }
          </span>
        </div>
      )
    }

    return nodesDOM;
  }

  render(){
    return(
      <div>
        {this._render_nodesOptions()}
      </div>
    )
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

}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    belongsByType: state.belongsByType
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
)(AssignOptions));
