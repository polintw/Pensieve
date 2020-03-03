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

    };
    this._render_assignedNodes = this._render_assignedNodes.bind(this);
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
      return (
        <li
          key={'_key_assignNode_'+index}
          nodeid={nodeId}
          onClick={}
          onMouseEnter={_handleEnter_liItem}
          onMouseLeave={_handleLeave_liItem}>
          {(nodeId in this.props.nounsBasic) &&
            <div>
              <span>{this.props.nounsBasic[nodeId].name}</span>
              <span>{this.props.nounsBasic[nodeId].prefix? (", "+this.props.nounsBasic[nodeId].prefix):("")}</span>
            </div>
            }
        </li>

      )
    })

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
