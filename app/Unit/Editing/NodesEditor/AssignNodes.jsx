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
    let targetId = event.currentTarget.getAttribute('nodeid'); //type of attribute always be a 'string'
    // we'd better turn it into 'int', the type the DB saved
    targetId = parseInt(targetId);
    //now the type of targetId is 'int'
    let assignify = (this.props.assigned.indexOf(targetId) < 0) ? false : true;

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
      //that is, due to directly from the GET method, the type of nodeId cintain in 'belongsByType' was 'int'!
      return this.props.belongsByType[type];
    });

    let nodesDOM = belongNodesList.map((nodeId, index)=>{ //tpye of nodeId here was 'int'
      /*
      and the type of records in props.assigned was 'int' as well,
      it's important because the array.indexOf() would see diff. types as 'no the same'
      */
      let assigning = (this.props.assigned.indexOf(nodeId) < 0) ? false : true;
      return (
        <li
          key={'_key_assignNode_'+index}
          nodeid={nodeId}
          className={classnames(
            styles.boxListItem,
            {
              [styles.chosenListItem]: assigning,
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
