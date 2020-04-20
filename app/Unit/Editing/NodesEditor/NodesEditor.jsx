import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../stylesFont.module.css';
import AssignNodes from './AssignNodes.jsx';
import {updateNodesBasic} from '../../../redux/actions/general.js'

class NodesEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render(){
    return(
      <div
        className={classnames(styles.comNodesEditor)}>
        <div
          className={classnames(styles.boxSubtitle, stylesFont.fontSubtitle, stylesFont.colorEditLightBlack)}>
          {this.props.i18nUIString.catalog["guidingCreateShare_AssignGroup"]}
        </div>
        <div
          className={classnames(styles.editorRow, styles.boxAssignNodes)}>
          <AssignNodes
            assigned={this.props.nodesSet['assign']}
            _submit_new_node={this.props._submit_new_node}
            _submit_deleteNodes={this.props._submit_deleteNodes}/>
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
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesEditor));
