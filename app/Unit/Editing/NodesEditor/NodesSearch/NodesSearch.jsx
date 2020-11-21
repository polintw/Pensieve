import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {NodeSearchModule} from '../../../../Components/NodesSearch/NodeSearchModule.jsx';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";

class NodesSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_node = this._render_node.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this._handleClick_belongsDelete = this._handleClick_belongsDelete.bind(this);
  }

  _set_choiceFromSearch(nodeBasic){
    this.props._submit_NounsList_new([nodeBasic.id]);
    //pass the choice to parent's state
    this.props._set_nodeByNodeBasic(nodeBasic);
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  _render_node() {
    //determine the id of current node
    const nodeId = this.props.currentSet;

    return (
      <li
        key={'_key_assignNode_vonSearch' }
        nodeid={nodeId}
        className={classnames(
          styles.chosenListItem,
        )}
        onClick={this._handleClick_belongsDelete}>
        {(nodeId in this.props.nounsBasic) &&
          <div>
            <span
              className={classnames("fontContent", 'colorEditBlack')}>
              {this.props.nounsBasic[nodeId].name}</span>
            {
              !!this.props.nounsBasic[nodeId].prefix &&
              <span
                className={classnames("fontContent", 'colorEditBlack')}
                style={{ alignSelf:'right', fontSize: '1.2rem'}}>
                {", "+this.props.nounsBasic[nodeId].prefix}</span>
            }
          </div>
        }
      </li>
    )
  }

  render(){
    return(
      <div
        className={styles.comNodesSearch}>
        {
          !!this.props.currentSet ? (
            <div>
              {this._render_node()}
            </div>
          ):(
            <NodeSearchModule
              type={"inputDirect"}
              mountFocus={false}
              reversed = {true}
              _set_nodeChoice={this._set_choiceFromSearch}
              _set_SearchModal_switch={()=>{}}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();}}/>
          )
        }

      </div>
    )
  }

  _handleClick_belongsDelete(event){
    event.preventDefault();
    event.stopPropagation();

    this.props._reset_searchSelection(this.props.currentSet); //nodtice, 'currentSet' is integer
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesSearch));
