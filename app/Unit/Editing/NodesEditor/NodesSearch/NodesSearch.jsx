import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {NodeSearchModule} from '../../../../Components/Node/NodeSearchModule.jsx';
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
    this._handleEnter_spanDelete = this._handleEnter_spanDelete.bind(this);
    this._handleLeave_spanDelete = this._handleLeave_spanDelete.bind(this);
    this._handleClick_belongsDelete = this._handleClick_belongsDelete.bind(this);

  }

  _handleEnter_spanDelete(e) {

  }

  _handleLeave_spanDelete(e) {

  }

  _set_choiceFromSearch(nodeBasic){
    this.props._submit_NounsList_new([nodeBasic.id]);
    //pass the choice to parent's state
    this.props._set_nodeByNodeBasic(nodeBasic);
  }

  _handleClick_belongsDelete(event){
    event.preventDefault();
    event.stopPropagation();

    this.props._reset_searchSelection(this.props.currentSet); //nodtice, 'currentSet' is integer
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  _render_node() {
    //determine the id of current node
    const nodeId = this.props.currentSet;

    return (
        <div
          className={classnames("fontDescrip" ,"colorDescripBlack")}>
          {nodeId in this.props.nounsBasic ? (
            this.props.nounsBasic[nodeId].name) : (
              null
            )}
        </div>
    )
  }

  render(){
    return(
      <div
        className={styles.comNodesSearch}>
        {
          !!this.props.currentSet ? (
            <div
              className={classnames(styles.belongSetBoxNode)}>
              {this._render_node()}
              <div
                className={classnames()}
                onMouseEnter={this._handleEnter_spanDelete}
                onMouseLeave={this._handleLeave_spanDelete}>
                <span
                  style={{fontSize: '1.2rem', cursor: 'pointer', color: '#b8b8b8'}}
                  onClick={this._handleClick_belongsDelete}>
                  {" ╳ "}
                </span>
              </div>
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
