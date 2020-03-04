import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NodesList from './NodesList.jsx';
import AssignNodes from './AssignNodes.jsx';
import {updateNodesBasic} from '../../../redux/actions/general.js'
import {NodeSearchModule} from '../../../Components/Node/NodeSearchModule.jsx';

class NodesEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this.style={

    }
  }

  _set_choiceFromSearch(nodeBasic){
    //create obj to fit the format of state in redux
    let insertObj = {};
    insertObj[nodeBasic.id] = nodeBasic;
    //pass the node basic into redux first,
    //so the handler would not need to fetch node data from db again
    this.props._submit_Nodes_insert(insertObj);
    //no need to fetch node data from db again for any condition gave the choice a non-false value
    //has already save the data of node in reducer.
    this.props._submit_new_node(nodeBasic.id, 'tags'); //and pass the choice to parent comp
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
        <div>
          <AssignNodes
            assigned={this.props.nodesSet['assign']}
            _submit_new_node={this.props._submit_new_node}
            _submit_deleteNodes={this.props._submit_deleteNodes}/>
        </div>
        <div
          style={this.style.Com_Editing_NounsEditor_List}>
          <NodesList
            nodesList={this.props.nodesSet['tags']}
            _set_nounDelete={this.props._submit_deleteNodes}/>
        </div>
        <NodeSearchModule
          type={"share"}
          _set_nodeChoice={this._set_choiceFromSearch}
          _set_SearchModal_switch={()=>{}}
          _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();}}/>

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
