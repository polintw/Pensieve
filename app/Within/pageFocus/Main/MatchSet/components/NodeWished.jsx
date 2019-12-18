import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {NodeSearchModule} from '../../../Component/NodeSearchModule.jsx';
import {updateNodesBasic} from '../../../redux/actions/general.js'


class NodeWished extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingModal: false,
      onNode: false,
      onType: false
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this._handleClick_set_wish = this._handleClick_set_wish.bind(this);
    this._handleClick_wish_delete = this._handleClick_wish_delete.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._set_settingModal = ()=> this.setState((prevState, index)=>{return {settingModal: prevState.settingModal? false: true}});
    this.style={

    }
  }

  _handleClick_set_wish(event){
    event.preventDefault();
    event.stopPropagation();
    //could open node search if the box was empty
    if(!this.props.wishedNode) this._set_settingModal();
  }

  _handleClick_wish_delete(event){
    event.preventDefault();
    event.stopPropagation();

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

    //and pass the choice to
    this.props._set_choiceAnType(nodeBasic.id, this.props.type);

    this.setState((prevState,props)=>{
      return {
        settingModal: false
      };
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    const nodeId = this.props.wishedNode;

    return (
      <div
        className={classnames(styles.boxDepend)}>
        <Link
          to={"/cosmic/nodes/"+nodeId}
          className={classnames('plainLinkButton', styles.boxNode)}
          onMouseEnter={this._handleMouseOn_Node}
          onMouseLeave={this._handleMouseOn_Node}>
          <div
            className={classnames(styles.spanNode, styles.fontNode)}>
            {
              this.state.onNode &&
              <span style={{
                  width: '74%', position: 'absolute', bottom: '10%', left: '5%',
                  borderBottom: 'solid 1px #ff7a5f'
                }}/>
            }
            {nodeId in this.props.nounsBasic ? (
              this.props.nounsBasic[nodeId].name) : (
                null
            )}
          </div>
        </Link>
        <div
          onClick={this._handleClick_wish_delete}>
          <span></span>
        </div>

      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames(styles.comBelongByType)}>
        { //keep NodeSearchModule prior to the title type so it would not block the title
          this.state.settingModal &&
          <div
            className={classnames(styles.boxSettingModal)}>
            <div
              className={classnames(styles.boxTypeSetting)}>
              <span
                className={classnames(
                  styles.spanType,
                  styles.fontType,
                  styles.fontOnType
                )}
                style={{lineHeight: '3rem'}}>
                {this.props.type}</span>
            </div>
            <NodeSearchModule
              type={"belong"}
              _set_nodeChoice={this._set_choiceFromSearch}
              _set_SearchModal_switch={this._set_settingModal}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this._set_settingModal();}}/>
          </div>
        }

        <div
          onClick={this._handleClick_set_wish}>
          <span></span>
        </div>

        {
          this.props.wishedNode && //we skip render if the node was 'undefined' or 'null', both meaning empty list
          this._render_nodeLink()
        }

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
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
)(NodeWished));
