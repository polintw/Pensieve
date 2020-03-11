import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class AssignNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode:''
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
    let targetId = event.currentTarget.getAttribute('nodeid');
    let assignify = event.currentTarget.getAttribute('assigning');
    assignify ? (
      this.props._submit_deleteNodes(targetId, 'assign')
    ):(
      this.props._submit_new_node(targetId, 'assign')
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_assignedNodes(){
    const typeKeys = Object.keys(this.props.belongsByType);
    let belongNodesList = typeKeys.map((type, index)=>{
      return this.props.belongsByType[type];
    });

    let nodesDOM = belongNodesList.map((nodeId, index)=>{
      let assigning = this.props.assigned.filter((assignedNode, index)=>{
        return assignedNode == nodeId;
      });
      return (
        <li
          key={'_key_assignNode_'+index}
          nodeid={nodeId}
          assigning={assigning}
          className={classnames(
            styles.boxListItem,
            {
              [styles.chosenListItem]: (assigning.length > 0),
              [styles.mouseListItem]: (this.state.onNode==nodeId)
            }
          )}
          onClick={this._handleClick_NodeAssigned}
          onMouseEnter={this._handleEnter_liItem}
          onMouseLeave={this._handleLeave_liItem}>
          {(nodeId in this.props.nounsBasic) &&
            <div>
              <span>{this.props.nounsBasic[nodeId].name}</span>
              <span>{this.props.nounsBasic[nodeId].prefix? (", "+this.props.nounsBasic[nodeId].prefix):("")}</span>
            </div>
            }
        </li>

      )
    })

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
)(AssignNodes));
