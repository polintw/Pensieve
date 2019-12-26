import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

import {NodeSearchModule} from '../../../../../Component/NodeSearchModule.jsx';


class NodeWilling extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingModal: false,
      onNode: false,
      onType: false
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleClick_nodeTaken = this._handleClick_nodeTaken.bind(this);
    this._handleClick_willing_set = this._handleClick_willing_set.bind(this);
    this._handleClick_willing_delete = this._handleClick_willing_delete.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._set_settingModal = ()=> this.setState((prevState, index)=>{return {settingModal: prevState.settingModal? false: true}});
    this.style={

    }
  }

  _handleClick_nodeTaken(event){
    event.preventDefault();
    event.stopPropagation();
    //any check would be process at higher level
    this.props._submit_taking(this.props.displayingNode);
  }

  _handleClick_willing_set(event){
    event.preventDefault();
    event.stopPropagation();
    //could open node search if the box was empty
    if(!this.props.displayingNode && !this.props.axios) this._set_settingModal();
  }

  _handleClick_willing_delete(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.axios) this.props._submit_remove(this.props.displayingNode);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    const nodeId = this.props.displayingNode;

    return (
      <div
        className={classnames()}>
        <Link
          to={"/cosmic/nodes/"+nodeId}
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleMouseOn_Node}
          onMouseLeave={this._handleMouseOn_Node}>
          <div
            className={classnames()}>
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
          onClick={this._handleClick_willing_delete}>
          <span>
            {this.props.i18nUIString.catalog["submit_remove"]}
          </span>
        </div>
        {
          this.props.demandStatus &&
          <div
            onClick={this._handleClick_nodeTaken}>
            <span>{'take'}</span>
          </div>
        }

      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames()}>
        {
          this.state.settingModal &&
          <div
            className={classnames()}>
            <div
              className={classnames()}>
              <span
                className={classnames()}
                style={{lineHeight: '3rem'}}>
                {this.props.i18nUIString.catalog["catagory_MatchNodes_willing"][1]}
              </span>
            </div>
            <NodeSearchModule
              type={"option"}
              _set_nodeChoice={this.props._set_choiceFromSearch}
              _set_SearchModal_switch={this._set_settingModal}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this._set_settingModal();}}/>
          </div>
        }

        {
          this.props.displayingNode? //we skip render if the node was 'undefined' or 'null', both meaning empty list
          this._render_nodeLink() :
          (
            <div
              onClick={this._handleClick_willing_set}>
              <span>{this.props.i18nUIString.catalog["catagory_MatchNodes_willing"][0]}</span>
              <span>{this.props.i18nUIString.catalog["catagory_MatchNodes_willing"][1]}</span>
            </div>
          )
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
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeWilling));
