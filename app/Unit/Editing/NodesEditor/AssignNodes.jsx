import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';

class AssignNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_assignNodes = this._render_assignNodes.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_assignNodes(){
    const assignedNodes = this.props.assigned.map((assignedObj, index) => { return assignedObj.nodeId; });

    let nodesDOM = assignedNodes.map((nodeId, index) => {
      return (
        <li
          key={'_key_assignNode_readonly_' + index}
          nodeid={nodeId}
          className={classnames(
            styles.boxListItem,
            styles.chosenListItem
          )}
          style={{ cursor: 'default' }}
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
                  style={{ alignSelf: 'right', fontSize: '1.2rem', fontStyle: 'italic' }}>
                  {", " + this.props.nounsBasic[nodeId].prefix}</span>
              }
            </div>
          }
        </li>
      )
    })

    /*
    simple first. If we are now editing a published shared, not allowing editing assigned
    */
    if (this.props.unitView == "editing") {

    }; //process would stop if return from this if()

    return nodesDOM;

  }

  render(){
    return(
      <div
        className={classnames(styles.comAssignNodes)}>
        <div
          className={classnames(styles.boxSubtitle, stylesFont.fontSubtitle, stylesFont.colorEditLightBlack)}>
          {this.props.i18nUIString.catalog["guidingCreateShare_AssignGroup"]}
        </div>
        <div
          className={classnames(styles.editorRow, styles.boxAssignNodes)}>
            {this._render_assignNodes()}
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
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
